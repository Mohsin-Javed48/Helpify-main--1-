import { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full bg-[#FFF] rounded-2xl">
      <div
        className="flex items-center justify-between w-full p-6 text-[#141414] text-[20px] sm:text-[24px] font-wixmadefor font-semibold cursor-pointer"
        onClick={handleToggle}
      >
        <span>{question}</span>
        <i
          className={`fas ${
            isOpen ? "fa-minus-circle" : "fa-plus-circle"
          } text-black text-[16px] sm:text-[20px]`}
        ></i>
      </div>
      {isOpen && (
        <p className="text-[rgba(20,20,20,0.75)] p-4 pr-10 sm:p-6 sm:pr-16 text-[16px] sm:text-[18px] leading-[30px] font-normal font-wixmadefor">
          {answer}
        </p>
      )}
    </div>
  );
};

export default FAQItem;
