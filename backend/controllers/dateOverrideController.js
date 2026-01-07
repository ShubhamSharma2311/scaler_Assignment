const prisma = require('../config/database');

const getAllDateOverrides = async (req, res) => {
  try {
    const dateOverrides = await prisma.dateOverride.findMany({
      orderBy: { date: 'asc' }
    });
    res.json(dateOverrides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createDateOverride = async (req, res) => {
  try {
    const { date, isBlocked, startTime, endTime } = req.body;
    
    const dateOverride = await prisma.dateOverride.create({
      data: {
        date: new Date(date),
        isBlocked,
        startTime,
        endTime
      }
    });
    
    res.status(201).json(dateOverride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDateOverride = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, isBlocked, startTime, endTime } = req.body;
    
    const dateOverride = await prisma.dateOverride.update({
      where: { id: parseInt(id) },
      data: {
        date: date ? new Date(date) : undefined,
        isBlocked,
        startTime,
        endTime
      }
    });
    
    res.json(dateOverride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDateOverride = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.dateOverride.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Date override deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDateOverrides,
  createDateOverride,
  updateDateOverride,
  deleteDateOverride
};
