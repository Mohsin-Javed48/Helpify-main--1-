function NewsCard({ image, date, title }) {
  return (
    <>
      <div className="flex flex-col items-start gap-[24px]">
        <div
          className="w-[237.5px] h-[363px] bg-lightgray bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <div className="flex flex-col items-start gap-[8px]">
          <p className="text-[rgba(20,20,20,0.75)] font-wixmadefor text-[16px] font-normal leading-[26px]">
            {date}
          </p>
          <p className="text-[#141414] font-wixmadefor text-[24px] font-semibold leading-[36px] tracking-[-0.24px]">
            {title}
          </p>
        </div>
      </div>
    </>
  );
}

export default NewsCard;
