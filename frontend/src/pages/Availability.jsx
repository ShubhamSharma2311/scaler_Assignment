import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import Modal from '../components/Modal';

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
      toast.success('Availability saved successfully!');
    } catch (error) {
      toast.error('Failed to save availability');
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
      toast.error('Failed to add date override');
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
        toast.error('Failed to delete date override');
        console.error('Error deleting date override:', error);
      }
    }
  };

  const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Availability</h1>
            <p className="text-gray-400 text-sm">Configure times when you are available for bookings.</p>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            Save
          </button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Schedule Section */}
          <div className="space-y-3">
              {DAYS.map((day, index) => (
                <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleDay(index)}
                        className={`w-11 h-6 rounded-full relative transition-colors ${
                          schedule[index]?.enabled ? 'bg-white' : 'bg-zinc-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full absolute top-0.5 transition-all ${
                            schedule[index]?.enabled
                              ? 'right-0.5 bg-black'
                              : 'left-0.5 bg-zinc-500'
                          }`}
                        ></div>
                      </button>
                      <span className="text-white font-medium">{day}</span>
                    </div>
                    {schedule[index]?.enabled && (
                      <div className="flex items-center gap-2">
                        {schedule[index].slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex items-center gap-2">
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateTimeSlot(index, slotIndex, 'startTime', e.target.value)}
                              className="px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white text-sm focus:border-zinc-700 focus:outline-none"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateTimeSlot(index, slotIndex, 'endTime', e.target.value)}
                              className="px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white text-sm focus:border-zinc-700 focus:outline-none"
                            />
                            <button
                              onClick={() => addTimeSlot(index)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-zinc-700 focus:outline-none"
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

              {/* Date Overrides */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Date Overrides</h3>
                <button
                  onClick={() => setShowOverrideModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-gray-400 hover:text-white hover:border-zinc-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add an override
                </button>

                {dateOverrides.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {dateOverrides.map((override) => (
                  <div key={override.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">
                        {new Date(override.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {override.isBlocked ? (
                          <span className="text-red-500">Blocked</span>
                        ) : (
                          <span>{formatTime12Hour(override.startTime)} - {formatTime12Hour(override.endTime)}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteOverride(override.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Override Modal */}
      <Modal isOpen={showOverrideModal}>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Add Date Override</h2>
            <form onSubmit={handleAddOverride}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    value={overrideData.date}
                    onChange={(e) => setOverrideData({ ...overrideData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-zinc-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={overrideData.isBlocked}
                      onChange={(e) => setOverrideData({ ...overrideData, isBlocked: e.target.checked })}
                      className="w-4 h-4 rounded bg-zinc-800 border-zinc-700"
                    />
                    <span className="text-sm font-medium text-gray-400">Block this date (unavailable)</span>
                  </label>
                </div>

                {!overrideData.isBlocked && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={overrideData.startTime}
                        onChange={(e) => setOverrideData({ ...overrideData, startTime: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-zinc-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">End Time</label>
                      <input
                        type="time"
                        value={overrideData.endTime}
                        onChange={(e) => setOverrideData({ ...overrideData, endTime: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:border-zinc-700 focus:outline-none"
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
                  className="px-4 py-2 text-gray-400 bg-zinc-800 rounded-lg hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 font-medium"
                >
                  Add Override
                </button>
              </div>
            </form>
        </div>
      </Modal>
    </div>
  );
}