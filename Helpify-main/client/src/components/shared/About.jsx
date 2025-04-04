/** @format */

import ChecklistItem from '../../ui/CheckListItem';

// Correct paths for images directly in the public folder
const WindowCleanerImg = '/WindowCleanerImg.png';
const OfficeCleanersImg = '/imOfficeCleanersImg.png';
const SinkCleanerImg = '/SinkCleanerImg.png';
const CleaningProfessionalImg = '/CleaingProfessionalWithSteamCleaner.png';

const HandPointerIcon = '/HandPointer.png';
const MedalIcon = '/MedalIcon.png';
const StopWatchIcon = '/StopWatchIcon.png';
const ShieldCheckIcon = '/ShieldCheckIcon.png';

import FAQItem from './FAQItem'; // Import the FAQItem component

function About() {
  return (
    <>
      {/* Standards Page */}
      <div className="py-[120px] flex flex-col items-center w-full bg-[#FAE084]">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center w-full max-w-screen-xl px-4 sm:px-6 md:px-8 lg:px-[120px] gap-8">
          {/* Left Section */}
          <div className="flex flex-col items-start gap-6 w-full md:w-[50%]">
            <div className="flex flex-col justify-center">
              <h2 className="text-[#141414] font-[Wix Madefor Display] text-[32px] sm:text-[40px] lg:text-[48px] font-bold capitalize tracking-[-0.48px] leading-tight">
                We maintain the highest standards for our house Maintenance
              </h2>
            </div>
            <div className="flex flex-col items-start">
              <ul className="flex flex-col gap-6">
                <ChecklistItem>
                  Get the same trusted Work, every time
                </ChecklistItem>
                <ChecklistItem>Background checked</ChecklistItem>
                <ChecklistItem>Bonded & Insured</ChecklistItem>
                <ChecklistItem>Eco-friendly green cleaning</ChecklistItem>
                <ChecklistItem>Our own supplies & equipment</ChecklistItem>
                <ChecklistItem>Hundreds of 5-star reviews</ChecklistItem>
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-center w-full md:w-[50%] gap-6">
            {/* Top Image */}
            <div
              className="w-[80%] md:w-[292px] h-[300px] bg-lightgray bg-cover bg-center bg-no-repeat rounded-tl-[16px] rounded-tr-[16px] rounded-br-[156px] rounded-bl-[156px]"
              style={{
                backgroundImage: `url(${WindowCleanerImg})`,
              }}
            ></div>
            {/* Bottom Images */}
            <div className="flex flex-wrap md:flex-nowrap gap-4 w-full ">
              <div
                className="w-[80%] md:w-[292px] h-[400px] bg-lightgray bg-cover bg-center bg-no-repeat rounded-tl-[156px] rounded-tr-[156px] rounded-br-[16px] rounded-bl-[16px]"
                style={{
                  backgroundImage: `url(${SinkCleanerImg})`,
                }}
              ></div>
              <div
                className="w-[80%] md:w-[292px] h-[320px] bg-lightgray bg-cover bg-no-repeat rounded-tl-[156px] rounded-tr-[156px] rounded-br-[16px] rounded-bl-[16px]"
                style={{
                  backgroundImage: `url(${OfficeCleanersImg})`,
                  backgroundSize: `164.742% 100%`,
                  backgroundPosition: `-54.523px 0px`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Reasons Page */}
      <div className="flex flex-col items-center bg-white w-full py-[120px]">
        {/* Upper Portion */}
        <div className="flex flex-col items-center w-full max-w-screen-xl gap-[60px] px-4 sm:px-6 md:px-8 lg:px-[120px]">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-[60px]">
            {/* Image */}
            <div
              className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[492px] lg:h-[495px] flex-shrink-0 bg-lightgray bg-no-repeat bg-center"
              style={{
                backgroundImage: `url(${CleaningProfessionalImg})`,
                backgroundPosition: '-150.828px 0px',
                backgroundSize: '150.915% 100%',
              }}
            ></div>

            {/* Text */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-[18px] font-wixmadefor mt-6 lg:mt-0">
              <h2 className="text-[#141414] text-[28px] sm:text-[36px] md:text-[48px] font-bold capitalize tracking-[-0.48px] leading-normal max-w-[537px]">
                Reasons To Choose Helpify, Today
              </h2>
              <p className="text-[rgba(20,20,20,0.75)] text-[14px] sm:text-[16px] md:text-[18px] font-normal leading-[22px] sm:leading-[26px] md:leading-[30px] max-w-[528px]">
                Choose Helpify for exceptional Household services. Contact us
                today to schedule your first session and experience the
                difference.
              </p>
            </div>
          </div>

          {/* Line */}
          <div className="w-full h-0 border-t border-[rgba(20,20,20,0.18)]"></div>

          {/* Lower Portion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {/* First Reason */}
            <div className="flex flex-col items-center lg:items-start gap-[16px]">
              <div className="flex items-center justify-center w-[72px] h-[72px] bg-gray-100 rounded-full">
                <img
                  className="h-[48px] w-[48px]"
                  src={HandPointerIcon}
                  alt="not found"
                />
              </div>
              <p className="text-[#141414] text-[14px] sm:text-[16px] font-medium leading-[22px] sm:leading-[26px] max-w-[270px] font-wixmadefor text-center lg:text-left">
                Enjoy the same trusted Service, every time you book
              </p>
            </div>

            {/* Second Reason */}
            <div className="flex flex-col items-center lg:items-start gap-[16px]">
              <div className="flex items-center justify-center w-[72px] h-[72px] bg-gray-100 rounded-full">
                <img
                  className="h-[48px] w-[48px]"
                  src={MedalIcon}
                  alt="not found"
                />
              </div>
              <p className="text-[#141414] text-[14px] sm:text-[16px] font-medium leading-[22px] sm:leading-[26px] max-w-[270px] font-wixmadefor text-center lg:text-left">
                We only use high quality safe, yet effective solutions
              </p>
            </div>

            {/* Third Reason */}
            <div className="flex flex-col items-center lg:items-start gap-[16px]">
              <div className="flex items-center justify-center w-[72px] h-[72px] bg-gray-100 rounded-full">
                <img
                  className="h-[48px] w-[48px]"
                  src={StopWatchIcon}
                  alt="not found"
                />
              </div>
              <p className="text-[#141414] text-[14px] sm:text-[16px] font-medium leading-[22px] sm:leading-[26px] max-w-[270px] font-wixmadefor text-center lg:text-left">
                You have the option to provide your own custom supplies
              </p>
            </div>

            {/* Fourth Reason */}
            <div className="flex flex-col items-center lg:items-start gap-[16px]">
              <div className="flex items-center justify-center w-[72px] h-[72px] bg-gray-100 rounded-full">
                <img
                  className="h-[48px] w-[48px]"
                  src={ShieldCheckIcon}
                  alt="not found"
                />
              </div>
              <p className="text-[#141414] text-[14px] sm:text-[16px] font-medium leading-[22px] sm:leading-[26px] max-w-[270px] font-wixmadefor text-center lg:text-left">
                100% secure online payments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Page */}
      <div className="flex flex-col items-center bg-[#F4F4F4] w-full py-[120px]">
        <div className="flex flex-col items-center gap-[60px] w-full max-w-screen-xl px-4 sm:px-6 md:px-8 lg:px-[120px]">
          <h2 className="text-[#141414] text-[28px] sm:text-[36px] md:text-[48px] tracking-[-0.48px] font-bold leading-normal capitalize text-center font-wixmadefor">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col items-start w-full gap-5 sm:gap-6 md:gap-8">
            {[
              {
                question: 'How do I pay for my Household service?',
                answer:
                  'You can pay online using credit card or cash on delivery.',
              },
              {
                question: 'Are the Service teams trained and supervised?',
                answer:
                  'We aim for a consistent cleaning team for your home, though occasional changes may occur due to illness, vacations, or staff rotations. Our dedicated team leader ensures familiarity with your home and trains others to meet your expectations for quality service.',
              },
              {
                question: 'Will I always have the same Service team?',
                answer:
                  'We strive to provide the same team for consistency whenever possible.',
              },
              {
                question: 'Can I be out while my house is being Serviced?',
                answer:
                  'Yes, you can. Just ensure access arrangements are made beforehand.',
              },
              {
                question: 'Is your service guaranteed?',
                answer:
                  'Yes, we offer a satisfaction guarantee for our services.',
              },
              {
                question: 'Do I tip the house?',
                answer:
                  'Tipping is optional but appreciated for great service.',
              },
              {
                question: 'What are your rates for house services?',
                answer:
                  'Our rates vary based on the type and scope of the service. Contact us for details.',
              },
            ].map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
