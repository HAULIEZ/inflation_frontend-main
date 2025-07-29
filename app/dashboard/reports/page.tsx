"use client";
import React, { useState, useEffect } from "react";
import { base_url } from "../../../components/constants/base_url";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Enhanced Icons with Loading States
const ReportIcon = ({ className = "", isLoading = false }: { className?: string; isLoading?: boolean }) => (
  <svg className={`${className} ${isLoading ? 'opacity-50 animate-pulse' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
  </svg>
);

const ForecastIcon = ({ className = "", isLoading = false }: { className?: string; isLoading?: boolean }) => (
  <svg className={`${className} ${isLoading ? 'opacity-50 animate-pulse' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/>
  </svg>
);

const EvaluationIcon = ({ className = "", isLoading = false }: { className?: string; isLoading?: boolean }) => (
  <svg className={`${className} ${isLoading ? 'opacity-50 animate-pulse' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
  </svg>
);

const DownloadIcon = ({ className = "", isLoading = false }: { className?: string; isLoading?: boolean }) => (
  <svg className={`${className} ${isLoading ? 'opacity-50 animate-pulse' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4"/>
  </svg>
);

const RefreshIcon = ({ className = "", isLoading = false }: { className?: string; isLoading?: boolean }) => (
  <svg className={`${className} ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
  </svg>
);

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);

const TrendingUpIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
  </svg>
);

const TrendingDownIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
  </svg>
);

const MinusIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4"/>
  </svg>
);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Types
interface DateRange {
  start: { month: number; year: number };
  end: { month: number; year: number };
}

interface TableRow {
  date: string;
  inflation: number;
  inflation_lower: number;
  inflation_upper: number;
  source: string;
  [key: string]: any;
}

interface ReportData {
  chart: number[];
  table: TableRow[];
  title: string;
  summary: string;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
  change?: string;
}

// Skeleton Loaders
const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mt-2"></div>
  </div>
);

const TableRowSkeleton = ({ cols }: { cols: number }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      </td>
    ))}
  </tr>
);

const ChartSkeleton = () => (
  <div className="h-64 bg-gray-100 rounded-lg animate-pulse mt-4 flex items-center justify-center">
    <div className="flex space-x-2">
      <div className="w-2 h-20 bg-gray-300 rounded animate-pulse"></div>
      <div className="w-2 h-16 bg-gray-300 rounded animate-pulse"></div>
      <div className="w-2 h-24 bg-gray-300 rounded animate-pulse"></div>
      <div className="w-2 h-12 bg-gray-300 rounded animate-pulse"></div>
      <div className="w-2 h-28 bg-gray-300 rounded animate-pulse"></div>
    </div>
  </div>
);

// Enhanced Success Toast with Auto-dismiss
const SuccessToast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-in max-w-sm">
      <CheckIcon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-2 hover:bg-green-600 rounded p-1 transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
};

// Enhanced StatCard with better trend indicators
const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  trend = 'neutral',
  change,
  isLoading = false 
}: StatCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return TrendingUpIcon;
      case 'down': return TrendingDownIcon;
      default: return MinusIcon;
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow ${isLoading ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded w-3/4 mt-2 animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {change && !isLoading && (
            <div className={`mt-2 flex items-center text-xs font-medium ${
              trend === 'up' ? 'text-green-600' :
              trend === 'down' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              <TrendIcon className="w-3 h-3 mr-1" />
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          trend === 'up' ? 'bg-green-100 text-green-600' :
          trend === 'down' ? 'bg-red-100 text-red-600' :
          'bg-blue-100 text-blue-600'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Enhanced DateRangePicker with validation
const DateRangePicker = ({ 
  dateRange, 
  setDateRange,
  isLoading = false
}: { 
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  isLoading?: boolean;
}) => {
  const years = Array.from({ length: 2040 - 2004 + 1 }, (_, i) => 2004 + i);
  
  const validateDateRange = (newRange: DateRange) => {
    const startDate = new Date(newRange.start.year, newRange.start.month);
    const endDate = new Date(newRange.end.year, newRange.end.month);
    
    if (startDate > endDate) {
      // Auto-adjust end date if it's before start date
      return {
        ...newRange,
        end: { ...newRange.start }
      };
    }
    return newRange;
  };

  const handleDateChange = (type: 'start' | 'end', field: 'month' | 'year', value: number) => {
    const newRange = {
      ...dateRange,
      [type]: {
        ...dateRange[type],
        [field]: value
      }
    };
    setDateRange(validateDateRange(newRange));
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select
        value={dateRange.start.month}
        onChange={e => handleDateChange('start', 'month', Number(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
        disabled={isLoading}
        aria-label="Start month"
      >
        {MONTHS.map((m, i) => (
          <option key={m} value={i}>{m}</option>
        ))}
      </select>
      <select
        value={dateRange.start.year}
        onChange={e => handleDateChange('start', 'year', Number(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
        disabled={isLoading}
        aria-label="Start year"
      >
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <span className="text-sm text-gray-500 font-medium">to</span>
      <select
        value={dateRange.end.month}
        onChange={e => handleDateChange('end', 'month', Number(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
        disabled={isLoading}
        aria-label="End month"
      >
        {MONTHS.map((m, i) => (
          <option key={m} value={i}>{m}</option>
        ))}
      </select>
      <select
        value={dateRange.end.year}
        onChange={e => handleDateChange('end', 'year', Number(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
        disabled={isLoading}
        aria-label="End year"
      >
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

// Enhanced LineChart with better interactivity
const LineChart = ({ data, title, isLoading = false }: { data: number[]; title: string; isLoading?: boolean }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  if (isLoading) return <ChartSkeleton />;
  
  if (!data || data.length === 0) return (
    <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <p className="mt-2 text-sm font-medium">No chart data available</p>
        <p className="text-xs text-gray-400">Data will appear here once loaded</p>
      </div>
    </div>
  );
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {hoveredPoint !== null && (
          <div className="text-sm text-gray-600">
            Value: <span className="font-medium text-gray-900">{data[hoveredPoint]?.toFixed(2)}%</span>
          </div>
        )}
      </div>
      <div className="h-64 relative">
        <svg width="100%" height="100%" viewBox="0 0 300 200" className="max-w-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <g key={i}>
              <line 
                x1="40" y1={20 + ratio * 140} 
                x2="280" y2={20 + ratio * 140} 
                stroke="#e5e7eb" strokeWidth="1" 
              />
              <text x="35" y={25 + ratio * 140} fill="#6b7280" fontSize="10" textAnchor="end">
                {(max - range * ratio).toFixed(1)}
              </text>
            </g>
          ))}
          
          {/* X-axis labels */}
          {data.map((_, i) => (
            i % Math.ceil(data.length / 8) === 0 && (
              <text 
                key={i} 
                x={40 + (i / (data.length - 1)) * 240} 
                y="185" 
                fill="#6b7280" 
                fontSize="10" 
                textAnchor="middle"
              >
                {MONTHS[i % MONTHS.length]}
              </text>
            )
          ))}
          
          {/* Chart area */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"/>
            </linearGradient>
          </defs>
          
          {/* Area under curve */}
          <path
            fill="url(#chartGradient)"
            d={`M 40 160 L ${data.map((v, i) => 
              `${40 + (i / (data.length - 1)) * 240} ${20 + 140 - ((v - min) / range) * 140}`
            ).join(" L ")} L 280 160 Z`}
          />
          
          {/* Chart line */}
          <polyline 
            fill="none" 
            stroke="#4f46e5" 
            strokeWidth="3" 
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((v, i) => 
              `${40 + (i / (data.length - 1)) * 240},${20 + 140 - ((v - min) / range) * 140}`
            ).join(" ")} 
          />
          
          {/* Data points */}
          {data.map((v, i) => (
            <circle 
              key={i} 
              cx={40 + (i / (data.length - 1)) * 240} 
              cy={20 + 140 - ((v - min) / range) * 140} 
              r={hoveredPoint === i ? "6" : "4"} 
              fill={hoveredPoint === i ? "#312e81" : "#4f46e5"}
              stroke="#fff"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

const ReportPage = () => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDownloading, setIsDownloading] = useState({ pdf: false, csv: false });
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ 
    start: { month: 0, year: new Date().getFullYear() - 1 }, 
    end: { month: 11, year: new Date().getFullYear() } 
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const fetchReport = async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    setError(null);
    try {
      const start = new Date(dateRange.start.year, dateRange.start.month, 1);
      const end = new Date(dateRange.end.year, dateRange.end.month, 1);
      const startStr = start.toISOString().slice(0, 10);
      const endStr = end.toISOString().slice(0, 10);
      
      const response = await fetch(`${base_url}/unified-report?start_date=${startStr}&end_date=${endStr}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate report");
      }
      
      const data = await response.json();
      
      // Transform for UI
      const chart = data.results.map((r: any) => r.inflation);
      const table = data.results.map((r: any) => ({
        date: r.date,
        inflation: r.inflation,
        inflation_lower: r.inflation_lower,
        inflation_upper: r.inflation_upper,
        source: r.source,
        ...r.features
      }));
      
      setReport({
        chart,
        table,
        title: `Economic Report (${startStr} to ${endStr})`,
        summary: `Analysis of economic indicators from ${MONTHS[dateRange.start.month]} ${dateRange.start.year} to ${MONTHS[dateRange.end.month]} ${dateRange.end.year}. This report includes inflation trends, confidence intervals, and related economic features for comprehensive market analysis.`,
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      console.error("Report generation error:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchReport();
  };

  const showSuccessToast = (message: string) => {
    setSuccessToast(message);
  };

  const calculateStatistics = () => {
    if (!report?.chart || report.chart.length === 0) {
      return { current: "-", average: "-", change: "", trend: 'neutral' as const };
    }
    
    const data = report.chart;
    const current = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : current;
    const average = data.reduce((a, b) => a + b, 0) / data.length;
    const change = current - previous;
    const changePercent = previous !== 0 ? (change / previous * 100) : 0;
    
    return {
      current: current.toFixed(2),
      average: average.toFixed(2),
      change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}% from previous period`,
      trend: changePercent > 0 ? 'up' as const : changePercent < 0 ? 'down' as const : 'neutral' as const
    };
  };

  const stats = calculateStatistics();

  const downloadCSV = async () => {
    if (!report?.table || report.table.length === 0) {
      alert('No data available to download');
      return;
    }
    
    setIsDownloading(prev => ({ ...prev, csv: true }));
    
    try {
      const headers = Object.keys(report.table[0]);
      const csvContent = [
        // Add title and metadata
        [`"${report.title}"`],
        [`"Generated: ${new Date().toLocaleString()}"`],
        [`"Date Range: ${MONTHS[dateRange.start.month]} ${dateRange.start.year} - ${MONTHS[dateRange.end.month]} ${dateRange.end.year}"`],
        [''], // Empty row
        // Headers
        headers.map(header => `"${header.replace(/"/g, '""')}"`),
        // Data rows
        ...report.table.map((row: any) => 
          headers.map(header => {
            const value = row[header];
            if (typeof value === 'number') {
              return value.toFixed(4);
            }
            return `"${String(value || '').replace(/"/g, '""')}"`;
          })
        )
      ].map(row => Array.isArray(row) ? row.join(',') : row).join('\n');

      const filename = `economic_report_${dateRange.start.year}-${String(dateRange.start.month + 1).padStart(2, '0')}_to_${dateRange.end.year}-${String(dateRange.end.month + 1).padStart(2, '0')}.csv`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccessToast(`CSV file "${filename}" downloaded successfully!`);
      
    } catch (error) {
      console.error('CSV download error:', error);
      alert('Failed to download CSV file. Please try again.');
    } finally {
      setIsDownloading(prev => ({ ...prev, csv: false }));
    }
  };

  const downloadPDF = async () => {
    if (!report?.table || report.table.length === 0) {
      alert('No data available to download');
      return;
    }
    
    setIsDownloading(prev => ({ ...prev, pdf: true }));
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      const title = report.title;
      doc.text(title, pageWidth / 2, 20, { align: 'center' });
      
      // Metadata
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const dateStr = `Generated: ${new Date().toLocaleString()}`;
      const rangeStr = `Period: ${MONTHS[dateRange.start.month]} ${dateRange.start.year} - ${MONTHS[dateRange.end.month]} ${dateRange.end.year}`;
      doc.text(dateStr, 14, 35);
      doc.text(rangeStr, 14, 42);
      
      // Summary
      if (report.summary) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Summary:', 14, 55);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const splitSummary = doc.splitTextToSize(report.summary, pageWidth - 28);
        doc.text(splitSummary, 14, 62);
      }
      
      // Get table headers and limit columns for PDF print layout
      const allHeaders = Object.keys(report.table[0]);
      
      // Select the most important columns for PDF (limit to 5-6 columns for better print layout)
      const pdfHeaders = allHeaders.filter(header => 
        ['date', 'inflation', 'inflation_lower', 'inflation_upper', 'source'].includes(header)
      ).slice(0, 5);
      
      // If we don't have the expected columns, just take the first 5
      const finalHeaders = pdfHeaders.length > 0 ? pdfHeaders : allHeaders.slice(0, 5);
      
      const rows = report.table.slice(0, 50).map((row: any) => 
        finalHeaders.map(header => {
          const value = row[header];
          if (typeof value === 'number') {
            return value.toFixed(2);
          }
          return String(value || '');
        })
      );
      
      autoTable(doc, {
        head: [finalHeaders.map(h => h.replace(/_/g, ' ').toUpperCase())],
        body: rows,
        startY: report.summary ? 85 : 55,
        styles: { 
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: { 
          fillColor: [79, 70, 229],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        },
        margin: { left: 14, right: 14 },
        tableWidth: 'auto',
        columnStyles: {
          0: { cellWidth: 'auto' }, // Date column
        },
        didDrawPage: function (data: any) {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor(128);
          doc.text(
            `Page ${data.pageNumber} | Economic Analysis Report`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
          );
        }
      });
      
      // Chart summary stats if available
      if (report.chart && report.chart.length > 0) {
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        if (finalY < pageHeight - 40) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Statistical Summary:', 14, finalY);
          
          const chartData = report.chart.filter((v: any) => !isNaN(v));
          if (chartData.length > 0) {
            const avg = chartData.reduce((a: number, b: number) => a + b, 0) / chartData.length;
            const max = Math.max(...chartData);
            const min = Math.min(...chartData);
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Average Inflation: ${avg.toFixed(2)}%`, 14, finalY + 10);
            doc.text(`Maximum: ${max.toFixed(2)}%`, 14, finalY + 17);
            doc.text(`Minimum: ${min.toFixed(2)}%`, 14, finalY + 24);
          }
        }
      }
      
      const filename = `economic_report_${dateRange.start.year}-${String(dateRange.start.month + 1).padStart(2, '0')}_to_${dateRange.end.year}-${String(dateRange.end.month + 1).padStart(2, '0')}.pdf`;
      doc.save(filename);
      
      showSuccessToast(`PDF file "${filename}" downloaded successfully!`);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to download PDF file. Please try again.');
    } finally {
      setIsDownloading(prev => ({ ...prev, pdf: false }));
    }
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg border border-red-200 shadow-sm p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Unable to Load Report</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshIcon className="w-4 h-4 mr-2" isLoading={isRefreshing} />
              {isRefreshing ? 'Retrying...' : 'Try Again'}
            </button>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Success Toast */}
      {successToast && (
        <SuccessToast 
          message={successToast} 
          onClose={() => setSuccessToast(null)} 
        />
      )}

      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ReportIcon className="w-8 h-8" isLoading={isRefreshing} />
              Economic Analysis Dashboard
            </h1>
            <p className="text-blue-100 mt-2">
              Comprehensive economic indicators and inflation trend analysis
            </p>
          </div>
          <div className="text-right">
            {lastUpdated && (
              <div className="text-blue-100 text-sm mb-2">
                Last updated: {lastUpdated}
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isRefreshing 
                  ? 'bg-blue-500/50 text-blue-200 cursor-not-allowed' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              <RefreshIcon className="w-4 h-4" isLoading={isRefreshing} />
              {isRefreshing ? 'Updating...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading && !report ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard 
              title="Current Inflation Rate" 
              value={`${stats.current}%`}
              subtitle="Latest period" 
              icon={ForecastIcon} 
              trend={stats.trend}
              change={stats.change}
              isLoading={isRefreshing}
            />
            <StatCard 
              title="Data Points" 
              value={report?.table ? report.table.length.toString() : "0"} 
              subtitle="Total records analyzed" 
              icon={EvaluationIcon} 
              trend="neutral"
              change="Complete dataset"
              isLoading={isRefreshing}
            />
            <StatCard 
              title="Average Inflation" 
              value={`${stats.average}%`}
              subtitle="Period average" 
              icon={ReportIcon} 
              trend="neutral"
              change="Historical baseline"
              isLoading={isRefreshing}
            />
          </>
        )}
      </div>

      {/* Enhanced Report Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
            </svg>
            Report Configuration
          </h2>
          <div className="text-sm text-gray-500">
            Customize your analysis parameters
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Analysis Time Period
            </label>
            <DateRangePicker 
              dateRange={dateRange} 
              setDateRange={setDateRange}
              isLoading={isRefreshing}
            />
            <p className="mt-2 text-xs text-gray-500">
              Select the date range for your economic analysis. Data availability may vary by period.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Report Content */}
      {isLoading && !report ? (
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
            <ChartSkeleton />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-16 bg-gray-200 animate-pulse"></div>
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      ) : report && (
        <div className="space-y-8">
          {/* Enhanced Summary and Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{report.title}</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">{report.summary}</p>
              </div>
            </div>
            <LineChart 
              data={report.chart} 
              title="Inflation Trend Analysis" 
              isLoading={isRefreshing}
            />
          </div>

          {/* Enhanced Data Table with Top Download Buttons */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                    </svg>
                    Detailed Economic Indicators
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">
                    Showing {report.table ? Math.min(10, report.table.length) : 0} of {report.table ? report.table.length : 0} records
                  </div>
                </div>
                
                {/* Download Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={downloadPDF}
                    disabled={isRefreshing || isDownloading.pdf}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isRefreshing || isDownloading.pdf
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <DownloadIcon className="w-4 h-4" isLoading={isDownloading.pdf} />
                    {isDownloading.pdf ? 'PDF...' : 'PDF'}
                  </button>
                  
                  <button
                    onClick={downloadCSV}
                    disabled={isRefreshing || !report.table || isDownloading.csv}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isRefreshing || !report.table || isDownloading.csv
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <DownloadIcon className="w-4 h-4" isLoading={isDownloading.csv} />
                    {isDownloading.csv ? 'CSV...' : 'CSV'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {report.table && Object.keys(report.table[0]).map((key) => (
                      <th 
                        key={key}
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50 sticky top-0"
                      >
                        {key.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isRefreshing ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRowSkeleton key={i} cols={report.table ? Object.keys(report.table[0]).length : 5} />
                    ))
                  ) : (
                    report.table && report.table.slice(0, 10).map((row: any, i: number) => (
                      <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                        {Object.values(row).map((value: any, j: number) => (
                          <td 
                            key={j} 
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                          >
                            {typeof value === 'number' ? value.toFixed(4) : value || '-'}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {report.table && report.table.length > 10 && (
              <div className="bg-blue-50 px-6 py-4 border-t border-blue-200">
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-sm text-blue-700 font-medium">
                    {report.table.length - 10} more records available in downloaded files
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ReportPage;