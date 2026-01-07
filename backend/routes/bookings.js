const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  getAvailableSlots,
  createBooking,
  cancelBooking,
  rescheduleBooking
} = require('../controllers/bookingController');

router.get('/', getAllBookings);
router.get('/slots', getAvailableSlots);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.patch('/:id/cancel', cancelBooking);
router.patch('/:id/reschedule', rescheduleBooking);

module.exports = router;
