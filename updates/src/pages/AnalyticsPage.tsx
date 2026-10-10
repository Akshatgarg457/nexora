import React, { useState } from 'react';
import {
  AreaChart,
  Area,
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
} from 'recharts';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Sparkles,
  Info,
  DollarSign,
  Users,
  Percent,
  Clock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  initialAnalyticsSummary,
  analyticsTrends30d,
  analyticsTrends7d,
  analyticsTrends90d,
  usageByCategory,
  userDropoffPoints,
  simulatedInsights,
} from '../mocks/analytics';

export const AnalyticsPage: React.FC = () => {
  const { activeAdaptiveConfig } = useWorkspace();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [metricView, setMetricView] = useState<'activeUsers' | 'revenue' | 'conversionRate'>('activeUsers');

  const trendsData =
    dateRange === '7d'
      ? analyticsTrends7d
      : dateRange === '90d'
      ? analyticsTrends90d
      : analyticsTrends30d;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              Data Analytics Workspace
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              Demonstration Dataset
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Telemetry, Funnels & Trend Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Diagnose cohort conversion rates, active user trends, and automated AI anomaly insights.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                dateRange === r
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r === '7d' && '7 Days'}
              {r === '30d' && '30 Days'}
              {r === '90d' && '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Users */}
        <div
          onClick={() => setMetricView('activeUsers')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            metricView === 'activeUsers'
              ? 'bg-purple-50/60 border-purple-500 ring-2 ring-purple-100'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Users</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {initialAnalyticsSummary.activeUsers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-rose-600">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{initialAnalyticsSummary.activeUsersChange}%</span>
            <span className="text-[10px] text-slate-400 font-normal">vs prior period</span>
          </div>
        </div>

        {/* Revenue */}
        <div
          onClick={() => setMetricView('revenue')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            metricView === 'revenue'
              ? 'bg-purple-50/60 border-purple-500 ring-2 ring-purple-100'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>MRR Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${initialAnalyticsSummary.revenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{initialAnalyticsSummary.revenueChange}%</span>
            <span className="text-[10px] text-slate-400 font-normal">growing</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div
          onClick={() => setMetricView('conversionRate')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            metricView === 'conversionRate'
              ? 'bg-purple-50/60 border-purple-500 ring-2 ring-purple-100'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Conversion Rate</span>
            <Percent className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {initialAnalyticsSummary.conversionRate}%
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{initialAnalyticsSummary.conversionRateChange}%</span>
            <span className="text-[10px] text-slate-400 font-normal">stable</span>
          </div>
        </div>

        {/* Product Usage Hours */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Usage Hours</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {(initialAnalyticsSummary.productUsageHours / 1000).toFixed(1)}k hrs
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-rose-600">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{initialAnalyticsSummary.usageChange}%</span>
            <span className="text-[10px] text-slate-400 font-normal">mobile drag</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid: Primary Trend Area Chart (8 cols) + Funnel Dropoff / Breakdown (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 capitalize">
                {metricView === 'activeUsers' && 'Daily Active Users Trendline'}
                {metricView === 'revenue' && 'Revenue Progression ($)'}
                {metricView === 'conversionRate' && 'Checkout Conversion Rate (%)'}
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing multi-point telemetry across selected {dateRange} window.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setMetricView('activeUsers')}
                className={`px-2.5 py-1 rounded-lg font-medium ${
                  metricView === 'activeUsers' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setMetricView('revenue')}
                className={`px-2.5 py-1 rounded-lg font-medium ${
                  metricView === 'revenue' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setMetricView('conversionRate')}
                className={`px-2.5 py-1 rounded-lg font-medium ${
                  metricView === 'conversionRate' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Conversion
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={
                        metricView === 'activeUsers'
                          ? '#4338CA'
                          : metricView === 'revenue'
                          ? '#0F766E'
                          : '#B45309'
                      }
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={
                        metricView === 'activeUsers'
                          ? '#4338CA'
                          : metricView === 'revenue'
                          ? '#0F766E'
                          : '#B45309'
                      }
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={metricView}
                  stroke={
                    metricView === 'activeUsers'
                      ? '#4338CA'
                      : metricView === 'revenue'
                      ? '#0F766E'
                      : '#B45309'
                  }
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMetric)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Onboarding Funnel Dropoff Chart (Crucial for Scenario 5: Investigating declining product usage!) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Funnel Dropoff Bottleneck
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            Step 3 (Workspace Customization) experiences high dropoff rate (28%), explaining user retention dip.
          </p>

          <div className="space-y-3 text-xs">
            {userDropoffPoints.map((dp, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className={`font-semibold ${i === 2 ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                    {dp.step} {i === 2 ? '⚠️' : ''}
                  </span>
                  <span className="text-slate-400">{dp.completionRate}% completion</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      i === 2 ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${dp.completionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Automated Insights Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Automated Telemetry Insights & Prescriptive Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {simulatedInsights.map((ins) => (
            <div
              key={ins.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                ins.severity === 'warning'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : ins.severity === 'success'
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-indigo-50/60 border-indigo-200 text-indigo-950'
              }`}
            >
              <div>
                <span className="font-bold text-xs block mb-1">{ins.title}</span>
                <p className="text-[11px] leading-relaxed mb-3 opacity-90">
                  {ins.description}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 text-[11px]">
                <strong className="block text-[10px] uppercase tracking-wider opacity-75">
                  Recommendation:
                </strong>
                <span>{ins.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
