import Header from './Header';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';

function ServiveProviderDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-[#F3F2F7]">
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <div className="p-5 space-y-5">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiveProviderDashboardLayout;
