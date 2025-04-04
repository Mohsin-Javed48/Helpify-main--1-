import { useEffect, useState } from 'react';
function DateTimeSelector() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots = [];
      const today = new Date();
      console.log(today.getDate());

      // Adjust the timezone (if needed, as per your example)
      for (let i = 0; i < 10; i++) {
        const newTime = new Date(today.getTime() + i * 30 * 60 * 1000); // Add 30 minutes
        const timeInPST = newTime.toLocaleString('en-US', {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        slots.push(timeInPST);
      }

      setTimeSlots(slots);
    };

    generateTimeSlots();
  }, []);

  // Generate the next 10 days (including today)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    // console.log(today);
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        day: date.toLocaleString('en-US', { weekday: 'short' }), // e.g., 'Sat'
        date: date.getDate(), // e.g., 4
      });
    }
    return dates;
  };

  const dates = generateDates();

  return (
    <div className="rounded-lg">
      <h2 className="mb-[24px] text-black font-poppins text-[18px] sm:text-[20px] md:text-[22px]  lg:text-[25px] font-bold leading-normal tracking-[-0.25px]">
        Select Date and Time
      </h2>
      <div className="mb-[25px] grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-[4px] sm:gap-[5px] md:gap-[6px] lg:gap-[8px]  border p-[10px] sm:p-[12px] md:p-[14px] lg:p-[16px]">
        {dates.map((item, index) => (
          <button
            key={index}
            onMouseEnter={() => setHoveredIndex(index)} // Set hovered index on mouse enter
            onMouseLeave={() => setHoveredIndex(null)} // Reset on mouse leave
            className={`flex flex-col items-center justify-center rounded p-2 ${
              hoveredIndex === index
                ? 'bg-[#5900FF] text-[white]' // Background blue and text white when hovered
                : 'bg-white text-black hover:bg-gray-200' // Default and hover fallback styles
            }`}
          >
            <span className="font-bold text-black font-poppins text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] leading-normal tracking-[-0.22px]">
              {item.date}
            </span>
            <span className="text-sm">{item.day}</span>
          </button>
        ))}
      </div>
      <div className="mb-[38px]">
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-[4px] sm:gap-[5px] md:gap-[6px] lg:gap-[8px] border p-4">
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-2 bg-gray-100 rounded hover:bg-[#5900FF] hover:text-[white] cursor-pointer" // Default and hover fallback styles
            >
              {/* Display the formatted time */}
              <span className="font-bold text-black font-poppins text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] leading-normal tracking-[-0.22px]">
                {slot.split(' ')[0]}
              </span>
              <span className="text-sm">{slot.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DateTimeSelector;
