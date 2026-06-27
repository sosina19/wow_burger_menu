import React from "react";
import {
  TrendingUp,
  Flame,
  Users,
  Percent,
  Eye,
  Menu as MenuIcon,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from "recharts";
import { AnalyticsData } from "../types";

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  onRefresh: () => void;
  loading: boolean;
}

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data, onRefresh, loading }) => {
  const { summary, charts, lists } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Analytics & Business Intelligence</h2>
          <p className="text-sm text-gray-500 font-sans mt-1">Real-time menu performance, employee audit logs, and customer views.</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-md disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Syncing..." : "Refresh Report"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Menu Items */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Menu Items</span>
            <p className="text-3xl font-bold text-gray-900 tracking-tight mt-1">{summary.totalMenuItems}</p>
          </div>
          <div className="p-3 rounded-2xl bg-red-50 text-red-600">
            <MenuIcon className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Categories */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Categories</span>
            <p className="text-3xl font-bold text-gray-900 tracking-tight mt-1">{summary.categoriesCount}</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Employees */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Employees</span>
            <p className="text-3xl font-bold text-gray-900 tracking-tight mt-1">{summary.totalEmployees}</p>
          </div>
          <div className="p-3 rounded-2xl bg-green-50 text-green-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Active Offers */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Active Offers</span>
            <p className="text-3xl font-bold text-gray-900 tracking-tight mt-1">{summary.activeOffersCount}</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        {/* Card 5: Total Views */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Total Views</span>
            <p className="text-3xl font-bold text-gray-900 tracking-tight mt-1">{summary.totalViews}</p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
            <Eye className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily views */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-gray-800">Weekly Customer View Traffic</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.dailyViews} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", borderRadius: "12px", border: "none", color: "#fff" }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Bar dataKey="views" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly traffic */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <Eye className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">Monthly View Metrics</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyViews} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", borderRadius: "12px", border: "none", color: "#fff" }}
                />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Category Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <FolderOpen className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-gray-800">Category Share Distribution</h3>
          </div>
          <div className="h-72 w-full flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="h-56 w-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {charts.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2.5">
              {charts.categoryDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs text-gray-500 font-mono font-medium">{entry.name} ({entry.value} items)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: Popularity comparison */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <Flame className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">Top Viewed Items (Most Popular)</h3>
          </div>
          <div className="h-72 w-full">
            {charts.mostPopularItems.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">No view data recorded yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.mostPopularItems} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} width={120} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", borderRadius: "12px", border: "none", color: "#fff" }}
                  />
                  <Bar dataKey="views" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Lists: Popularity and Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List 1: Most & Least Viewed */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <h3 className="text-lg font-bold text-gray-800">Menu Performance Ranks</h3>
            <span className="text-xs font-mono text-gray-400">Sorted by dynamic view counters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top viewed */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-red-600 mb-3 flex items-center gap-1.5 font-bold">
                <Flame className="w-4 h-4 fill-red-100" /> Highest Demand (Top Viewed)
              </h4>
              <div className="space-y-2.5">
                {lists.mostViewed.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400 font-bold w-4">#{index + 1}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">{item.name}</p>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">{item.category}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {item.viewCount} views
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Least viewed */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5 font-bold">
                <Eye className="w-4 h-4" /> Quietest Items (Least Viewed)
              </h4>
              <div className="space-y-2.5">
                {lists.leastViewed.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/60 hover:bg-gray-100/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400 w-4">#{index + 1}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 leading-tight">{item.name}</p>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">{item.category}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                      {item.viewCount} views
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs (Super Admin security activity) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 flex flex-col">
          <div className="border-b border-gray-50 pb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">Recent Security Activity</h3>
            <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-3.5 max-h-96 pr-1">
            {lists.recentActivity.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400 py-10">No security events logged</div>
            ) : (
              lists.recentActivity.map((log) => (
                <div key={log.id} className="text-xs border-b border-gray-50 pb-3.5 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-gray-800 font-mono bg-gray-100 px-1.5 py-0.5 rounded-sm">{log.username}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1 font-sans">{log.action}</p>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[10px] font-mono text-gray-400">IP: {log.ip}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm font-mono ${
                      log.status === "Success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsDashboard;
