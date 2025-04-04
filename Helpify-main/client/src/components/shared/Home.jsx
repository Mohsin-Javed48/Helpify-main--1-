/** @format */

const workerImg = '/workerImg.png';
const ServiceIcon = '/Icon10.png';
const BookIcon = '/Icon11.png';
const RelaxIcon = '/Icon12.png';
const Bluearrow = '/bluearrow.png';
const Yellowarrow = '/yellowarrow.png';

const HandymanIcon = '/Icon1.png';
const HandymanBackImg = '/HandymanBackImg.jpg';

const ACRepairIcon = '/Icon2.png';
const ACRepairBackImg = '/ACRepairBackImg.jpg';

const PainterIcon = '/Icon3.png';
const PainterBackImg = '/PainterBackImg.jpg';

const PlumberIcon = '/Icon4.png';
const PlumberBackImg = '/PlumberBackImg.png';

const CarpenterIcon = '/Icon5.png';
const CarpenterBackImg = '/CarpenterBackImg.jpg';

const ElectricianIcon = '/Icon6.png';
const ElectricianBackImg = '/ElectricianBackImg.png';

const HomeAppliancesIcon = '/Icon7.png';
const HomeAppBackImg = '/HomeAppBackImg.jpg';

const GeyserIcon = '/Icon8.png';
const GeyserBackImg = '/GeyserBackImg.jpeg';

const GardnerIcon = '/Icon9.png';
const GardenerBackImg = '/GardenerBackImg.jpg';

