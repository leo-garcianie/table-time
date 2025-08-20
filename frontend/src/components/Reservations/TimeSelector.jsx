import { TIME_SLOTS } from "../../utils/constants.js";

const TimeSelector = ({ selectedTime, onTimeSelect, availableTimes = [] }) => {
  const isTimeAvailable = (time) => {
    return availableTimes.includes(time) || availableTimes.length === 0;
  };

  return (
    <div className="card z-99">
      <div className="space-x-2 text-dark">
        <h3 className="text-lg font-semibold">Choose a time</h3>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {TIME_SLOTS.map((time) => {
          const isAvailable = isTimeAvailable(time);
          const isSelected = selectedTime === time;

          return (
            <button
              key={time}
              onClick={() => isAvailable && onTimeSelect(time)}
              disabled={!isAvailable}
              className={`
                px-2 py-1 rounded-lg text-sm font-base transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "bg-primary text-white"
                    : isAvailable
                      ? "bg-white border border-gray-200 text-dark hover:border-primary/40 hover:bg-primary/10"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                }
              `}
            >
              {time}
            </button>
          );
        })}
      </div>

      {availableTimes.length > 0 &&
        availableTimes.length < TIME_SLOTS.length && (
          <p className="text-sm text-dark">
            * Only the available times for the selected date are shown
          </p>
        )}
    </div>
  );
};

export default TimeSelector;
