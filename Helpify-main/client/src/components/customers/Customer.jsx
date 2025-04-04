import ServiceProviderIcon from '../../../public/ServiceProviderIcon.png';

// import ServiceProviderIcon from './ServiceProviderIcon.png';

const orders = [
  {
    id: 1,
    name: 'Mohsin Javed',
    city: 'Lahore',
    address: 'Dera Jugra plot number 420 A block',
    items: 'Lawn cleaning, Garden furnishing',
    timing: ' 1:00pm - 5:00pm',
  },
  {
    id: 2,
    name: 'Mohsin Javed',
    city: 'Lahore',
    address: 'Dera Jugra plot number 420 A block',
    items: 'Lawn cleaning, Garden furnishing',
    timing: ' 1:00pm - 5:00pm',
  },
];

function Customer() {
  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]"
        style={{ fontFamily: 'Barlow, sans-serif' }}
      >
        <div className="col-start-1 col-end-2">
          <h1 className="text-[#464255] text-[22px] sm:text-[25px] md:text-[28px] lg:text-[32px] font-semibold leading-normal">
            Customer
          </h1>
          <h2 className="text-[#A3A3A3] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium leading-normal">
            Hi, Samantha. Welcome back to Helpify!
          </h2>
        </div>

        <div className="col-span-1 md:col-end-3 lg:col-end-5 flex justify-center gap-[8px] items-center p-3 bg-[#fff]">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 34 34"
              fill="none"
              className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] lg:w-[34px] lg:h-[34px]"
            >
              <path
                d="M8.5 29.7502H25.5C26.6272 29.7502 27.7082 29.3024 28.5052 28.5054C29.3022 27.7083 29.75 26.6273 29.75 25.5002V8.50016C29.75 7.37299 29.3022 6.29199 28.5052 5.49496C27.7082 4.69793 26.6272 4.25016 25.5 4.25016H24.0833C24.0833 3.87444 23.9341 3.5141 23.6684 3.24843C23.4027 2.98275 23.0424 2.8335 22.6667 2.8335C22.2909 2.8335 21.9306 2.98275 21.6649 3.24843C21.3993 3.5141 21.25 3.87444 21.25 4.25016H12.75C12.75 3.87444 12.6007 3.5141 12.3351 3.24843C12.0694 2.98275 11.7091 2.8335 11.3333 2.8335C10.9576 2.8335 10.5973 2.98275 10.3316 3.24843C10.0659 3.5141 9.91667 3.87444 9.91667 4.25016H8.5C7.37283 4.25016 6.29183 4.69793 5.4948 5.49496C4.69777 6.29199 4.25 7.37299 4.25 8.50016V25.5002C4.25 26.6273 4.69777 27.7083 5.4948 28.5054C6.29183 29.3024 7.37283 29.7502 8.5 29.7502ZM7.08333 8.50016C7.08333 8.12444 7.23259 7.76411 7.49827 7.49843C7.76394 7.23275 8.12428 7.0835 8.5 7.0835H9.91667V8.50016C9.91667 8.87589 10.0659 9.23622 10.3316 9.5019C10.5973 9.76757 10.9576 9.91683 11.3333 9.91683C11.7091 9.91683 12.0694 9.76757 12.3351 9.5019C12.6007 9.23622 12.75 8.87589 12.75 8.50016V7.0835H21.25V8.50016C21.25 8.87589 21.3993 9.23622 21.6649 9.5019C21.9306 9.76757 22.2909 9.91683 22.6667 9.91683C23.0424 9.91683 23.4027 9.76757 23.6684 9.5019C23.9341 9.23622 24.0833 8.87589 24.0833 8.50016V7.0835H25.5C25.8757 7.0835 26.2361 7.23275 26.5017 7.49843C26.7674 7.76411 26.9167 8.12444 26.9167 8.50016V12.7502H7.08333V8.50016ZM7.08333 15.5835H26.9167V25.5002C26.9167 25.8759 26.7674 26.2362 26.5017 26.5019C26.2361 26.7676 25.8757 26.9168 25.5 26.9168H8.5C8.12428 26.9168 7.76394 26.7676 7.49827 26.5019C7.23259 26.2362 7.08333 25.8759 7.08333 25.5002V15.5835Z"
                fill="#2D9CDB"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-[#464255] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium leading-normal">
              Filter Periode
            </h1>
            <h2 className="text-[#464255] text-[6px] sm:text-[8px] md:text-[10px] lg:text-[12px] font-normal leading-[18px]">
              17 April 2020 - 21 May 2020
            </h2>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] lg:w-[24px] lg:h-[24px]"
            >
              <path
                d="M11.9887 16.4717C11.7576 16.4697 11.5364 16.378 11.3717 16.216L2.6444 7.48875C2.48542 7.32415 2.39746 7.1037 2.39945 6.87487C2.40144 6.64605 2.49322 6.42716 2.65503 6.26535C2.81684 6.10353 3.03573 6.01175 3.26456 6.00976C3.49338 6.00777 3.71384 6.09574 3.87844 6.25471L11.9887 14.365L20.0989 6.25471C20.1795 6.17136 20.2758 6.10487 20.3822 6.05914C20.4887 6.0134 20.6032 5.98932 20.7191 5.98831C20.835 5.98731 20.9499 6.00939 21.0572 6.05327C21.1644 6.09715 21.2619 6.16195 21.3438 6.2439C21.4257 6.32584 21.4905 6.42328 21.5344 6.53054C21.5783 6.63779 21.6004 6.75271 21.5994 6.86859C21.5984 6.98447 21.5743 7.09899 21.5286 7.20547C21.4828 7.31194 21.4163 7.40824 21.333 7.48875L12.6057 16.216C12.441 16.378 12.2197 16.4697 11.9887 16.4717Z"
                fill="#B9BBBD"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-[#fff] p-1 sm:p-6 md:p-8 lg:p-10 space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-mds p-4 flex flex-col bg-[linear-gradient(180deg,_rgba(195,195,195,0.25)_61%,_rgba(93,93,93,0.25)_100%)]"
          >
            <div className="flex justify-between">
              <div className="flex gap-5">
                <div>
                  <img
                    src={ServiceProviderIcon}
                    alt="Service Provider"
                    className="hidden sm:block w-[34px] h-[34px] sm:w-[44px] sm:h-[44px] md:w-[54px] md:h-[54px] lg:w-[64px] lg:h-[64px]"
                  />
                </div>
                <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[12px] xl:text-[14px] font-medium">
                  <h2 className="font-semibold">{order.name}</h2>
                  <h2 className="text-gray-600">City: {order.city}</h2>
                  <h2 className="text-gray-600">Address: {order.address}</h2>
                  <h2 className="text-gray-600">Items: {order.items}</h2>
                  <h2 className="text-gray-600">Timing: {order.timing}</h2>
                </div>
              </div>

              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 73 59"
                  fill="none"
                  className="h-[35px] w-[40px] sm:h-[40px] sm:w-[50px] md:h-[50px] md:w-[60px] lg:h-[56px] lg:w-[69px]"
                >
                  <path
                    d="M21 18.0002H52M21 31.3335H44.25M59.75 1.3335C62.8331 1.3335 65.79 2.38706 67.9701 4.26243C70.1502 6.13779 71.375 8.68133 71.375 11.3335V38.0001C71.375 40.6523 70.1502 43.1958 67.9701 45.0712C65.79 46.9466 62.8331 48.0001 59.75 48.0001H40.375L21 58.0001V48.0001H13.25C10.1669 48.0001 7.20999 46.9466 5.02988 45.0712C2.84977 43.1958 1.625 40.6523 1.625 38.0001V11.3335C1.625 8.68133 2.84977 6.13779 5.02988 4.26243C7.20999 2.38706 10.1669 1.3335 13.25 1.3335H59.75Z"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button className="bg-[#FF4141] text-[white] p-2 sm:p-2 text-[8px] sm:text-[12px] md:text-[14px] lg:text-[16px] rounded-xl">
                Cancel Order
              </button>
              <button className="bg-[#0DC400] text-[white] p-2 sm:p-2 text-[8px] sm:text-[12px] md:text-[14px] lg:text-[16px] rounded-xl">
                Pending
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Customer;
