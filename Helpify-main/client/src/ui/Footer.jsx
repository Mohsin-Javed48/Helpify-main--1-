/** @format */

import CallIcon from "/Call.png";
import EmailIcon from "/Email.png";
import LocationIcon from "/Location.png";

export default function Footer() {
  return (
    <footer className="bg-[#091054] text-white pt-[100px] pb-[50px] font-wixmadefor">
      <div className="container mx-auto px-[45px] md:px-[135px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-[30.5px] xl:gap-[85.5px]">
          <div className="flex flex-col gap-[24px]">
            <h3 className="not-italic text-[#ffff] font-semibold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-[30px] sm:leading-[36px] tracking-[-0.24px]">
              Opening Hours
            </h3>
            <ul className="flex flex-col gap-[18px] not-italic text-custom-white font-normal text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] leading-[22px] sm:leading-[26px]">
              <li className="">Mon - Fri: 9:00AM - 6:00PM</li>
              <li className="">Saturday: 9:00AM - 6:00PM</li>
              <li className="">Sunday: Closed</li>
            </ul>
          </div>
          <div className="flex flex-col gap-[24px]">
            <h3 className="not-italic text-[#ffff] font-semibold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-[30px] sm:leading-[36px] tracking-[-0.24px]">
              Social Media
            </h3>
            <ul className="flex flex-col gap-[18px] not-italic text-custom-white font-normal text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] leading-[22px] sm:leading-[26px]">
              <li>
                <a href="#" className="hover:underline">
                  Twitter ↗
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Facebook ↗
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Instagram ↗
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-[24px]">
            <h3 className="not-italic text-[#ffff] font-semibold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-[30px] sm:leading-[36px] tracking-[-0.24px]">
              Contacts
            </h3>
            <ul className="flex flex-col gap-[18px] not-italic text-custom-white font-normal text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] leading-[22px] sm:leading-[26px]">
              <li className="flex items-center gap-[16px]">
                <span className="border border-custom-white p-[10px] rounded-[3px]">
                  <img
                    src={CallIcon}
                    alt=""
                    className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] md:w-[20px] md:h-[20px] lg:h-[22px] lg:w-[22px] xl:h-[24px] xl:w-[24px]"
                  />
                </span>
                <span>
                  +91-9837366124 <br /> +91-8650704147
                </span>
              </li>
              <li className="flex items-center gap-[16px]">
                <span className="border border-custom-white p-[10px] rounded-[3px]">
                  <img
                    src={EmailIcon}
                    alt=""
                    className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] md:w-[20px] md:h-[20px] lg:h-[22px] lg:w-[22px] xl:h-[24px] xl:w-[24px]"
                  />
                </span>
                <span className="">
                  uvesnusrain13@gmail.com <br />
                  www.webtechsolution.in
                </span>
              </li>
              <li className="flex items-center gap-[16px]">
                <span className="border border-custom-white p-[10px] rounded-[3px]">
                  <img
                    src={LocationIcon}
                    alt=""
                    className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] md:w-[20px] md:h-[20px] lg:h-[22px] lg:w-[22px] xl:h-[24px] xl:w-[24px]"
                  />
                </span>
                <span>
                  257 Fireweed Ln, Ketchikan, <br />
                  Alaska 99901, USA
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row not-italic text-custom-white font-normal text-[9px] md:text-[12px] lg:text-[14px] xl:text-[16px] leading-[22px] sm:leading-[26px] tracking-[-0.16] mt-8 border-t border-white/20 pt-4 justify-between text-sm">
          <span>© 2023 Webtechsolution.in</span>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