import Carousell from './Carousell';
import BookButton from '../../ui/BookButton';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* Booking summary */}

      <div
        className="bg-cover bg-center bg-no-repeat h-screen w-full"
        style={{ backgroundImage: `url(${workerImg})` }}
      >
        {/* Content */}
        <div className="flex flex-col justify-center items-center sm:items-start max-w-screen-xl mx-auto h-full px-[25px] sm:px-[40px]">
          <h1 className="text-center sm:text-start text-[#ffff] not-italic text-white font-bold text-[25px] sm:text-[48px] md:text-[64px] lg:text-[78px] leading-normal capitalize tracking-[-2.34px]">
            Get Help From <br />
            Experienced Person, <br />
            And Made Life Easy.
          </h1>
          <BookButton
            text="Book Appointment"
            onClick={() => console.log('Primary button clicked!')}
            variant="primary"
          />
        </div>
      </div>

      {/* Service List  */}

      <div className="py-[100px] flex flex-col items-center justify-center w-screen bg-white
      
      ">
        <div className="mb-[50px]">
          <h2 className="not-italic text-[#000] font-bold text-[28px] sm:text-[30px] md:text-[38px] lg:text-[48px] leading-normal tracking-[-0.48px]">
            Our Services
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-start not-italic text-[#141414] font-semibold text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] leading-[34px]">
          {[
            {
              bgImg: HandymanBackImg,
              icon: HandymanIcon,
              title: 'Handyman',
              name: 'handyman',
            },
            {
              bgImg: ACRepairBackImg,
              icon: ACRepairIcon,
              title: 'AC Repair',
              name: 'acRepair',
            },
            {
              bgImg: PainterBackImg,
              icon: PainterIcon,
              title: 'Painter',
              name: 'painter',
            },
            {
              bgImg: PlumberBackImg,
              icon: PlumberIcon,
              title: 'Plumber',
              name: 'plumber',
            },
            {
              bgImg: CarpenterBackImg,
              icon: CarpenterIcon,
              title: 'Carpenter',
              name: 'carpenter',
            },
            {
              bgImg: ElectricianBackImg,
              icon: ElectricianIcon,
              title: 'Electrician',
              name: 'electrician',
            },
            {
              bgImg: HomeAppBackImg,
              icon: HomeAppliancesIcon,
              title: 'Home Appliances',
              name: 'homeAppliences',
            },
            {
              bgImg: GeyserBackImg,
              icon: GeyserIcon,
              title: 'Geyser',
              name: 'geyser',
            },
            {
              bgImg: GardenerBackImg,
              icon: GardnerIcon,
              title: 'Gardener',
              name: 'gardner',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="cursor-pointer group flex flex-col justify-center items-start gap-[28px] w-[270px] md:w-[320px] lg:w-[270px] xl:w-[370px]   h-[164px] transition-all duration-300 ease-in-out relative"
              onClick={() =>
                navigate(`/services/${item.name}`)
              }
            >
              {/* Background Image Layer */}
              <div
                className="rounded-xl absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundImage: `url(${item.bgImg})` }}
              ></div>

              {/* Content Layer */}
              <div className="relative z-10 pl-[24px]">
                <img
                  src={item.icon}
                  alt="not found"
                  className="h-[65px] transition-colors duration-300 group-hover:text-white group-hover:filter group-hover:brightness-0 group-hover:invert"
                />
                <h3 className="transition-colors duration-300 group-hover:text-[#ffff]">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking steps */}

      <div className="w-screen bg-[#F4F4F4] flex flex-col items-center justify-center gap-[60px] py-[70px] sm:py-[80px] md:py-[100px] lg:py-[120px]">
        <h1 className="text-center not-italic text-[#141414] font-bold text-[20px] sm:text-[30px] md:text-[40px] lg:text-[48px]  leading-normal tracking-[-0.48px]">
          Quick and Easy Booking in 3 Simple Steps!
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] sm:gap-[50px] lg:gap-[90px] xl:gap-[102px] mx-[50px] sm:mx-[80px] md:mx-[100px] lg:mx-[80px] xl:mx-[135px]  relative">
          {/* Arrow Between Step 1 and Step 2 */}
          <img
            src={Bluearrow}
            alt="Blue Arrow"
            className="hidden lg:block absolute top-[50%] left-[32%] transform -translate-y-1/2 -translate-x-1/2"
          />
          {/* Arrow Between Step 2 and Step 3 */}
          <img
            src={Yellowarrow}
            alt="Yellow Arrow"
            className="hidden lg:block absolute top-[50%] left-[68%] transform -translate-y-1/2 -translate-x-1/2"
          />
          {/* Step 1: Select Service */}
          <div className="bg-[#FFFFFF] flex flex-col justify-center items-center p-[20px] sm:p-[28px] md:p-[34px] rounded-[16px] gap-[15px] sm:gap-[25px] shadow-xl">
            <img
              src={ServiceIcon}
              alt="Select Service"
              className="h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] md:h-[110px] md:w-[110px] lg:h-[120px] lg:w-[120px]"
            />
            <h2 className="text-center not-italic text-[#141414] font-bold text-[20px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px]  leading-[46px] tracking-[-0.36px]">
              Select Service
            </h2>
            <p className="text-center not-italic text-custom-gray font-normal text-[12px] sm:text-[15px] md:text-[18px] leading-[30px]">
              Read verified reviews by owners like you and choose a sitter who
              Read verified reviews by owners like you and choose a sitter who
              great
            </p>
          </div>
          {/* Step 2: Book Your Day */}
          <div className="bg-[#FFFFFF] flex flex-col justify-center items-center p-[20px] sm:p-[28px] rounded-[16px] gap-[15px] sm:gap-[25px] shadow-xl">
            <img
              src={BookIcon}
              alt="Book Your Day"
              className="h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] md:h-[110px] md:w-[110px] lg:h-[120px] lg:w-[120px]"
            />
            <h2 className="text-center not-italic text-[#141414] font-bold text-[20px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px] leading-[46px] tracking-[-0.36px]">
              Book Your Day
            </h2>
            <p className="text-center not-italic text-custom-gray font-normal text-[12px] sm:text-[15px] md:text-[18px] leading-[30px]">
              Read verified reviews by owners like you and choose a sitter who
              Read verified reviews by owners like you and choose a sitter who
              great.
            </p>
          </div>
          {/* Step 3: Have Relax */}
          <div className="bg-[#FFFFFF] flex flex-col justify-center items-center p-[20px] sm:p-[28px] rounded-[16px] gap-[15px] sm:gap-[25px] shadow-xl">
            <img
              src={RelaxIcon}
              alt="Have Relax"
              className="h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] md:h-[110px] md:w-[110px] lg:h-[120px] lg:w-[120px]"
            />
            <h2 className="text-center not-italic text-[#141414] font-bold text-[20px] sm:text-[30px] md:text-[32px] lg:text-[34px] xl:text-[36px] leading-[46px] tracking-[-0.36px]">
              Have Relax
            </h2>
            <p className="text-center not-italic text-custom-gray font-normal text-[12px] sm:text-[15px] md:text-[18px] leading-[30px]">
              Read verified reviews by owners like you and choose a sitter who
              Read verified reviews by owners like you and choose a sitter who
              great.
            </p>
          </div>
        </div>
        <BookButton
          text="Book Appointment"
          onClick={() => console.log('Primary button clicked!')}
          variant="secondary"
        />
      </div>

      {/* Customer Stat Info */}

      <div className="bg-[#242D7D] flex flex-col justify-center items-center py-[100px] gap-[60px]">
        <h1 className="text-center not-italic text-[#ffff] font-bold text-[17px] sm:text-[25px] md:text-[35px] lg:text-[48px] leading-normal tracking-[-0.48] capitalize">
          Customer Satisfaction Stats
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[18.67px] md:gap-[20.67px] lg:gap-[16.67px]">
          <div className="rounded-[16px] w-[210px] sm:w-[255px] md:w-[265px] lg:w-[270px] xl:w-[280px] flex flex-col justify-center items-start border border-[#ffff] py-[24px] pl-[24px] pr-[70px]">
            <h2 className="not-italic text-[#ffff] font-bold text-[12px] sm:text-[20px] md:text-[36px] leading-[46px] tracking-[-0.36]">
              100+
            </h2>
            <p className="not-italic text-custom-white font-normal text-[12px] sm:text-[15px] md:text-[18px] leading-[30px]">
              Client Served
            </p>
          </div>
          <div className="rounded-[16px] w-[210px] sm:w-[255px] md:w-[265px] lg:w-[270px] xl:w-[280px] flex flex-col justify-center items-start border border-[#ffff] py-[24px] pl-[24px] pr-[70px]">
            <h2 className="not-italic text-[#ffff] font-bold text-[12px] sm:text-[20px] md:text-[36px] leading-[46px] tracking-[-0.36]">
              800+
            </h2>
            <p className="not-italic text-custom-white font-normal text-[12px] sm:text-[15px] md:text-[18px] leading-[30px]">
              Served animals
            </p>
          </div>
          <div className="rounded-[16px] w-[210px] sm:w-[255px] md:w-[265px] lg:w-[270px] xl:w-[280px] flex flex-col justify-center items-start border border-[#ffff] py-[24px] pl-[24px] pr-[70px]">
            <h2 className="not-italic text-[#ffff] font-bold text-[12px] sm:text-[20px] md:text-[36px] leading-[46px] tracking-[-0.36]">
              4+
            </h2>
            <p className="not-italic text-custom-white font-normal text-[12px] sm:text-[15px] md:text-[18px] leading-[30px]">
              Combined years
            </p>
          </div>
          <div className="rounded-[16px] w-[210px] sm:w-[255px] md:w-[265px] lg:w-[270px] xl:w-[280px] flex flex-col justify-center items-start border border-[#ffff] py-[24px] pl-[24px] pr-[70px]">
            <h2 className="not-italic text-[#ffff] font-bold text-[12px] sm:text-[20px] md:text-[36px] leading-[46px] tracking-[-0.36]">
              1000
            </h2>
            <p className="not-italic text-custom-white font-normal text-[12px] sm:text-[15px] md:text-[18px] leading-[30px]">
              Miles Walked
            </p>
          </div>
        </div>
        <BookButton
          text="Book Appointment"
          onClick={() => console.log('Primary button clicked!')}
          variant="outline"
        />
      </div>

      {/* Carousel */}
      <div>
        <Carousell />
      </div>
    </>
  );
}

export default Home;
