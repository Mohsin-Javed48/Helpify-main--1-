const serviceProviders = [
  {
    image: '/AfeefW_SP.png',
    name: 'Afeef Wadood',
    age: 24,
    joined: 'November 25, 2022',
    designation: 'Plumber',
    status: 'Active',
    email: 'owencass@gmail.com',
  },
  {
    image: '/AliK_SP.png',
    name: 'Ali Kamran',
    age: 25,
    joined: 'November 25, 2022',
    designation: 'Electrician',
    status: 'Active',
    email: 'nunezcass@gmail.com',
  },
  {
    image: '/AmmarS_SP.png',
    name: 'Ammar Sufyan',
    age: 24,
    joined: 'November 26, 2022',
    designation: 'Painter',
    status: 'Unactive',
    email: 'firminocass@gmail.com',
  },
  {
    image: 'UsmanT_SP.png',
    name: 'Usman Tariq',
    age: 28,
    joined: 'November 26, 2022',
    designation: 'Gardner',
    status: 'Active',
    email: 'hendersoncass@gmail.com',
  },
];

function ServiceProvidersPage() {
  return (
    <>
      {/*ServiceProviderPage*/}
      <div className="px-4 sm:px-6  py-4 w-full min-h-[100vh] bg-[#161928]">
        {/* Page Title */}
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-poppins font-semibold text-[#ADB3CC] tracking-[-0.64px] mt-2">
          Service Providers
        </h2>
        {/* Table */}
        <div className="overflow-x-auto mt-7 mb-7">
          <table className="min-w-full rounded-lg text-left border-collapse">
            <thead className="bg-[#1D2134] hidden md:table-header-group">
              <tr className="text-[#ADB3CC] text-xs sm:text-sm md:text-base font-medium font-inter tracking-[0.48]">
                <th className="py-3 px-4 sm:py-4 sm:px-6">{/* Images */}</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">NAME</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">AGE</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">JOINED</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">Designation</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">STATUS</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">EMAIL</th>
              </tr>
            </thead>

            <tbody>
              {serviceProviders.map((provider, index) => (
                <tr
                  key={index}
                  className="text-[#ADB3CC] text-xs sm:text-sm md:text-base font-medium font-inter tracking-[0.18] border-b border-[#2E3348] md:table-row block w-full mb-4 md:mb-0"
                >
                  {/* Image */}
                  <td className="py-3 px-4 items-center md:table-cell block">
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="w-[28px] sm:w-[34px] md:w-[36px] h-[28px] sm:h-[30px] md:h-[31px] rounded-full bg-lightgray bg-cover bg-no-repeat"
                    />
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Name:{' '}
                    </span>
                    {provider.name}
                  </td>

                  {/* Age */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Age:{' '}
                    </span>
                    {provider.age}
                  </td>

                  {/* Joined */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Joined:{' '}
                    </span>
                    {provider.joined}
                  </td>

                  {/* Designation */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Designation:{' '}
                    </span>
                    {provider.designation}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Status:{' '}
                    </span>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-[4px] ${
                        provider.status === 'Active'
                          ? 'bg-[rgba(0,222,115,0.10)] text-[#00DE73]'
                          : 'bg-[rgba(255,56,56,0.10)] text-[#FF3838]'
                      }`}
                    >
                      {provider.status}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Email:{' '}
                    </span>
                    {provider.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* See More */}
          <div className="mt-4 text-left">
            <p className="text-[rgba(173,179,204,0.73)] text-[18px] sm:text-[22px] md:text-[25px] font-inter font-medium tracking-[-0.5px] cursor-pointer">
              ...see more
            </p>
          </div>
        </div>

        {/* Service Providers */}
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-poppins font-semibold text-[#ADB3CC] tracking-[-0.64px] mt-2 mb-3">
          New Service Providers
        </h2>
        {/*Showing*/}
        {/*Service Provider Card 1*/}
        <div className="flex flex-col gap-5 p-4">
          <div className="w-full max-w-4xl bg-[#0049A8] rounded-[17px] flex flex-wrap items-center justify-between p-4">
            {/* Profile Info */}
            <div className="flex items-center gap-4 flex-1">
              <img
                src="/AfeefW_SP.png"
                alt="Profile"
                className="w-[62px] h-[61px] rounded-full bg-lightgray bg-cover bg-no-repeat"
              />
              <div className="text-[#FFF] text-[14px] md:text-[16px] font-inter font-medium">
                <p>Afeef Wadood</p>
                <p>Location: New colony, Lahore</p>
                <p>Designation: Electrician, RatePerHour Rs 500</p>
                <p>Phone No: 03903943902</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex">
              <div className="flex flex-row md:flex-col items-center gap-2 md:gap-4">
                {/* Reject Button (Top) */}
                <button className="w-[110px] md:w-[172px] h-[40px] md:h-[50px] bg-[#F20303] text-[#FFF] text-[14px] md:text-[19px] font-inter font-medium rounded-[37px]">
                  Reject
                </button>

                {/* Accept Button (Below) */}
                <button className="w-[110px] md:w-[172px] h-[40px] md:h-[50px] bg-[#00DE73] text-[#FFF] text-[14px] md:text-[19px] font-inter font-medium rounded-[37px]">
                  Accept
                </button>
              </div>
              {/* Icon & More Text Stacked */}
              <div className="flex flex-col items-center md:gap-4 m-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="36"
                  viewBox="0 0 18 36"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.2355 19.0665L6.75003 27.552L4.62903 25.431L12.054 18.006L4.62903 10.581L6.75003 8.45996L15.2355 16.9455C15.5167 17.2268 15.6747 17.6082 15.6747 18.006C15.6747 18.4037 15.5167 18.7852 15.2355 19.0665Z"
                    fill="white"
                  />
                </svg>
                <span className="text-[#FFF] text-[10px] font-inter font-medium">
                  more
                </span>
              </div>
            </div>
          </div>
        </div>
        {/*Service Provider Card 2*/}
        <div className="flex flex-col gap-5 p-4">
          <div className="w-full max-w-4xl bg-[#0049A8] rounded-[17px] flex flex-wrap items-center justify-between p-4">
            {/* Profile Info */}
            <div className="flex items-center gap-4">
              <img
                src="/AfeefW_SP.png"
                alt="Profile"
                className="w-[62px] h-[61px] rounded-full bg-lightgray bg-cover bg-no-repeat"
              />
              <div className="text-[#FFF] text-[14px] md:text-[16px] font-inter font-medium">
                <p>Afeef Wadood</p>
                <p>Location: New colony, Lahore</p>
                <p>Designation: Electrician, RatePerHour Rs 500</p>
                <p>Phone No: 03903943902</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex">
              <div className="flex flex-row md:flex-col items-center gap-2 md:gap-4">
                {/* Reject Button (Top) */}
                <button className="w-[110px] md:w-[172px] h-[40px] md:h-[50px] bg-[#F20303] text-[#FFF] text-[14px] md:text-[19px] font-inter font-medium rounded-[37px]">
                  Reject
                </button>

                {/* Accept Button (Below) */}
                <button className="w-[110px] md:w-[172px] h-[40px] md:h-[50px] bg-[#00DE73] text-[#FFF] text-[14px] md:text-[19px] font-inter font-medium rounded-[37px]">
                  Accept
                </button>
              </div>
              {/* Icon & More Text Stacked */}
              <div className="flex flex-col items-center md:gap-4 m-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="36"
                  viewBox="0 0 18 36"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.2355 19.0665L6.75003 27.552L4.62903 25.431L12.054 18.006L4.62903 10.581L6.75003 8.45996L15.2355 16.9455C15.5167 17.2268 15.6747 17.6082 15.6747 18.006C15.6747 18.4037 15.5167 18.7852 15.2355 19.0665Z"
                    fill="white"
                  />
                </svg>
                <span className="text-[#FFF] text-[10px] font-inter font-medium">
                  more
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceProvidersPage;
