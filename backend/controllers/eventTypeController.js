const prisma = require('../config/database');

const getAllEventTypes = async (req, res) => {
  try {
    const eventTypes = await prisma.eventType.findMany({
      where: { isActive: true },
      include: {
        questions: true,
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(eventTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEventTypeBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const eventType = await prisma.eventType.findUnique({
      where: { slug },
      include: { questions: true }
    });
    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    res.json(eventType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEventType = async (req, res) => {
  try {
    const { title, description, duration, slug, color, bufferTime, questions } = req.body;
    
    const existingSlug = await prisma.eventType.findUnique({ where: { slug } });
    if (existingSlug) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const eventType = await prisma.eventType.create({
      data: {
        title,
        description,
        duration,
        slug,
        color: color || '#3b82f6',
        bufferTime: bufferTime || 0,
        questions: questions ? {
          create: questions
        } : undefined
      },
      include: { questions: true }
    });
    
    res.status(201).json(eventType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEventType = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, slug, color, bufferTime, questions } = req.body;

    if (slug) {
      const existingSlug = await prisma.eventType.findFirst({
        where: { slug, NOT: { id: parseInt(id) } }
      });
      if (existingSlug) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    // Delete existing questions if questions array is provided (even if empty)
    if (questions !== undefined) {
      await prisma.customQuestion.deleteMany({
        where: { eventTypeId: parseInt(id) }
      });
    }

    const eventType = await prisma.eventType.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        duration,
        slug,
        color,
        bufferTime,
        questions: questions && questions.length > 0 ? {
          create: questions.map(q => ({
            question: q.question,
            type: q.type,
            required: q.required,
            options: q.options
          }))
        } : undefined
      },
      include: { questions: true }
    });
    
    res.json(eventType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEventType = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.eventType.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });
    res.json({ message: 'Event type deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEventTypes,
  getEventTypeBySlug,
  createEventType,
  updateEventType,
  deleteEventType
};
