import CustomerCard from '../../ui/CustomerCard.jsx';

function CustomersPage() {
  return (
    <>
      {/*CustomersPage*/}
      <div className="px-4 sm:px-6  py-4 w-full min-h-[100vh] bg-[#161928]">
        {/* Page Title */}
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-poppins font-semibold text-[#ADB3CC] tracking-[-0.64px] mt-2 mb-6">
          Customers
        </h2>

        {/*Customer Cards*/}
        <div className="flex flex-col gap-5 p-4">
          <CustomerCard />

          {/* Customer Info Card */}
          <div className="w-full max-w-4xl bg-[#0049A8] rounded-[17px] p-8 text-[#FFF] flex flex-col md:flex-row md:items-start gap-6 ">
            {/* Profile Image */}
            <div className="flex-shrink-0 self-start mt-10">
              <img
                src="/MJ.png"
                alt="Profile"
                className="w-[165px] h-[165px] rounded-full object-cover"
              />
            </div>

            {/* Customer Details */}
            <div className="flex-1 text-left text-[#FFF] text-[17px] font-bold font-lato tracking-[-0.51] mt-4">
              <p>Customer Id: 353453</p>
              <p>Name: Mohsin Javed</p>
              <p>Email: mohsinjavedpc@gmail.com</p>
              <p>Phone Number: 03091948615</p>
              <p>
                Address: Punjab University Employees Housing Society Phase 2
                House Number 235 C
              </p>
              <p>Total Orders: 33</p>
              <p>Order Status: Completed</p>
              <p>Registration Date: 23 November, 2024</p>

              {/* Order History Section */}
              <div className="mt-6">
                <h2 className="text-[17px] font-extrabold text-[#FFF] mb-6">
                  Order History
                </h2>

                {/* Order Cards */}
                {[1, 2].map((order, index) => (
                  <div
                    key={index}
                    className="bg-[#5A5FD4] rounded-[17px] p-4 w-full text-sm mb-4"
                  >
                    <p>Service Type: Plumber</p>
                    <p>Service Date: 23 November, 2023</p>
                    <p>Service Provider assigned: Mohsin Javed (Id: 232423)</p>
                    <p>
                      Order Status:{' '}
                      <span className="text-[#0F5] font-bold">Completed</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Buttons: Aligned to the Right */}
              <div className="flex justify-end gap-6 mt-28 mb-6 mr-2">
                <button className="w-[160px] h-[50px] bg-[#4255D4] text-[#FFF] font-extrabold text-[17px] rounded-[26px]">
                  Edit Profile
                </button>
                <button className="w-[160px] h-[50px] bg-[#FF2525] text-[#FFF] font-extrabold text-[17px] rounded-[26px]">
                  Suspend Id
                </button>
              </div>
            </div>
          </div>
          {/*Customer Cards*/}

          <CustomerCard />
        </div>
      </div>
    </>
  );
}

export default CustomersPage;
