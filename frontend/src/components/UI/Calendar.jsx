import { ChevronLeft, ChevronRight } from "lucide-react";
import { DAYS_OF_WEEK, MONTHS } from "../../utils/constants.js";
import { isDateInPast } from "../../utils/helpers.js";
import { useCalendar } from "../../hooks/useCalendar.js";

const Calendar = ({ onDateSelect, selectedDate }) => {
  const {
    calendarDays,
    year,
    month,
    goToNextMonth,
    goToPreviousMonth,
    isToday,
    isCurrentMonth,
  } = useCalendar();

  const handleDateClick = (date) => {
    if (isDateInPast(date)) return;
    onDateSelect(date);
  };

  const isSelectedDate = (date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="card z-99">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft className="size-4 text-dark cursor-pointer" />
        </button>

        <h2 className="text-base font-semibold text-dark">
          {MONTHS[month]} {year}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronRight className="size-4 text-dark cursor-pointer" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-normal text-zinc-600 py-2"
          >
            {day.slice(0, 2)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isPast = isDateInPast(date);
          const isCurrent = isCurrentMonth(date);
          const isCurrentDay = isToday(date);
          const isDateSelected = isSelectedDate(date);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={isPast}
              className={`
                size-8 text-sm rounded-md transition-all duration-200 justify-self-center 
                ${isCurrent ? "text-dark" : "text-gray-400"}
                ${isPast ? "cursor-not-allowed opacity-50" : ""}
                ${
                  isCurrentDay && !isDateSelected
                    ? "bg-primary/30 font-semibold cursor-pointer"
                    : ""
                }
                ${isDateSelected ? "bg-primary text-white font-semibold cursor-pointer" : ""}
                ${
                  !isPast && !isDateSelected && !isCurrentDay
                    ? "hover:bg-gray-100 cursor-pointer"
                    : ""
                }
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
