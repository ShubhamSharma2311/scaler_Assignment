import { useState, useEffect } from 'react';
import { api } from '../services/api';
import moment from 'moment-timezone';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [rescheduleModal, setRescheduleModal] = useState(null);
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

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.bookings.cancel(id);
        const data = await api.bookings.getAll({ type: filter });
        setBookings(data);
      } catch (error) {
        alert('Failed to cancel booking');
        console.error('Error cancelling booking:', error);
      }
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

  const getDaysInMonth = () => {
    const start = currentMonth.clone().startOf('month').startOf('week');
    const end = currentMonth.clone().endOf('month').endOf('week');
    const days = [];
    let day = start.clone();

    while (day.isSameOrBefore(end)) {
      days.push(day.clone());
      day.add(1, 'day');
    }

    return days;
  };

  const handleDateSelect = (date) => {
    if (date.isBefore(moment(), 'day')) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    loadSlotsForReschedule(date);
  };

  const formatDate = (date) => {
    return moment(date).format('ddd, MMM D, YYYY');
  };

  const formatTime = (time) => {
    return moment(time, 'HH:mm').format('h:mm A');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-2">See upcoming and past events booked through your event type links.</p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 border-b">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filter === 'upcoming'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filter === 'past'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Past
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-white border rounded-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500">
              {filter === 'upcoming' 
                ? 'You have no upcoming bookings at the moment.'
                : 'You have no past bookings.'}
            </p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-1 h-16 rounded" style={{ backgroundColor: booking.eventType?.color || '#3b82f6' }}></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.eventType?.title || 'Event'}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                          <span className="text-gray-400">({booking.eventType?.duration || 0} min)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 mt-3 space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700">{booking.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">{booking.email}</span>
                    </div>
                    {booking.notes && (
                      <div className="flex items-start space-x-2 text-sm mt-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span className="text-gray-600">{booking.notes}</span>
                      </div>
                    )}
                  </div>

                  {booking.status === 'cancelled' && (
                    <div className="ml-4 mt-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Cancelled
                      </span>
                    </div>
                  )}
                </div>

                {booking.status !== 'cancelled' && filter === 'upcoming' && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setRescheduleModal(booking);
                        setSelectedDate(null);
                        setSelectedSlot(null);
                        setAvailableSlots([]);
                        setCurrentMonth(moment());
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Reschedule booking"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Cancel booking"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {rescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Reschedule Booking</h2>
                  <p className="text-gray-600 mt-1">{rescheduleModal.eventType?.title}</p>
                </div>
                <button
                  onClick={() => {
                    setRescheduleModal(null);
                    setSelectedDate(null);
                    setSelectedSlot(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Select New Date</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, 'month'))}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentMonth(currentMonth.clone().add(1, 'month'))}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="text-center font-semibold text-gray-900 mb-4">
                    {currentMonth.format('MMMM YYYY')}
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth().map((day, index) => {
                      const isCurrentMonth = day.month() === currentMonth.month();
                      const isToday = day.isSame(moment(), 'day');
                      const isPast = day.isBefore(moment(), 'day');
                      const isSelected = selectedDate && day.isSame(selectedDate, 'day');

                      return (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(day)}
                          disabled={isPast}
                          className={`
                            aspect-square p-2 text-sm rounded transition-colors
                            ${!isCurrentMonth ? 'text-gray-300' : ''}
                            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                            ${isToday ? 'font-bold' : ''}
                            ${isSelected ? 'bg-black text-white hover:bg-gray-800' : ''}
                          `}
                        >
                          {day.format('D')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  {!selectedDate ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500">Select a date to see available times</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-gray-900 mb-4">
                        {selectedDate.format('dddd, MMMM D, YYYY')}
                      </h3>

                      {availableSlots.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No available times for this date</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {availableSlots.map((slot, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedSlot(slot)}
                              className={`
                                w-full p-3 text-left rounded-lg border transition-colors
                                ${selectedSlot?.time === slot.time
                                  ? 'bg-black text-white border-black'
                                  : 'hover:border-gray-400 hover:bg-gray-50'
                                }
                              `}
                            >
                              {moment(slot.time, 'HH:mm').format('h:mm A')}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setRescheduleModal(null);
                    setSelectedDate(null);
                    setSelectedSlot(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  disabled={!selectedDate || !selectedSlot}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
