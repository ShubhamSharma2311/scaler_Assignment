import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import moment from 'moment-timezone';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const data = await api.bookings.getById(id);
        setBooking(data);
      } catch (error) {
        console.error('Failed to load booking:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600">This booking does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return moment(date).format('dddd, MMMM D, YYYY');
  };

  const formatTime = (time) => {
    return moment(time, 'HH:mm').format('h:mm A');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Your booking has been successfully confirmed. You will receive a confirmation email shortly.
            </p>
          </div>

          <div className="border-t border-b py-6 space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Event Type</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                <div className="w-1 h-12 rounded" style={{ backgroundColor: booking.eventType?.color || '#3b82f6' }}></div>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">{booking.eventType?.title || 'Event'}</p>
                  {booking.eventType?.description && (
                    <p className="text-sm text-gray-600">{booking.eventType.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 text-gray-900">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{formatDate(booking.date)}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 text-gray-900">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                  <span className="text-gray-500 text-sm">({booking.eventType?.duration || 0} minutes)</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Your Details</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-900">{booking.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-900">{booking.email}</span>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h2>
                <p className="text-gray-900">{booking.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Booking ID: <span className="font-mono text-gray-900">#{booking.id}</span>
            </p>
            
            <div className="flex justify-center">
              <Link
                to={`/book/${booking.eventType?.slug}`}
                className="inline-flex items-center px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Book Another Meeting
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900 mb-1">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>Check your email for the meeting confirmation</li>
                <li>Add the event to your calendar</li>
                <li>Prepare any materials you might need</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
