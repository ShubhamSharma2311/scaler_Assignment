import { useState, useEffect } from 'react';
import { api } from '../services/api';
import moment from 'moment-timezone';
import Modal from '../components/Modal';
import Calendar from '../components/Calendar';
import TimeSlotPicker from '../components/TimeSlotPicker';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment());

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await api.bookings.getAll({ type: filter });
        setBookings(data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      }
    };
    
    loadBookings();
  }, [filter]);


  const handleCancel = async () => {
    if (!cancelModal) return;

    try {
      await api.bookings.cancel(cancelModal.id);
      setCancelModal(null);
      
      const data = await api.bookings.getAll({ type: filter });
      setBookings(data);
      
      alert('Booking cancelled successfully!');
    } catch (error) {
      alert('Failed to cancel booking');
      console.error('Error cancelling booking:', error);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedSlot) {
      alert('Please select a date and time');
      return;
    }

    try {
      await api.bookings.reschedule(rescheduleModal.id, {
        date: selectedDate.format('YYYY-MM-DD'),
        startTime: selectedSlot.time,
        endTime: selectedSlot.endTime
      });
      
      setRescheduleModal(null);
      setSelectedDate(null);
      setSelectedSlot(null);
      setAvailableSlots([]);
      
      const data = await api.bookings.getAll({ type: filter });
      setBookings(data);
      
      alert('Booking rescheduled successfully!');
    } catch (error) {
      alert('Failed to reschedule booking');
      console.error('Error rescheduling booking:', error);
    }
  };

  const loadSlotsForReschedule = async (date) => {
    if (!rescheduleModal) return;
    
    try {
      const data = await api.bookings.getSlots({
        slug: rescheduleModal.eventType.slug,
        date: date.format('YYYY-MM-DD'),
        timezone: 'UTC'
      });
      setAvailableSlots(data.slots || []);
    } catch (error) {
      console.error('Failed to load slots:', error);
      setAvailableSlots([]);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    loadSlotsForReschedule(date);
  };

  const formatDate = (date) => {
    return moment(date).format('D MMMM YYYY');
  };

  const formatTimeRange = (startTime, endTime) => {
    return `${moment(startTime, 'HH:mm').format('h:mma')} - ${moment(endTime, 'HH:mm').format('h:mma')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">Bookings</h1>
          <p className="text-gray-400 text-sm mt-1">See upcoming and past events booked through your event type links.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-zinc-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'past'
                ? 'bg-zinc-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Past
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-2">
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {filter === 'upcoming' 
                ? 'No upcoming bookings'
                : 'No past bookings'}
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  {/* Date Section */}
                  <div className="flex-shrink-0 w-full sm:w-32">
                    <p className="text-white font-medium text-sm">{formatDate(booking.date)}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {formatTimeRange(booking.startTime, booking.endTime)}
                    </p>
                    <button className="text-blue-500 hover:text-blue-400 text-sm mt-2 font-medium">
                      Join Cal Video
                    </button>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-white font-medium">{booking.eventType?.title || 'Meeting'}</h3>
                      <span className="text-gray-400 text-sm hidden sm:inline">•</span>
                      <span className="text-gray-400 text-sm">{booking.eventType?.duration} Min Meeting</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>You and {booking.name}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {filter === 'upcoming' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRescheduleModal(booking)}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => setCancelModal(booking)}
                        className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      <Modal isOpen={!!rescheduleModal} maxWidth="max-w-4xl">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">Reschedule Booking</h2>
              <p className="text-gray-400 mt-1">{rescheduleModal?.eventType?.title}</p>
            </div>
            <button
              onClick={() => {
                setRescheduleModal(null);
                setSelectedDate(null);
                setSelectedSlot(null);
              }}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Calendar
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              minDate={moment()}
            />

            <div>
              {!selectedDate ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400">Select a date to see available times</p>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-white mb-4">
                    {selectedDate.format('dddd, MMMM D, YYYY')}
                  </h3>
                  <TimeSlotPicker
                    slots={availableSlots}
                    selectedSlot={selectedSlot}
                    onSlotSelect={setSelectedSlot}
                    emptyMessage="No available times for this date"
                  />
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-zinc-800">
            <button
              onClick={() => {
                setRescheduleModal(null);
                setSelectedDate(null);
                setSelectedSlot(null);
              }}
              className="px-4 py-2 text-gray-400 bg-zinc-800 rounded-lg hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              onClick={handleReschedule}
              disabled={!selectedDate || !selectedSlot}
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:bg-zinc-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Confirm Reschedule
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={!!cancelModal}>
        <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center flex-shrink-0 border border-red-800">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">Cancel Booking</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Are you sure you want to cancel this booking with {cancelModal.name}? This action cannot be undone.
                  </p>
                  <div className="bg-zinc-800 rounded-lg p-3 mb-4">
                    <p className="text-white font-medium text-sm">{cancelModal.eventType?.title}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {formatDate(cancelModal.date)} • {formatTimeRange(cancelModal.startTime, cancelModal.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setCancelModal(null)}
                  className="px-4 py-2 text-gray-400 bg-zinc-800 rounded-lg hover:bg-zinc-700 font-medium transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
      </Modal>
    </div>
  );
}
