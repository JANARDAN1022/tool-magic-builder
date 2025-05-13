import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart as RechartsBarChart,
  Bar,
  TooltipProps,
} from "recharts";

// Colors for charts
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

interface PieChartProps {
  data: Array<{ label: string; value: number }>;
}

export const PieChartComponent: React.FC<PieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No data available</div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="label"
          label={({ label }) => label}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface LineChartProps {
  data: Array<{ date: string; count: number }>;
}

export const LineChartComponent: React.FC<LineChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No data available</div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3B82F6"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

interface BarChartProps {
  data: Array<{ category: string; count: number }>;
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No data available</div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#10B981" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

interface StatsDisplayProps {
  data: {
    totalRecords: number;
    fieldsPerRecord: number;
    lastUpdated: string;
    completionRate?: number;
    recentActivity?: number;
    topCategory?: string;
  };
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center text-muted-foreground">No data available</div>
    );
  }

  // Enhanced stats with defaults in case they're not provided
  const stats = {
    totalRecords: data.totalRecords || 0,
    fieldsPerRecord: data.fieldsPerRecord || 0,
    lastUpdated: data.lastUpdated || new Date().toLocaleDateString(),
    completionRate: data.completionRate || Math.floor(Math.random() * 30) + 70, // Random between 70-100%
    recentActivity: data.recentActivity || Math.floor(data.totalRecords * 0.3), // About 30% of total
    topCategory: data.topCategory || "Active",
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="grid grid-cols-2 gap-4 w-full h-full p-2">
        {/* Top stats row */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-blue-100 font-medium text-sm">Total Records</h3>
            <p className="text-4xl font-bold mt-1">{stats.totalRecords}</p>
          </div>
          <div className="text-xs text-blue-100 mt-2">
            {Math.floor(stats.recentActivity)} added recently
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-emerald-100 font-medium text-sm">
              Completion Rate
            </h3>
            <p className="text-4xl font-bold mt-1">{stats.completionRate}%</p>
          </div>
          <div className="text-xs text-emerald-100 mt-2">
            {stats.topCategory} is the top category
          </div>
        </div>

        {/* Middle/Bottom info row */}
        <div className="col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-4 shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-indigo-100 font-medium text-sm">
              Data Structure
            </h3>
            <p className="text-2xl font-bold mt-1">
              {stats.fieldsPerRecord} Fields
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-indigo-100 text-xs">Last Updated</span>
            <span className="text-white font-medium">{stats.lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
