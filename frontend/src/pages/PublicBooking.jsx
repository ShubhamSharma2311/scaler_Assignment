import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import moment from 'moment-timezone';

export default function PublicBooking() {
  const { slug } = useParams();
  const [eventType, setEventType] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    const loadEventType = async () => {
      try {
        const data = await api.eventTypes.getBySlug(slug);
        setEventType(data);
      } catch (error) {
        console.error('Failed to load event type:', error);
      }
    };
    
    loadEventType();
  }, [slug]);

  useEffect(() => {
    if (selectedDate && eventType) {
      const loadSlots = async () => {
        setLoading(true);
        try {
          const data = await api.bookings.getSlots({
            slug,
            date: selectedDate.format('YYYY-MM-DD'),
            timezone: 'UTC'
          });
          setAvailableSlots(data.slots || []);
        } catch (error) {
          console.error('Failed to load slots:', error);
          setAvailableSlots([]);
        }
        setLoading(false);
      };
      
      loadSlots();
    }
  }, [selectedDate, eventType, slug]);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;

    try {
      const bookingData = {
        eventTypeId: eventType.id,
        name: formData.name,
        email: formData.email,
        date: selectedDate.format('YYYY-MM-DD'),
        startTime: selectedSlot.time,
        endTime: selectedSlot.endTime,
        timezone: 'UTC',
        notes: formData.notes
      };

      await api.bookings.create(bookingData);
      alert('Booking created successfully!');
      setFormData({ name: '', email: '', notes: '' });
      setSelectedDate(null);
      setSelectedSlot(null);
    } catch (error) {
      alert('Failed to create booking. This time slot may no longer be available.');
      console.error('Error creating booking:', error);
    }
  };

  if (!eventType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-2 h-20 rounded" style={{ backgroundColor: eventType.color }}></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{eventType.title}</h1>
              {eventType.description && (
                <p className="text-gray-600 mt-2">{eventType.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{eventType.duration} minutes</span>
                </div>
                {eventType.bufferTime > 0 && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{eventType.bufferTime} min buffer</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Select a Date</h2>
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

          <div className="bg-white rounded-lg shadow-sm border p-6">
            {!selectedDate ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">Select a date to see available times</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedDate.format('dddd, MMMM D, YYYY')}
                </h2>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500">Loading available times...</div>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No available times for this date</p>
                  </div>
                ) : (
                  <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
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

                {selectedSlot && (
                  <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
                    <h3 className="font-semibold text-gray-900">Enter Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        placeholder="Any additional information..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Confirm Booking
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
