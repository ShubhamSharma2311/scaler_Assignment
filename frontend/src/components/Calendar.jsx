import moment from 'moment-timezone';

export default function Calendar({ 
  currentMonth, 
  onMonthChange, 
  selectedDate, 
  onDateSelect,
  minDate = moment(),
  className = ''
}) {
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

  const handleDateClick = (date) => {
    if (date.isBefore(minDate, 'day')) return;
    onDateSelect(date);
  };

  return (
    <div className={className}>
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">{currentMonth.format('MMMM YYYY')}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onMonthChange(currentMonth.clone().subtract(1, 'month'))}
            className="p-2 hover:bg-zinc-800 rounded text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => onMonthChange(currentMonth.clone().add(1, 'month'))}
            className="p-2 hover:bg-zinc-800 rounded text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth().map((day, index) => {
          const isCurrentMonth = day.month() === currentMonth.month();
          const isToday = day.isSame(moment(), 'day');
          const isPast = day.isBefore(minDate, 'day');
          const isSelected = selectedDate && day.isSame(selectedDate, 'day');

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={isPast}
              className={`
                aspect-square p-2 text-sm rounded transition-colors
                ${isSelected 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : !isCurrentMonth 
                    ? 'text-gray-600' 
                    : isPast 
                      ? 'text-gray-700 cursor-not-allowed' 
                      : isToday 
                        ? 'text-white font-bold hover:bg-zinc-800' 
                        : 'text-gray-300 hover:bg-zinc-800'
                }
              `}
            >
              {day.format('D')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
