import { useState, useEffect } from 'react';
import { api } from '../services/api';
import moment from 'moment-timezone';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('upcoming');

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
    </div>
  );
}
