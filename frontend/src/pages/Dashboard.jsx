import { useEffect, useState } from "react";
import { getDashboardData } from "../services/farmerService";
import { getAvailableCrops } from "../services/advisoryService";
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [data, setData] = useState(null);
  const [cropList, setCropList] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCrops() {
      const crops = await getAvailableCrops();
      setCropList(crops || []);
    }
    loadCrops();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getDashboardData(selectedCrop);
        setData(res);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCrop]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data?.summary) {
    return (
      <div className="bg-white p-10 rounded-2xl shadow text-center">
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
    <div className="space-y-10 p-6 md:p-10">
      <h2 className="text-3xl font-bold text-gray-800">
        Farm Analytics
      </h2>

      <select
        value={selectedCrop}
        onChange={(e) => setSelectedCrop(e.target.value)}
        className="border p-3 rounded-xl w-64"
      >
        <option value="">All Crops</option>
        {cropList.map((crop, i) => (
          <option key={i} value={crop}>{crop}</option>
        ))}
      </select>

      <div className="grid md:grid-cols-3 gap-6">
        <MetricCard title="Total Advisories" value={data.summary.totalAdvisories} />
        <MetricCard title="Active Alerts" value={data.summary.activeAlerts} />
        <MetricCard title="Avg Confidence" value={`${data.summary.averageConfidence}%`} />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#16a34a" radius={[10,10,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      <p>{title}</p>
      <p className="text-4xl font-bold text-green-600 mt-3">
        {value || 0}
      </p>
    </div>
  );
}

export default Dashboard;