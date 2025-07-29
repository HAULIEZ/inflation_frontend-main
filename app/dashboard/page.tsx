"use client";

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Calendar, Percent, AlertCircle, BarChart2,
  Target, Zap, Award, Activity, ArrowUp, ArrowDown, Minus
} from 'lucide-react';

type InflationData = {
  year: number;
  date: string;
  inflationRate: number;
  gdp: number;
  absInflationRate: number;
  isPositive: boolean;
  decade: number;
};

const Dashboard = () => {
  const [data, setData] = useState<InflationData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const parseCSV = async () => {
      try {
        const res = await fetch('/InflationRates.csv');
        const text = await res.text();
        const lines = text.trim().split('\n');
        const parsedData: InflationData[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= 4) {
            const year = parseInt(values[0]) || 0;
            const month = values[1]?.trim() || '';
            const cpi = parseFloat(values[2]) || 0;
            const inflationRate = parseFloat(values[3]) || 0;

            if (year === 0 || isNaN(inflationRate)) continue;

            const dateStr = `${year}-${month}`;

            parsedData.push({
              year,
              date: dateStr,
              inflationRate,
              gdp: cpi,
              absInflationRate: Math.abs(inflationRate),
              isPositive: inflationRate > 0,
              decade: Math.floor(year / 10) * 10
            });
          }
        }

        parsedData.sort((a, b) => a.year - b.year);
        setData(parsedData);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setError('Failed to load inflation data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    parseCSV();
  }, []);

  const filteredData = React.useMemo(() => {
    if (selectedPeriod === 'all') return data;

    const currentYear = data.length > 0 ? Math.max(...data.map(d => d.year)) : new Date().getFullYear();
    const startYear = selectedPeriod === '10years' ? currentYear - 10 :
                      selectedPeriod === '20years' ? currentYear - 20 :
                      selectedPeriod === '2010s' ? 2010 : 2001;
    const endYear = selectedPeriod === '2010s' ? currentYear : currentYear;

    return data.filter(d => d.year >= startYear && d.year <= endYear);
  }, [data, selectedPeriod]);

  const stats = React.useMemo(() => {
    if (data.length === 0 || filteredData.length === 0) return {
      current: 0,
      previous: 0,
      change: 0,
      average: 0,
      highest: 0,
      highestYear: 0,
      lowest: 0,
      lowestYear: 0,
      trend: 0,
      volatility: 0,
      decadeAvgs: [],
      positiveYears: 0,
      negativeYears: 0,
      stableYears: 0
    };

    const latestDataPoint = data[data.length - 1];
    const previousDataPoint = data[data.length - 2] || latestDataPoint;
    
    const rates = filteredData.map(d => d.inflationRate).filter(r => !isNaN(r) && r !== 0);
    const average = rates.reduce((a, b) => a + b, 0) / rates.length;
    
    const highestEntry = filteredData.reduce((max, entry) => 
      entry.inflationRate > max.inflationRate ? entry : max, 
      { inflationRate: -Infinity, year: 0 }
    );
    
    const lowestEntry = filteredData.reduce((min, entry) => 
      entry.inflationRate < min.inflationRate ? entry : min, 
      { inflationRate: Infinity, year: 0 }
    );

    const recentData = filteredData.slice(-5);
    const trend = recentData.length > 1 ? 
      (recentData[recentData.length - 1].inflationRate - recentData[0].inflationRate) / recentData.length : 0;

    const decades = filteredData.reduce((acc, item) => {
      const decade = Math.floor(item.year / 10) * 10;
      if (!acc[decade]) acc[decade] = [];
      acc[decade].push(item.inflationRate);
      return acc;
    }, {} as Record<number, number[]>);

    const decadeAvgs = Object.entries(decades).map(([decade, rates]) => ({
      decade: `${decade}s`,
      average: rates.reduce((a, b) => a + b, 0) / rates.length,
      count: rates.length
    }));

    return {
      current: latestDataPoint.inflationRate,
      previous: previousDataPoint.inflationRate,
      change: latestDataPoint.inflationRate - previousDataPoint.inflationRate,
      average,
      highest: highestEntry.inflationRate,
      highestYear: highestEntry.year,
      lowest: lowestEntry.inflationRate,
      lowestYear: lowestEntry.year,
      trend,
      volatility: Math.sqrt(
        rates.reduce(
          (sum, rate) => sum + Math.pow(rate - average, 2),
          0
        ) / rates.length
      ),
      decadeAvgs,
      positiveYears: filteredData.filter(d => d.inflationRate > 0).length,
      negativeYears: filteredData.filter(d => d.inflationRate < 0).length,
      stableYears: filteredData.filter(d => Math.abs(d.inflationRate) < 2).length
    };
  }, [filteredData, data]);

  const StatCard = ({ title, value, additionalText, icon: Icon, color = 'blue', trend }: {
    title: string;
    value: number | string;
    additionalText?: string;
    icon: React.ComponentType<any>;
    color?: string;
    trend?: 'up' | 'down' | 'stable';
  }) => {
    const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
    const trendColor = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500';
    
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xl font-bold text-gray-900">
                {typeof value === 'number' ? `${value.toFixed(2)}%` : value}
              </p>
              {trend && (
                <TrendIcon className={`w-4 h-4 ${trendColor}`} />
              )}
            </div>
            {additionalText && (
              <p className="text-xs mt-1 text-gray-500">
                {additionalText}
              </p>
            )}
          </div>
          <div className={`p-2 rounded-lg bg-${color}-50`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900">{`Year: ${label}`}</p>
          <p className="text-blue-600">
            {`Inflation Rate: ${payload[0].value.toFixed(2)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg p-6 border border-red-200 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">Data Loading Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg p-6 border border-gray-200 max-w-md">
          <BarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h2>
          <p className="text-gray-600">Please ensure the data source is available.</p>
        </div>
      </div>
    );
  }

  const latestYear = data.length > 0 ? Math.max(...data.map(d => d.year)) : new Date().getFullYear();
  const currentTrend = stats.trend > 0.5 ? 'up' : stats.trend < -0.5 ? 'down' : 'stable';

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Inflation Dashboard
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart2 },
              { id: 'trends', label: 'Trends', icon: TrendingUp },
              { id: 'analysis', label: 'Analysis', icon: Activity }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium ${
                  activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Time' }, 
              { value: '10years', label: 'Last 10 Years' }, 
              { value: '20years', label: 'Last 20 Years' }, 
              { value: '2010s', label: 'Since 2010' }
            ].map(period => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  selectedPeriod === period.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title={`Current Rate`} 
            value={stats.current} 
            icon={Percent} 
            color="blue"
            trend={currentTrend}
          />
          <StatCard 
            title="Period Average" 
            value={stats.average} 
            icon={BarChart2} 
            color="green" 
          />
          <StatCard 
            title="Highest Rate" 
            value={stats.highest} 
            additionalText={`Year: ${stats.highestYear}`}
            icon={TrendingUp} 
            color="red" 
          />
          <StatCard 
            title="Lowest Rate" 
            value={stats.lowest} 
            additionalText={`Year: ${stats.lowestYear}`}
            icon={TrendingDown} 
            color="purple" 
          />
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inflation Rate Timeline</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorInflation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="inflationRate" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorInflation)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Positive Inflation Years</span>
                  <span className="text-sm font-bold text-gray-900">{stats.positiveYears}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Deflationary Years</span>
                  <span className="text-sm font-bold text-gray-900">{stats.negativeYears}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">Volatility Index</span>
                  <span className="text-sm font-bold text-gray-900">{stats.volatility.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Decade Averages</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.decadeAvgs}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="decade" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="average" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;