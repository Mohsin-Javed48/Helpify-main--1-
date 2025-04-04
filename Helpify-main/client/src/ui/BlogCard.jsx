function BlogCard({ image, time, date, title }) {
  return (
    <div className="h-[424px] w-[326.6px] flex-shrink-0">
      {/* Image */}
      {"hello"}
      {"fakhra"}
      <img
        className="bg-lightgray bg-no-repeat bg-cover rounded-2xl h-[292px] w-full object-cover"
        src={image}
        alt={title}
      />
      {/* Time and Date */}
      <div className="flex flex-row items-center gap-4 mt-4">
        {/* Calendar Part */}
        <div className="inline-flex items-center gap-2">
          <div className="w-[20px] h-[20px] text-[#4A4A4A]">
            <i className="fas fa-calendar text-[20px]"></i>
          </div>
          <p className="text-[rgba(20,20,20,0.75)] font-normal text-base leading-[26px] font-wixmadefor">
            {date}
          </p>
        </div>
        {/* Time Part */}
        <div className="inline-flex items-center gap-2">
          <div className="w-[20px] h-[20px] text-[#4A4A4A]">
            <i className="fas fa-clock text-[20px]"></i>
          </div>
          <p className="text-[rgba(20,20,20,0.75)] font-normal text-base leading-[26px] font-wixmadefor">
            {time}
          </p>
        </div>
      </div>
      {/* Title */}
      <p className="text-[#141414] font-wixmadefor text-2xl font-semibold leading-8 mt-4">
        {title}
      </p>
    </div>
  );
}

export default BlogCard;
