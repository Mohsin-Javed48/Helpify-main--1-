import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faUserTie,
  faClipboardList,
  faDollarSign,
} from '@fortawesome/free-solid-svg-icons';

function Analytics() {
  // Mock data - in real app this would come from an API
  const stats = {
    totalRevenue: 125000,
    revenueGrowth: 12.5,
    totalOrders: 1560,
    orderGrowth: 8.3,
    totalCustomers: 890,
    customerGrowth: 5.2,
    totalProviders: 450,
    providerGrowth: 7.8,
  };

  // Mock chart data - in real app this would use a charting library
  const monthlyRevenue = [
    { month: 'Jan', revenue: 10000 },
    { month: 'Feb', revenue: 12000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Apr', revenue: 13000 },
    { month: 'May', revenue: 16000 },
    { month: 'Jun', revenue: 18000 },
  ];

  const serviceDistribution = [
    { service: 'Plumbing', percentage: 30 },
    { service: 'Electrical', percentage: 25 },
    { service: 'Cleaning', percentage: 20 },
    { service: 'Gardening', percentage: 15 },
    { service: 'Others', percentage: 10 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-green-500 text-sm">
                +{stats.revenueGrowth}% from last month
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FontAwesomeIcon
                icon={faDollarSign}
                className="text-blue-600 text-xl"
              />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
              <p className="text-green-500 text-sm">
                +{stats.orderGrowth}% from last month
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-purple-600 text-xl"
              />
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
              <p className="text-green-500 text-sm">
                +{stats.customerGrowth}% from last month
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-green-600 text-xl"
              />
            </div>
          </div>
        </div>

        {/* Providers Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Service Providers</p>
              <h3 className="text-2xl font-bold">{stats.totalProviders}</h3>
              <p className="text-green-500 text-sm">
                +{stats.providerGrowth}% from last month
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FontAwesomeIcon
                icon={faUserTie}
                className="text-yellow-600 text-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <div className="h-64 flex items-end space-x-2">
            {monthlyRevenue.map((item, index) => (
              <div key={index} className="flex-1">
                <div
                  className="bg-blue-500 rounded-t"
                  style={{ height: `${(item.revenue / 18000) * 100}%` }}
                />
                <p className="text-center text-sm text-gray-500 mt-2">
                  {item.month}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Service Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-64 h-64 relative">
              {serviceDistribution.map((item, index) => (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.cos(((index * 72 - 90) * Math.PI) / 180) * 50}% ${50 + Math.sin(((index * 72 - 90) * Math.PI) / 180) * 50}%)`,
                    backgroundColor: `hsl(${index * 72}, 70%, 50%)`,
                    transform: `rotate(${index * 72}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {serviceDistribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: `hsl(${index * 72}, 70%, 50%)` }}
                />
                <span className="text-sm text-gray-600">
                  {item.service} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
