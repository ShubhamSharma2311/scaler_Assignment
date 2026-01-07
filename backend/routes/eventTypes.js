const express = require('express');
const router = express.Router();
const {
  getAllEventTypes,
  getEventTypeBySlug,
  createEventType,
  updateEventType,
  deleteEventType
} = require('../controllers/eventTypeController');

router.get('/', getAllEventTypes);
router.get('/:slug', getEventTypeBySlug);
router.post('/', createEventType);
router.put('/:id', updateEventType);
router.delete('/:id', deleteEventType);

module.exports = router;
