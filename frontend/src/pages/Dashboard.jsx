import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Calendar,
  Users,
  Table,
  XCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import Loading from "../components/UI/Loading.jsx";
import { getStats } from "../utils/api.js";
import StatCard from "../components/Dashboard/StatCard.jsx";
import { aggregateWeeklyData, formatDateWeek } from "../utils/helpers.js";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading reservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-20">
        <Loading text={"Loading..."} />
      </div>
    );
  }

  const chartData = stats.weeklyTrend.map((item) => ({
    ...item,
    formattedDate: formatDateWeek(item.date),
  }));

  // Aggregate daily data into weekly data
  const weeklyData = aggregateWeeklyData(stats.weeklyTrend);

  return (
    <div className="py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-semibold text-dark mb-4">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <StatCard
          icon={Calendar}
          title="Total Reservations"
          value={stats.totalReservations}
          color="blue"
        />
        <StatCard
          icon={Clock}
          title="Reservations Today"
          value={stats.todayReservations}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          title="This Month"
          value={stats.monthlyReservations}
          color="purple"
        />
        <StatCard
          icon={XCircle}
          title="Cancellations"
          value={stats.cancelledReservations}
          color="red"
        />
        <StatCard
          icon={Table}
          title="Total Tables"
          value={stats.totalTables}
          color="orange"
        />
        <StatCard
          icon={Users}
          title="Users"
          value={stats.totalUsers}
          color="indigo"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
            Weekly Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#5ea500"
                strokeWidth={3}
                dot={{ fill: "#5ea500", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: "#5ea500" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
            Reservation per day
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="count" fill="#5ea500" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="mt-8 card">
        <h3 className="text-lg font-semibold text-dark">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1 */}
          <div className="text-end py-4 px-6 border border-gray-200 rounded-lg hover:bg-primary/5 hover:border-primary">
            <p className="text-2xl font-bold text-primary">
              {((stats.todayReservations / stats.totalTables) * 100).toFixed(1)}
              %
            </p>
            <p className="text-sm text-gray-600 mt-1">Occupancy today</p>
          </div>

          {/* 2 */}
          <div className="text-end py-4 px-6 border border-gray-200 rounded-lg hover:bg-primary/5 hover:border-primary">
            <p className="text-2xl font-bold text-primary">
              {(
                (stats.monthlyReservations / stats.totalReservations) *
                100
              ).toFixed(1)}
              %
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Reservations of the Month
            </p>
          </div>

          {/* 3 */}
          <div className="text-end py-4 px-6 border border-gray-200 rounded-lg hover:bg-primary/5 hover:border-primary">
            <p className="text-2xl font-bold text-primary">
              {(
                (stats.cancelledReservations / stats.totalReservations) *
                100
              ).toFixed(1)}
              %
            </p>
            <p className="text-sm text-gray-600 mt-1">Cancellation Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
