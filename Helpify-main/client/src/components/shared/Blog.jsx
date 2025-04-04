/** @format */

// Correct paths for images in the public folder
const BloggerImg = '/BloggerImg.png';
const TVImg = '/TVImg.png';

const PressingImg = '/PressingImg.png';
const CleaningWindowImg = '/CleaningWindowImg.png';

const ElectricityWires = '/ElectricityWires.png';
const WallPaintImg = '/WallPaintImg.jpg';
const YardCareImg = '/YardCareImg.png';
const FurnitureImg = '/FurnitureImg.jpg';

// These can still be imported normally since they are from `src`
import BlogCard from '../../ui/BlogCard.jsx';
import NewsCard from '../../ui/NewsCard.jsx';

function Blog() {
  return (
    <>
      <div className="flex flex-col items-center pt-6 lg:pt-[120px]  w-full h-auto bg-[#FAF7F2]">
        {/* Our Blog Upper Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-screen-xl px-6 lg:px-[120px] gap-10">
          {/* Left Section Image */}
          <div className="flex-shrink-0 h-[443px] w-full lg:w-[386px]">
            <img
              className="bg-lightgray bg-no-repeat rounded-tl-[255.246px] rounded-tr-[255.246px] rounded-br-[0px] rounded-bl-[0px] w-full h-full object-cover"
              src={BloggerImg}
              alt="BloggerPic"
            />
          </div>
          {/* Right Section Content */}
          <div className="flex flex-col items-start gap-6 lg:gap-[24px]">
            {/* Top Icon */}
            <div className="w-[69px] h-[40.149px] text-[#FFB067]">
              <i className="fas fa-quote-left text-[40.149px]"></i>
            </div>
            {/* Content */}
            <div className="flex flex-col items-start gap-6 lg:gap-[44px]">
              {/* Upper Content */}
              <div className="flex flex-col items-start gap-4 lg:gap-[18px]">
                <p className="text-[#141414] font-wixmadefor text-lg lg:text-[24px] font-semibold leading-[36px] max-w-full lg:max-w-[501px]">
                  "I have been a customer of Helpify for the last 5+ years and
                  my lawn has looked great. The last few years Farhan has been
                  treating my lawn and he takes the time to explain the process
                  and does a fantastic job, he great.”
                </p>
                <p className="text-[rgba(20,20,20,0.75)] font-wixmadefor text-sm lg:text-[18px] font-normal leading-[27px]">
                  ’Highest Rated Service Company in Lahore’
                </p>
              </div>
              {/* Lower Content */}
              <p className="text-[#141414] font-wixmadefor font-semibold leading-[30px] text-sm lg:text-[18px]">
                Kamran Khalid, PIA
              </p>
            </div>
          </div>
        </div>

        {/* Our Blog Lower Section */}
        <div className="flex flex-col items-center py-6 lg:py-[120px] w-full h-auto bg-[#FFF]">
          <div className="flex flex-col items-center gap-[60px] w-full max-w-screen-xl px-6 lg:px-[120px]">
            {/* Heading */}
            <div className="flex justify-between items-center w-full">
              <h2 className="text-[#141414] text-center font-wixmadefor text-2xl lg:text-[48px] font-bold capitalize leading-normal">
                Our Blog
              </h2>
            </div>
            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] w-full max-w-screen-xl">
              {/* Blog Cards */}
              <BlogCard
                image={TVImg}
                time="5 min read"
                date="September | 2023"
                title="The benefits of an organized home office"
              />
              <BlogCard
                image={PressingImg}
                time="8 min read"
                date="September | 2023"
                title="Why you should consider hiring a Maintenance service"
              />
              <BlogCard
                image={CleaningWindowImg}
                time="6 min read"
                date="September | 2023"
                title="The benefits of professional window cleaning"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Latest News */}
      <div className="flex flex-col items-center w-full h-auto p-6 lg:p-[120px_0px] bg-[#FAF7F2]">
        <div className="flex flex-col items-start w-full max-w-screen-xl gap-[60px] px-6 lg:px-[120px]">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-[#141414] font-wixmadefor text-2xl lg:text-[48px] font-bold leading-normal tracking-[-0.48px] capitalize">
              Latest News From the Industry
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px] w-full h-full">
            {[
              {
                image: ElectricityWires,
                date: 'Garden / Sep 26, 2022',
                title: 'Best Electric wiring for house safety',
              },
              {
                image: WallPaintImg,
                date: 'Garden / Sep 26, 2022',
                title: 'Which one is best for your wall?',
              },
              {
                image: YardCareImg,
                date: 'Garden / Sep 26, 2022',
                title: '5 Fall Yard Care & Maintenance Tips',
              },
              {
                image: FurnitureImg,
                date: 'Garden / Sep 26, 2022',
                title: '5 Steps to Design The Furniture of Your Dreams',
              },
            ].map((card, index) => (
              <NewsCard
                key={index}
                image={card.image}
                date={card.date}
                title={card.title}
              />
            ))}
          </div>
        </div>
      </div>
      ;
    </>
  );
}

export default Blog;
