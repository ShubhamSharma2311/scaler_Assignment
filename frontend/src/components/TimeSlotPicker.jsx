import moment from 'moment-timezone';

export default function TimeSlotPicker({ 
  slots = [], 
  selectedSlot, 
  onSlotSelect, 
  emptyMessage = 'No available times',
  timeFormat = '12h',
  showIndicator = false,
  loading = false 
}) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  const formatTime = (time) => {
    if (timeFormat === '24h') {
      return moment(time, 'HH:mm').format('HH:mm');
    }
    return moment(time, 'HH:mm').format('h:mm A');
  };

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {slots.map((slot, index) => (
        <button
          key={index}
          onClick={() => onSlotSelect(slot)}
          className={`
            w-full ${showIndicator ? 'flex items-center gap-2' : ''} p-3 text-left rounded-lg border transition-colors
            ${selectedSlot?.time === slot.time
              ? 'bg-white text-black border-white'
              : 'border-zinc-800 text-white hover:border-zinc-700 hover:bg-zinc-800'
            }
          `}
        >
          {showIndicator && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
          <span>{formatTime(slot.time)}</span>
        </button>
      ))}
    </div>
  );
}
