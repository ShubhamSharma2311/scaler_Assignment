import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import Modal from '../components/Modal';

export default function EventTypes() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    slug: '',
    color: '#3b82f6',
    bufferTime: 0
  });
  const [customQuestions, setCustomQuestions] = useState([]);

  useEffect(() => {
    const loadEventTypes = async () => {
      try {
        const data = await api.eventTypes.getAll();
        setEventTypes(data);
      } catch (error) {
        console.error('Failed to load event types:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEventTypes();
  }, []);

  const loadEventTypes = async () => {
    try {
      const data = await api.eventTypes.getAll();
      setEventTypes(data);
    } catch (error) {
      console.error('Failed to load event types:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        questions: customQuestions
      };
      
      if (editingEvent) {
        await api.eventTypes.update(editingEvent.id, dataToSubmit);
      } else {
        await api.eventTypes.create(dataToSubmit);
      }
      setShowModal(false);
      setEditingEvent(null);
      setFormData({ title: '', description: '', duration: 30, slug: '', color: '#3b82f6', bufferTime: 0 });
      setCustomQuestions([]);
      loadEventTypes();
    } catch (error) {
      toast.error('Failed to save event type');
      console.error('Error saving event type:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      duration: event.duration,
      slug: event.slug,
      color: event.color || '#3b82f6',
      bufferTime: event.bufferTime || 0
    });
    // Strip database fields to prevent Prisma creation errors
    setCustomQuestions(
      (event.questions || []).map(q => ({
        question: q.question,
        type: q.type,
        required: q.required,
        options: q.options
      }))
    );
    setShowModal(true);
  };

  const toggleExpand = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const addQuestion = () => {
    setCustomQuestions([...customQuestions, { question: '', type: 'text', required: false }]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...customQuestions];
    updated[index][field] = value;
    setCustomQuestions(updated);
  };

  const removeQuestion = (index) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event type?')) {
      try {
        await api.eventTypes.delete(id);
        toast.success('Event type deleted successfully');
        loadEventTypes();
      } catch (error) {
        toast.error('Failed to delete event type');
        console.error('Error deleting event type:', error);
      }
    }
  };

  const copyLink = (slug) => {
    const link = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const filteredEventTypes = eventTypes.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">Event Types</h1>
            <p className="text-gray-400 text-sm mt-1">Create events to share for people to book on your calendar.</p>
          </div>
          <button
            onClick={() => {
              setEditingEvent(null);
              setFormData({ title: '', description: '', duration: 30, slug: '', color: '#3b82f6', bufferTime: 0 });
              setCustomQuestions([]);
              setShowModal(true);
            }}
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 font-medium transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            <span>New</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-zinc-700"
            />
          </div>
        </div>

        {/* Event Cards */}
        <div className="space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p className="text-gray-400">Loading event types...</p>
            </div>
          ) : (
            <>
              {filteredEventTypes.map((event) => (
                <div
                  key={event.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center justify-between gap-4 p-4">
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => toggleExpand(event.id)}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-medium text-white truncate">{event.title}</h3>
                        <div className="flex items-center gap-1 text-gray-400 text-sm flex-shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{event.duration}m</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="truncate">/{event.slug}</span>
                        {event._count?.bookings > 0 && (
                          <span className="flex items-center gap-1 flex-shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {event._count.bookings}
                          </span>
                        )}
                        {event.questions?.length > 0 && (
                          <span className="flex items-center gap-1 flex-shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {event.questions.length}
                          </span>
                        )}
                      </div>
                    </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => toggleExpand(event.id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    title={expandedEventId === event.id ? "Collapse" : "Expand"}
                  >
                    <svg className={`w-5 h-5 transition-transform ${expandedEventId === event.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Preview Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/book/${event.slug}`, '_blank');
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>

                  {/* Copy Link Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyLink(event.slug);
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Copy link"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(event);
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(event.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedEventId === event.id && (
                <div className="px-4 pb-4 pt-3 border-t border-zinc-800 space-y-3">
                  {event.description && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">Description</p>
                      <p className="text-sm text-gray-300">{event.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">Duration</p>
                      <p className="text-sm text-white">{event.duration} minutes</p>
                    </div>
                    {event.bufferTime > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-1">Buffer Time</p>
                        <p className="text-sm text-white">{event.bufferTime} minutes</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">Color</p>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: event.color || '#3b82f6' }}></div>
                        <p className="text-sm text-white">{event.color || '#3b82f6'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">Total Bookings</p>
                      <p className="text-sm text-white">{event._count?.bookings || 0}</p>
                    </div>
                  </div>

                  {event.questions && event.questions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-2">Custom Questions ({event.questions.length})</p>
                      <div className="space-y-2">
                        {event.questions.map((q, idx) => (
                          <div key={q.id || idx} className="bg-black border border-zinc-800 rounded-lg p-3">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-white flex-1">{q.question}</p>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-gray-400 bg-zinc-800 px-2 py-0.5 rounded">{q.type}</span>
                                {q.required && (
                                  <span className="text-xs text-red-400 bg-red-950/30 px-2 py-0.5 rounded">Required</span>
                                )}
                              </div>
                            </div>
                            {q.options && (
                              <p className="text-xs text-gray-500 mt-1">Options: {q.options}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-gray-500">Created: {new Date(event.createdAt).toLocaleDateString()}</span>
                    {event.updatedAt !== event.createdAt && (
                      <>
                        <span className="text-gray-700">•</span>
                        <span className="text-xs text-gray-500">Updated: {new Date(event.updatedAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {!loading && filteredEventTypes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? 'No results found' : 'No event types yet'}
            </div>
          )}
            </>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} maxWidth="max-w-2xl">
        <div className="p-4 sm:p-6 lg:p-8 w-full">
          <h2 className="text-2xl font-bold mb-6 text-white">
            {editingEvent ? 'Edit Event Type' : 'Create New Event Type'}
          </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30 Minute Meeting"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="A quick meeting to discuss..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30-min-meeting"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be used in the booking URL</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes) *</label>
                    <input
                      type="number"
                      required
                      min="5"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Buffer Time (minutes)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bufferTime}
                      onChange={(e) => setFormData({ ...formData, bufferTime: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20 h-10 bg-zinc-800 border border-zinc-700 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Custom Questions</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="text-sm text-blue-500 hover:text-blue-400 font-medium"
                  >
                    + Add Question
                  </button>
                </div>
                
                {customQuestions.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No custom questions added yet</p>
                ) : (
                  <div className="space-y-4">
                    {customQuestions.map((q, index) => (
                      <div key={index} className="border border-zinc-800 rounded-lg p-4 bg-zinc-800/50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 mr-4">
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                              placeholder="Enter your question"
                              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <select
                            value={q.type}
                            onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="text">Text</option>
                            <option value="textarea">Long Text</option>
                            <option value="number">Number</option>
                          </select>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={q.required}
                              onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-zinc-900 border-zinc-700 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-300">Required</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2 text-gray-300 bg-zinc-800 rounded-lg hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100"
                >
                  {editingEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
      </Modal>
    </div>
  );
}
