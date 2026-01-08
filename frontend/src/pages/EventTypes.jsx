import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function EventTypes() {
  const [eventTypes, setEventTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
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
      alert('Failed to save event type');
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
    setCustomQuestions(event.questions || []);
    setShowModal(true);
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
        loadEventTypes();
      } catch (error) {
        alert('Failed to delete event type');
        console.error('Error deleting event type:', error);
      }
    }
  };

  const copyLink = (slug) => {
    const link = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Types</h1>
          <p className="text-gray-600 mt-2">Create events to share for people to book on your calendar.</p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null);
            setFormData({ title: '', description: '', duration: 30, slug: '', color: '#3b82f6', bufferTime: 0 });
            setShowModal(true);
          }}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
        >
          + New Event Type
        </button>
      </div>

      <div className="grid gap-4">
        {eventTypes.map((event) => (
          <div key={event.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-1 h-16 rounded" style={{ backgroundColor: event.color }}></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{event.duration} min</span>
                    {event.bufferTime > 0 && <span>Buffer: {event.bufferTime} min</span>}
                    <span className="text-blue-600">/{event.slug}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyLink(event.slug)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
                  title="Copy link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleEdit(event)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingEvent ? 'Edit Event Type' : 'Create New Event Type'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30 Minute Meeting"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="A quick meeting to discuss..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30-min-meeting"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be used in the booking URL</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                    <input
                      type="number"
                      required
                      min="5"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Time (minutes)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bufferTime}
                      onChange={(e) => setFormData({ ...formData, bufferTime: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20 h-10 border rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Custom Questions</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Question
                  </button>
                </div>
                
                {customQuestions.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No custom questions added yet</p>
                ) : (
                  <div className="space-y-4">
                    {customQuestions.map((q, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 mr-4">
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                              placeholder="Enter your question"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 hover:text-red-700"
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
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Required</span>
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
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  {editingEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
