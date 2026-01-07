const prisma = require('../config/database');

const getAllAvailability = async (req, res) => {
  try {
    const availability = await prisma.availability.findMany({
      where: { isActive: true },
      orderBy: { dayOfWeek: 'asc' }
    });
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAvailability = async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime, timezone } = req.body;
    
    const availability = await prisma.availability.create({
      data: {
        dayOfWeek,
        startTime,
        endTime,
        timezone: timezone || 'UTC'
      }
    });
    
    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime, timezone, isActive } = req.body;
    
    const availability = await prisma.availability.update({
      where: { id: parseInt(id) },
      data: {
        dayOfWeek,
        startTime,
        endTime,
        timezone,
        isActive
      }
    });
    
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.availability.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bulkUpdateAvailability = async (req, res) => {
  try {
    const { availabilities } = req.body;
    
    await prisma.availability.deleteMany();
    
    const created = await prisma.availability.createMany({
      data: availabilities
    });
    
    res.json({ message: 'Availability updated successfully', count: created.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  bulkUpdateAvailability
};
