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
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-lg text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Booking Not Found</h2>
          <p className="text-gray-400">This booking does not exist or has been removed.</p>
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
    <div className="min-h-screen bg-black py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-800">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-gray-400">
              Your booking has been successfully confirmed.
            </p>
          </div>

          <div className="border-t border-b border-zinc-800 py-6 space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Event Type</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                <div className="w-1 h-12 rounded" style={{ backgroundColor: booking.eventType?.color || '#3b82f6' }}></div>
                <div className="space-y-1">
                  <p className="font-semibold text-white">{booking.eventType?.title || 'Event'}</p>
                  {booking.eventType?.description && (
                    <p className="text-sm text-gray-400">{booking.eventType.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 text-white">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{formatDate(booking.date)}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 text-white">
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
                  <span className="text-white">{booking.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white">{booking.email}</span>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h2>
                <p className="text-white">{booking.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-sm text-gray-400 text-center">
              Booking ID: <span className="font-mono text-white">#{booking.id}</span>
            </p>
            
            <div className="flex justify-center">
              <Link
                to={`/book/${booking.eventType?.slug}`}
                className="inline-flex items-center px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Book Another Meeting
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white mb-1">What's Next?</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>Add the event to your calendar</li>
                <li>Prepare any materials you might need</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-amber-900/20 border border-amber-800/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-400 mb-2">Email Notification Status</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p className="font-medium">
                  If you're testing locally: <span className="text-white">Check your email for confirmation</span>
                </p>
                <p className="font-medium">
                  If you're using the deployed version: <span className="text-amber-400">Email delivery may be restricted</span>
                </p>
                <div className="mt-3 pt-3 border-t border-amber-800/30">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="font-medium text-gray-300">Why?</span> Free hosting providers restrict SMTP (email) ports to prevent spam. 
                    Email works perfectly in local development, but may be blocked in deployed environments.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    <span className="font-medium text-gray-300">Production Solution:</span> API-based email services (Resend, SendGrid, AWS SES) 
                    should be used instead of SMTP as they operate over HTTPS and aren't affected by port restrictions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
