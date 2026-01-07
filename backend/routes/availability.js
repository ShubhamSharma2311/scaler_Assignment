const express = require('express');
const router = express.Router();
const {
  getAllAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  bulkUpdateAvailability
} = require('../controllers/availabilityController');

router.get('/', getAllAvailability);
router.post('/', createAvailability);
router.post('/bulk', bulkUpdateAvailability);
router.put('/:id', updateAvailability);
router.delete('/:id', deleteAvailability);

module.exports = router;
