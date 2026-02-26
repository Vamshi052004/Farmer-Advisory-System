import { useEffect, useState } from "react";
import { getDashboardData } from "../services/farmerService";
import { getAvailableCrops } from "../services/advisoryService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [data, setData] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [cropList, setCropList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCrops() {
      try {
        const crops = await getAvailableCrops();
        setCropList(crops || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCrops();
  }, []);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await getDashboardData(selectedCrop);
        setData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [selectedCrop]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || !data.summary) {
    return (
      <div className="bg-white p-10 rounded-2xl shadow-md text-center">
        No dashboard data available.
      </div>
    );
  }

  const chartData = [
    { name: "Advisories", value: data.summary.totalAdvisories || 0 },
    { name: "Alerts", value: data.summary.activeAlerts || 0 },
    { name: "Confidence", value: data.summary.averageConfidence || 0 }
  ];

  return (
    <div className="space-y-10">

      <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Farm Analytics
          </h2>
          <p className="text-gray-500 mt-2">
            Monitor advisory performance insights.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full border p-3 rounded-xl"
          >
            <option value="">All Crops</option>
            {cropList.map((crop, i) => (
              <option key={i} value={crop}>{crop}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white p-8 rounded-2xl shadow-md">
          <p>Total Advisories</p>
          <p className="text-4xl font-bold text-green-600 mt-3">
            {data.summary.totalAdvisories}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md">
          <p>Active Alerts</p>
          <p className="text-4xl font-bold text-blue-600 mt-3">
            {data.summary.activeAlerts}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md">
          <p>Average Confidence</p>
          <p className="text-4xl font-bold text-purple-600 mt-3">
            {data.summary.averageConfidence}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-8 rounded-2xl shadow-md">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#16a34a" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default Dashboard;