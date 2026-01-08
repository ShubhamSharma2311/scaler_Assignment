import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import moment from 'moment-timezone';
import Calendar from '../components/Calendar';
import TimeSlotPicker from '../components/TimeSlotPicker';

export default function PublicBooking() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeFormat, setTimeFormat] = useState('12h'); // '12h' or '24h'
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: ''
  });
  const [questionAnswers, setQuestionAnswers] = useState({});

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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setShowBookingForm(false);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || submitting) return;

    // Validate required custom questions
    if (eventType.questions && eventType.questions.length > 0) {
      for (const question of eventType.questions) {
        if (question.required && !questionAnswers[question.id]) {
          toast.error(`Please answer the required question: ${question.question}`);
          return;
        }
      }
    }

    setSubmitting(true);

    try {
      const bookingData = {
        eventTypeId: eventType.id,
        name: formData.name,
        email: formData.email,
        date: selectedDate.format('YYYY-MM-DD'),
        startTime: selectedSlot.time,
        endTime: selectedSlot.endTime,
        timezone: 'UTC',
        notes: formData.notes,
        answers: eventType.questions ? eventType.questions.map(q => ({
          questionId: q.id,
          answer: questionAnswers[q.id] || ''
        })).filter(a => a.answer) : []
      };

      const result = await api.bookings.create(bookingData);
      navigate(`/confirmation/${result.id}`);
    } catch (error) {
      setSubmitting(false);
      toast.error('Failed to create booking. This time slot may no longer be available.');
      console.error('Error creating booking:', error);
    }
  };

  const formatTimeSlot = (time) => {
    if (timeFormat === '24h') {
      return time;
    }
    return moment(time, 'HH:mm').format('h:mma');
  };

  if (!eventType) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-lg text-gray-400">Loading...</div>
      </div>
    );
  }

  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button
            onClick={() => setShowBookingForm(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-gray-300 font-semibold">
                S
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">{eventType.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{eventType.duration}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Cal Video</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gray-300">
              <p className="mb-2">{selectedDate.format('dddd, MMMM D, YYYY')}</p>
              <p>{formatTimeSlot(selectedSlot.time)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-zinc-700 focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-zinc-700 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-zinc-700 focus:outline-none"
                rows="3"
                placeholder="Any additional information..."
              />
            </div>

            {eventType.questions && eventType.questions.length > 0 && (
              <div className="border-t border-zinc-800 pt-4 space-y-4">
                <h3 className="font-semibold text-white">Additional Questions</h3>
                {eventType.questions.map((question) => (
                  <div key={question.id}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {question.question} {question.required && <span className="text-red-500">*</span>}
                    </label>
                    {question.type === 'textarea' ? (
                      <textarea
                        required={question.required}
                        value={questionAnswers[question.id] || ''}
                        onChange={(e) => setQuestionAnswers({ ...questionAnswers, [question.id]: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-zinc-700 focus:outline-none"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={question.type === 'number' ? 'number' : 'text'}
                        required={question.required}
                        value={questionAnswers[question.id] || ''}
                        onChange={(e) => setQuestionAnswers({ ...questionAnswers, [question.id]: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-zinc-700 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-black py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <div className="lg:w-80 bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-800 p-6 lg:p-8">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-gray-300 font-semibold flex-shrink-0">
              S
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-sm">Shubham Sharma</p>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-white mb-3">{eventType.title}</h1>
          
          <div className="space-y-3 text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">30m</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Cal Video</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Asia/Kolkata</span>
            </div>
          </div>
        </div>

        {/* Center - Calendar */}
        <div className="flex-1 p-6 lg:p-8">
          <Calendar
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            minDate={moment()}
            className=""
          />
        </div>

        {/* Right - Time Slots */}
        <div className="lg:w-80 bg-zinc-950 border-t lg:border-t-0 lg:border-l border-zinc-800 p-6 lg:p-8">
          {!selectedDate ? (
            <div className="text-center py-12 text-gray-500">
              <p>Select a date</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">
                  {selectedDate.format('ddd DD')}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setTimeFormat('12h')}
                    className={`px-3 py-1 text-xs rounded ${
                      timeFormat === '12h'
                        ? 'bg-zinc-800 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    12h
                  </button>
                  <button
                    onClick={() => setTimeFormat('24h')}
                    className={`px-3 py-1 text-xs rounded ${
                      timeFormat === '24h'
                        ? 'bg-zinc-800 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    24h
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Loading...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No available times</p>
                </div>
              ) : (
                <TimeSlotPicker
                  slots={availableSlots}
                  selectedSlot={selectedSlot}
                  onSlotSelect={handleTimeSlotSelect}
                  emptyMessage="No available times"
                  timeFormat={timeFormat}
                  showIndicator={true}
                  loading={loading}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-500 border-t border-zinc-900">
        <p className="text-sm">Cal.com</p>
      </div>
    </div>
  );
}
