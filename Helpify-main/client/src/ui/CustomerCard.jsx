const CustomerCard = () => {
  return (
    <div className="w-full max-w-4xl bg-[#0049A8] rounded-[17px] flex items-center justify-between p-4">
      {/* Profile Info */}
      <div className="flex items-center gap-4">
        <img
          src="/AfeefW_SP.png"
          alt="Profile"
          className="w-[62px] h-[61px] rounded-full bg-lightgray bg-cover bg-no-repeat"
        />
        <div className="text-[#FFF] text-[16px] font-inter font-medium">
          <p>Afeef Wadood</p>
          <p>Location: New colony, Lahore</p>
          <p>Designation: Electrician, RatePerHour Rs 500</p>
          <p>Phone No: 03903943902</p>
        </div>
      </div>

      {/* Status Button */}
      <div className="flex items-center gap-4">
        <button className="w-[144px] h-[48px] border-2 border-[#98CF74] rounded-[6px] text-[#FFF] font-lato text-[17px] font-bold tracking-[-0.51px]">
          Active
        </button>

        {/* Arrow Icon */}
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
      </div>
    </div>
  );
};

export default CustomerCard;
