function InformationForm() {
  return (
    <>
      <div className="mt-[35px]">
        <h2 className="text-[#000] font-wixmadefor text-[18px] sm:text-[20px] md:text-[22px] lg:text-[25px] font-semibold leading-normal">
          Information
        </h2>
        <div className="flex flex-col space-y-4">
          {/* City Selection */}
          <div className="flex flex-col space-y-2">
            <label className="text-[#000] font-wixmadefor text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-semibold leading-normal">
              Please Select City:
            </label>
            <select className="w-[375px] sm:w-[440px] md:w-[460px] lg:w-[480px] p-2 border rounded">
              <option value="">Select City</option>
              <option value="lahore">Lahore</option>
              <option value="karachi">Karachi</option>
            </select>
          </div>

          {/* Area Selection */}
          <div className="flex flex-col space-y-2">
            <label className="text-[#000] font-wixmadefor text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-semibold leading-normal">
              Please Select Area:
            </label>
            <select className="w-[375px] sm:w-[440px] md:w-[460px] lg:w-[480px] p-2 border rounded">
              <option value="">Select Area</option>
              <option value="area1">Area 1</option>
              <option value="area2">Area 2</option>
            </select>
          </div>

          {/* Address Input */}
          <div className="flex flex-col space-y-2">
            <label className="text-[#000] font-wixmadefor text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-semibold leading-normal">
              Please Type Your Address:
            </label>
            <input
              type="text"
              placeholder="House Number XXX C"
              className="w-[375px] sm:w-[440px] md:w-[460px] lg:w-[480px] p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div
        style={{ fontFamily: "Segoe UI" }}
        className="grid justify-items-end   mt-[50px]"
      >
        <button className="mb-[60px] bg-[#2FA700] py-[18px] px-[28px] sm:py-[20px] sm:px-[30px] md:py-[23px] md:px-[32px] lg:py-[25px] lg:px-[35px] rounded-[7px] text-[#fff] text-[15px] sm:text-[17px] md:text-[19px] lg:text-[21px] font-semibold leading-normal">
          Comfirm Booking
        </button>
      </div>
    </>
  );
}

export default InformationForm;
