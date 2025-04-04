/** @format */

import Slider from "react-slick";
import { useRef, useState } from "react";
import FounderIcon from "/Ellipse 15.png";

const testimonials = [
  { name: "Zohaib", role: "Founder and co-CEO", review: "Great app! Cleaner and simpler than competitors.", rating: 5 },
  { name: "Fakhra Rabbani", role: "Founder and co-CEO", review: "Great app! Cleaner and simpler than competitors.", rating: 5 },
  { name: "Zaina", role: "Founder and co-CEO", review: "Great app! Cleaner and simpler than competitors.", rating: 5 },
  { name: "Mohsin", role: "Founder and co-CEO", review: "Great app! Cleaner and simpler than competitors.", rating: 5 },
];

const Carousel = () => {
  const sliderRef = useRef(null);
  const [activeButton, setActiveButton] = useState("");
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="flex flex-col gap-10 bg-[#F4F4F4] py-20 px-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#141414]">Valuable Words From Customers</h2>
        <div className="flex gap-4">
          {["prev", "next"].map((dir) => (
            <svg
              key={dir}
              width="59"
              height="60"
              viewBox="0 0 59 60"
              fill="none"
              onClick={() => {
                dir === "prev" ? sliderRef.current.slickPrev() : sliderRef.current.slickNext();
                setActiveButton(dir);
              }}
              className={`w-12 h-12 cursor-pointer ${activeButton === dir ? "opacity-100" : "opacity-40"}`}
            >
              <circle cx="29.5" cy="30" r="29.5" fill="#2937B1" />
              <path d={`M${dir === "prev" ? "16.5 30H42.5M16.5 30L27.5 19M16.5 30L27.5 41" : "42.5 30H16.5M42.5 30L31.5 19M42.5 30L31.5 41"}`} stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {testimonials.map(({ name, role, review, rating }, index) => (
          <div key={index} className="p-4">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
              <div className="flex gap-1">{Array(rating).fill(0).map((_, i) => <span key={i} className="text-yellow-400">★</span>)}</div>
              <p className="text-sm text-[#141414]">{review}</p>
              <div className="flex gap-4 items-center">
                <img src={FounderIcon} alt="Founder" className="w-10 h-10" />
                <div>
                  <h3 className="font-semibold text-sm text-[#141414]">{name}</h3>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
