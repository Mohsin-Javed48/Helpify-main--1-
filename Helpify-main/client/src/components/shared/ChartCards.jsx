const CustomerChart = '/CustomerChart.png';

function ChartCards() {
  return (
    <>
      <div className="col-span-2 flex flex-col bg-[#fff] p-[10px]">
        <div className="flex justify-between items-center">
          <h2 className="text-[#464255] text-[15px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-bold leading-normal">
            Pie Chart
          </h2>
          <div className="flex gap-[10px]">
            <div className="flex gap-[5px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 2H5C4.20435 2 3.44129 2.31607 2.87868 2.87868C2.31607 3.44129 2 4.20435 2 5V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2ZM20 19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V5C4 4.73478 4.10536 4.48043 4.29289 4.29289C4.48043 4.10536 4.73478 4 5 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V19Z"
                  fill="#A3A3A3"
                />
              </svg>
              <h2 className="text-[#464255] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-semibold leading-normal">
                Chart
              </h2>
            </div>
            <div className="flex gap-[5px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 2H5C4.20435 2 3.44129 2.31607 2.87868 2.87868C2.31607 3.44129 2 4.20435 2 5V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2ZM20 19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V5C4 4.73478 4.10536 4.48043 4.29289 4.29289C4.48043 4.10536 4.73478 4 5 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V19Z"
                  fill="#FF5B5B"
                />
                <path
                  d="M15.5 7H8.5C8.10218 7 7.72064 7.15804 7.43934 7.43934C7.15804 7.72064 7 8.10218 7 8.5V15.5C7 15.8978 7.15804 16.2794 7.43934 16.5607C7.72064 16.842 8.10218 17 8.5 17H15.5C15.8978 17 16.2794 16.842 16.5607 16.5607C16.842 16.2794 17 15.8978 17 15.5V8.5C17 8.10218 16.842 7.72064 16.5607 7.43934C16.2794 7.15804 15.8978 7 15.5 7Z"
                  fill="#FF5B5B"
                />
              </svg>
              <h2 className="text-[#464255] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-semibold leading-normal">
                Show value
              </h2>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 153 153"
            fill="none"
            className="w-[83px] h-[83px] sm:w-[123px] sm:h-[123px] md:w-[133px] md:h-[133px] lg:w-[143px] lg:h-[143px] xl:w-[153px] xl:h-[153px]"
          >
            <path
              d="M76.5 1.99993C76.5 0.895361 77.3959 -0.00279835 78.5001 0.0260675C94.2142 0.436867 109.439 5.68048 122.088 15.0674C135.274 24.8521 144.961 38.6195 149.719 54.3345C154.476 70.0495 154.051 86.8782 148.506 102.333C142.962 117.788 132.592 131.049 118.929 140.155C105.267 149.262 89.0368 153.731 72.6384 152.902C56.24 152.074 40.5434 145.991 27.8688 135.553C15.1941 125.115 6.21408 110.876 2.25602 94.9411C-1.54114 79.6538 -0.523005 63.5835 5.14417 48.9211C5.54238 47.8908 6.71609 47.4095 7.73563 47.8345L60.5319 69.8434C61.5515 70.2684 62.0195 71.4378 61.731 72.504C61.054 75.0063 61.0211 77.6511 61.6512 80.1882C62.4428 83.3752 64.2389 86.223 66.7738 88.3105C69.3087 90.3981 72.448 91.6147 75.7277 91.7804C79.0074 91.9462 82.2534 91.0524 84.9859 89.231C87.7184 87.4097 89.7924 84.7575 90.9013 81.6666C92.0102 78.5756 92.0952 75.2099 91.1437 72.0668C90.1923 68.9238 88.2548 66.1704 85.6177 64.2134C83.5185 62.6556 81.0646 61.6684 78.4944 61.3305C77.3993 61.1865 76.5 60.3045 76.5 59.1999V1.99993Z"
              fill="#FF5B5B"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 153 153"
            fill="none"
            className="w-[83px] h-[83px] sm:w-[123px] sm:h-[123px] md:w-[133px] md:h-[133px] lg:w-[143px] lg:h-[143px] xl:w-[153px] xl:h-[153px]"
          >
            <path
              d="M153 76.5C153 118.75 118.75 153 76.5 153C34.2502 153 0 118.75 0 76.5C0 34.2502 34.2502 0 76.5 0C118.75 0 153 34.2502 153 76.5ZM61.2 76.5C61.2 84.95 68.05 91.8 76.5 91.8C84.95 91.8 91.8 84.95 91.8 76.5C91.8 68.05 84.95 61.2 76.5 61.2C68.05 61.2 61.2 68.05 61.2 76.5Z"
              fill="#00B074"
              fill-opacity="0.15"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 130 153"
            fill="none"
            className="w-[83px] h-[83px] sm:w-[123px] sm:h-[123px] md:w-[133px] md:h-[133px] lg:w-[143px] lg:h-[143px] xl:w-[153px] xl:h-[153px]"
          >
            <path
              d="M53.4999 1.99993C53.4999 0.895357 54.3956 -0.00280456 55.4998 0.0260678C67.3907 0.336989 79.0552 3.41707 89.5618 9.03295C100.657 14.9634 110.118 23.5385 117.107 33.9988C124.097 44.4591 128.398 56.4817 129.632 69.0016C130.865 81.5215 128.991 94.1523 124.177 105.775C119.362 117.398 111.756 127.654 102.031 135.635C92.3062 143.616 80.7631 149.076 68.4243 151.53C56.0856 153.984 43.3319 153.358 31.2932 149.706C19.8929 146.248 9.46684 140.178 0.838894 131.989C0.0376958 131.229 0.0394319 129.96 0.82048 129.179L41.267 88.7329C42.048 87.9518 43.3075 87.964 44.1837 88.6366C45.6404 89.7547 47.2909 90.6049 49.0586 91.1411C51.4663 91.8715 54.0171 91.9968 56.4848 91.5059C58.9526 91.0151 61.2612 89.9232 63.2061 88.327C65.1511 86.7308 66.6724 84.6796 67.6353 82.355C68.5981 80.0304 68.9729 77.5042 68.7262 75.0003C68.4796 72.4963 67.6193 70.0918 66.2214 67.9997C64.8235 65.9076 62.9313 64.1926 60.7123 63.0065C59.0832 62.1358 57.3149 61.5698 55.4943 61.3305C54.3991 61.1865 53.4999 60.3045 53.4999 59.1999V1.99993Z"
              fill="#2D9CDB"
            />
          </svg>
        </div>
        <div className="flex justify-between items-center text-[#464255] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-semibold leading-normal">
          <h2>Total Order</h2>
          <h2>Customer Growth</h2>
          <h2>Total Revenue</h2>
        </div>
      </div>

      <div className="col-span-2 flex flex-col bg-[#fff] p-[10px]">
        <div className="flex justify-between items-center">
          <h2 className="text-[#464255] text-[15px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-bold leading-normal">
            Chart Order
          </h2>
          <div className="">
            <button className="text-[#2D9CDB] border-[#2D9CDB] p-1 md:p-2 border-2 rounded-[14px] text-[12px]  md:text-[14px] lg:text-[18px] font-bold leading-[24px]">
              Save Report
            </button>
          </div>
        </div>
        <h2 className="text-[#B9BBBD] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] font-normal leading-normal">
          Lorem ipsum dolor sit amet, consectetur adip
        </h2>

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 626 136"
            fill="none"
            className="w-[240px] h-[95px] sm:w-[324px] sm:h-[105px] xl:w-[424px] xl:h-[115px]"
          >
            <path
              d="M59.935 44.8406L6.05931 101.011C2.66609 104.549 0.771484 109.261 0.771484 114.163V135.985H625.273V25.3308C625.273 18.5063 621.613 12.2061 615.684 8.82558L604.546 2.47403C596.096 -2.34383 585.391 0.0652523 579.79 8.045L540.705 63.726C534.75 72.2106 523.123 74.3145 514.6 68.4499L507.384 63.4848C498.793 57.5738 487.067 59.7633 481.159 68.3812L464.275 93.008C456.902 103.763 441.184 104.001 433.493 93.4725L402.299 50.7729C395.035 40.8283 380.418 40.3773 372.56 49.8551L350.406 76.5777C345.043 83.0459 336.087 85.1929 328.399 81.8527L302.289 70.5077C295.94 67.749 288.552 69.2979 283.828 74.3779C277.272 81.4283 266.12 81.3243 259.695 74.1529L203.036 10.9119C195.142 2.1007 181.238 2.63544 174.036 12.0273L135.502 62.2795C128.644 71.2236 115.587 72.2122 107.474 64.4016L86.6002 44.3064C79.0825 37.069 67.1601 37.3078 59.935 44.8406Z"
              fill="url(#paint0_linear_684_517)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_684_517"
                x1="313"
                y1="-99.0146"
                x2="313.022"
                y2="135.985"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#6EC8EF" />
                <stop offset="1" stop-color="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="col-span-2 flex-col bg-[#fff] p-[12px]">
        <div className="flex justify-between items-center">
          <h2 className="text-[#464255] text-[15px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-bold leading-normal">
            Total Revenue
          </h2>
          <div className="flex gap-[10px]">
            <div className="flex items-center gap-[5px] text-[#B9BBBD] text-[16px] font-normal leading-normal">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="8" cy="8" r="8" fill="#2D9CDB" />
              </svg>
              <h2 className="text-[#464255] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-semibold leading-normal">
                2020
              </h2>
            </div>
            <div className="flex items-center gap-[5px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="8" cy="8" r="8" fill="#FF5B5B" />
              </svg>
              <h2 className="text-[#464255] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-semibold leading-normal">
                021
              </h2>
            </div>
          </div>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="420"
            height="161"
            viewBox="0 0 720 181"
            fill="none"
            className="w-[240px] h-[131px] sm::w-[310px] sm::h-[141px] lg:w-[330px] lg:h-[151px] xl:w-[420px] xl:h-[161px]"
          >
            <path
              d="M1.5 180C5 158.333 34.1 118.5 122.5 132.5C233 150 248 -3.00011 328 1.99989C408 6.99989 407.5 168 533.5 118C634.3 77.9997 699.167 85.6663 719 94.4997"
              stroke="#2D9CDB"
              stroke-width="3"
            />
          </svg>
        </div>
      </div>

      <div className="col-span-2 flex flex-col bg-[#fff] p-[12px]">
        <div className="flex justify-between items-center">
          <h2 className="text-[#464255] text-[15px] sm:text-[18px] md:text-[20px] lg:text-[24px]  font-bold leading-normal">
            Customer Map
          </h2>
          <div className="">
            <button className="border-[#B9BBBD] p-2 border-2 rounded-[14px] text-[18px] font-bold leading-[24px]">
              Weekly
            </button>
          </div>
        </div>
        <div>
          <img src={CustomerChart} alt="" />
        </div>
      </div>
    </>
  );
}

export default ChartCards;
