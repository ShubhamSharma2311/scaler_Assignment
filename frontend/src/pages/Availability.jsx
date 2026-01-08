import { useState, useEffect } from 'react';
import { api } from '../services/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Availability() {
  const [schedule, setSchedule] = useState({});
  const [timezone, setTimezone] = useState('UTC');
  const [dateOverrides, setDateOverrides] = useState([]);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideData, setOverrideData] = useState({
    date: '',
    isBlocked: false,
    startTime: '09:00',
    endTime: '17:00'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const availData = await api.availability.getAll();
        const overridesData = await api.dateOverrides.getAll();
        
        const scheduleMap = {};
        availData.forEach(slot => {
          if (!scheduleMap[slot.dayOfWeek]) {
            scheduleMap[slot.dayOfWeek] = [];
          }
          scheduleMap[slot.dayOfWeek].push({ startTime: slot.startTime, endTime: slot.endTime });
        });
        
        const defaultSchedule = {};
        DAYS.forEach((_, index) => {
          if (scheduleMap[index]) {
            defaultSchedule[index] = {
              enabled: true,
              slots: scheduleMap[index]
            };
          } else {
            defaultSchedule[index] = {
              enabled: index >= 1 && index <= 5,
              slots: [{ startTime: '09:00', endTime: '17:00' }]
            };
          }
        });
        
        setSchedule(defaultSchedule);
        setDateOverrides(overridesData);
        if (availData.length > 0) {
          setTimezone(availData[0].timezone);
        }
      } catch (error) {
        console.error('Failed to load availability:', error);
      }
    };
    
    loadData();
  }, []);

  const toggleDay = (day) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], enabled: !schedule[day].enabled }
    });
  };

  const updateTimeSlot = (day, index, field, value) => {
    const newSlots = [...schedule[day].slots];
    newSlots[index][field] = value;
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], slots: newSlots }
    });
  };

  const addTimeSlot = (day) => {
    const newSlots = [...schedule[day].slots, { startTime: '09:00', endTime: '17:00' }];
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], slots: newSlots }
    });
  };

  const removeTimeSlot = (day, index) => {
    const newSlots = schedule[day].slots.filter((_, i) => i !== index);
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], slots: newSlots.length > 0 ? newSlots : [{ startTime: '09:00', endTime: '17:00' }] }
    });
  };

  const handleSave = async () => {
    try {
      const availabilities = [];
      Object.keys(schedule).forEach(day => {
        if (schedule[day].enabled) {
          schedule[day].slots.forEach(slot => {
            availabilities.push({
              dayOfWeek: parseInt(day),
              startTime: slot.startTime,
              endTime: slot.endTime,
              timezone: timezone
            });
          });
        }
      });
      
      await api.availability.bulkUpdate({ availabilities });
      alert('Availability saved successfully!');
    } catch (error) {
      alert('Failed to save availability');
      console.error('Error saving availability:', error);
    }
  };

  const handleAddOverride = async (e) => {
    e.preventDefault();
    try {
      await api.dateOverrides.create(overrideData);
      const overridesData = await api.dateOverrides.getAll();
      setDateOverrides(overridesData);
      setShowOverrideModal(false);
      setOverrideData({ date: '', isBlocked: false, startTime: '09:00', endTime: '17:00' });
    } catch (error) {
      alert('Failed to add date override');
      console.error('Error adding date override:', error);
    }
  };

  const handleDeleteOverride = async (id) => {
    if (window.confirm('Are you sure you want to delete this date override?')) {
      try {
        await api.dateOverrides.delete(id);
        const overridesData = await api.dateOverrides.getAll();
        setDateOverrides(overridesData);
      } catch (error) {
        alert('Failed to delete date override');
        console.error('Error deleting date override:', error);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Availability</h1>
        <p className="text-gray-600 mt-2">Configure times when you are available for bookings.</p>
      </div>

      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Chicago">America/Chicago</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
          </select>
        </div>

        <div className="space-y-4">
          {DAYS.map((day, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={schedule[index]?.enabled || false}
                    onChange={() => toggleDay(index)}
                    className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-900 w-24">{day}</span>
                </div>
                {schedule[index]?.enabled && (
                  <button
                    onClick={() => addTimeSlot(index)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add time
                  </button>
                )}
              </div>

              {schedule[index]?.enabled && (
                <div className="ml-8 space-y-2">
                  {schedule[index].slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, slotIndex, 'startTime', e.target.value)}
                        className="px-3 py-1.5 border rounded text-sm"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(index, slotIndex, 'endTime', e.target.value)}
                        className="px-3 py-1.5 border rounded text-sm"
                      />
                      {schedule[index].slots.length > 1 && (
                        <button
                          onClick={() => removeTimeSlot(index, slotIndex)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Date Overrides</h2>
            <p className="text-sm text-gray-600 mt-1">Add dates when your availability changes from your daily hours</p>
          </div>
          <button
            onClick={() => setShowOverrideModal(true)}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            + Add Override
          </button>
        </div>

        <div className="space-y-2">
          {dateOverrides.map((override) => (
            <div key={override.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">
                  {new Date(override.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-sm text-gray-600">
                  {override.isBlocked ? (
                    <span className="text-red-600">Blocked</span>
                  ) : (
                    <span>{override.startTime} - {override.endTime}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteOverride(override.id)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {dateOverrides.length === 0 && (
            <p className="text-gray-500 text-center py-4">No date overrides added yet</p>
          )}
        </div>
      </div>

      {showOverrideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Add Date Override</h2>
            <form onSubmit={handleAddOverride}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={overrideData.date}
                    onChange={(e) => setOverrideData({ ...overrideData, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={overrideData.isBlocked}
                      onChange={(e) => setOverrideData({ ...overrideData, isBlocked: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Block this date (unavailable)</span>
                  </label>
                </div>

                {!overrideData.isBlocked && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={overrideData.startTime}
                        onChange={(e) => setOverrideData({ ...overrideData, startTime: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        value={overrideData.endTime}
                        onChange={(e) => setOverrideData({ ...overrideData, endTime: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowOverrideModal(false);
                    setOverrideData({ date: '', isBlocked: false, startTime: '09:00', endTime: '17:00' });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Add Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
