const prisma = require('../config/database');
const moment = require('moment-timezone');
const { sendBookingConfirmation, sendCancellationEmail } = require('../services/emailService');

const getAllBookings = async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let whereClause = {};
    
    if (status) {
      whereClause.status = status;
    } else {
      whereClause.status = { not: 'cancelled' };
    }
    
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        eventType: true,
        answers: {
          include: { question: true }
        }
      },
      orderBy: { date: type === 'past' ? 'desc' : 'asc' }
    });
    
    // Filter bookings based on date AND time
    const now = moment();
    const filteredBookings = bookings.filter(booking => {
      const bookingDateTime = moment(`${booking.date.toISOString().split('T')[0]} ${booking.endTime}`, 'YYYY-MM-DD HH:mm');
      
      if (type === 'upcoming') {
        return bookingDateTime.isAfter(now);
      } else if (type === 'past') {
        return bookingDateTime.isBefore(now);
      }
      return true;
    });
    
    res.json(filteredBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        eventType: true,
        answers: {
          include: { question: true }
        }
      }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { slug, date, timezone } = req.query;
    
    const eventType = await prisma.eventType.findUnique({
      where: { slug }
    });
    
    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    
    const selectedDate = moment.tz(date, timezone || 'UTC');
    const dayOfWeek = selectedDate.day();
    
    const dateOverride = await prisma.dateOverride.findFirst({
      where: {
        date: {
          gte: selectedDate.startOf('day').toDate(),
          lt: selectedDate.endOf('day').toDate()
        }
      }
    });
    
    if (dateOverride && dateOverride.isBlocked) {
      return res.json({ slots: [] });
    }
    
    let availability;
    if (dateOverride && dateOverride.startTime && dateOverride.endTime) {
      availability = [{
        startTime: dateOverride.startTime,
        endTime: dateOverride.endTime
      }];
    } else {
      availability = await prisma.availability.findMany({
        where: {
          dayOfWeek,
          isActive: true
        }
      });
    }
    
    if (availability.length === 0) {
      return res.json({ slots: [] });
    }
    
    const slots = [];
    const duration = eventType.duration;
    const bufferTime = eventType.bufferTime || 0;
    
    for (const avail of availability) {
      const [startHour, startMinute] = avail.startTime.split(':').map(Number);
      const [endHour, endMinute] = avail.endTime.split(':').map(Number);
      
      let currentTime = selectedDate.clone().set({ hour: startHour, minute: startMinute, second: 0 });
      const endTime = selectedDate.clone().set({ hour: endHour, minute: endMinute, second: 0 });
      
      while (currentTime.clone().add(duration, 'minutes').isSameOrBefore(endTime)) {
        const slotStart = currentTime.format('HH:mm');
        const slotEnd = currentTime.clone().add(duration, 'minutes').format('HH:mm');
        
        const existingBooking = await prisma.booking.findFirst({
          where: {
            eventTypeId: eventType.id,
            date: {
              gte: selectedDate.startOf('day').toDate(),
              lt: selectedDate.endOf('day').toDate()
            },
            startTime: slotStart,
            status: { not: 'cancelled' }
          }
        });
        
        if (!existingBooking && currentTime.isAfter(moment.tz(timezone || 'UTC'))) {
          slots.push({
            time: slotStart,
            endTime: slotEnd,
            available: true
          });
        }
        
        currentTime.add(duration + bufferTime, 'minutes');
      }
    }
    
    res.json({ slots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { eventTypeId, name, email, date, startTime, endTime, timezone, notes, answers } = req.body;
    
    const existingBooking = await prisma.booking.findFirst({
      where: {
        eventTypeId,
        date: new Date(date),
        startTime,
        status: { not: 'cancelled' }
      }
    });
    
    if (existingBooking) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }
    
    const booking = await prisma.booking.create({
      data: {
        eventTypeId,
        name,
        email,
        date: new Date(date),
        startTime,
        endTime,
        timezone: timezone || 'UTC',
        notes,
        answers: answers ? {
          create: answers.map(ans => ({
            questionId: ans.questionId,
            answer: ans.answer
          }))
        } : undefined
      },
      include: {
        eventType: true,
        answers: {
          include: { question: true }
        }
      }
    });
    
    // Send confirmation emails
    try {
      await sendBookingConfirmation(booking, booking.eventType);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the booking if email fails
    }
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' },
      include: { eventType: true }
    });
    
    // Send cancellation emails
    try {
      await sendCancellationEmail(booking, booking.eventType);
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.body;
    
    const existingBooking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        eventTypeId: existingBooking.eventTypeId,
        date: new Date(date),
        startTime,
        status: { not: 'cancelled' },
        NOT: { id: parseInt(id) }
      }
    });
    
    if (conflictingBooking) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }
    
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        startTime,
        endTime
      },
      include: {
        eventType: true,
        answers: {
          include: { question: true }
        }
      }
    });
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  getAvailableSlots,
  createBooking,
  cancelBooking,
  rescheduleBooking
};
