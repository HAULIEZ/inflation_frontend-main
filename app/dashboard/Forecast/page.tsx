"use client";
// pages/inflation-prediction.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dynamic from 'next/dynamic';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Sector
} from 'recharts';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import {base_url} from '../../../components/constants/base_url';
import type { Layout } from 'plotly.js';

// Dynamically import Plotly for SHAP visualization with SSR disabled
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const COLORS = scaleOrdinal(schemeCategory10).range();

// TypeScript interfaces
interface Prediction {
  predictions: {
    inflation: number;
    inflation_lower: number;
    inflation_upper: number;
    [key: string]: number;
  };
  source: string;
}

interface FeatureImportance {
  name: string;
  value: number;
  impact: 'Positive' | 'Negative';
}

interface ShapFeature {
  feature: string;
  value: number;
  shap_value: number;
}

interface ShapData {
  features: ShapFeature[];
  base_value: number;
  prediction: number;
}

interface HistoricalData {
  date: string;
  inflation: number;
  FoodCPI: number;
  NonFoodCPI: number;
  ExchangeRate: number;
  PolicyRate: number;
  [key: string]: string | number;
}

const InflationPredictionPage = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2030-01-01'));
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [activeTab, setActiveTab] = useState<'prediction' | 'historical' | 'analysis' | 'indicators'>('prediction');
  const [timeRange, setTimeRange] = useState<'1y' | '5y' | '10y'>('5y');
  const [shapData, setShapData] = useState<ShapData | null>(null);

  // Sample SHAP data - in a real app this would come from your backend
  const generateShapData = (prediction: Prediction | null): ShapData | null => {
    if (!prediction) return null;
    const features: ShapFeature[] = Object.keys(prediction.predictions)
      .filter(key => !['inflation', 'inflation_lower', 'inflation_upper'].includes(key))
      .map(key => ({
        feature: key,
        value: prediction.predictions[key],
        shap_value: (Math.random() * 2 - 1) * prediction.predictions.inflation * 0.3
      }));
    return {
      features,
      base_value: prediction.predictions.inflation * 0.7,
      prediction: prediction.predictions.inflation
    };
  };

  // Fetch prediction from backend
  const fetchPrediction = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(`${base_url}/unified-predict?date=${dateStr}`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data: Prediction = await response.json();
      setPrediction(data);
      // Generate feature importance data
      const importanceData: FeatureImportance[] = Object.entries(data.predictions)
        .filter(([key]) => !['inflation', 'inflation_lower', 'inflation_upper'].includes(key))
        .map(([name, value]) => ({
          name,
          value: typeof value === 'number' ? Math.abs(value) : 0,
          impact: typeof value === 'number' && value > 0 ? 'Positive' : 'Negative' as 'Positive' | 'Negative'
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
      setFeatureImportance(importanceData);
      setShapData(generateShapData(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error('Error fetching prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch historical data (mock - in a real app this would come from your backend)
  const fetchHistoricalData = async () => {
    try {
      // This would be replaced with actual API call to your historical data endpoint
      const mockData = generateMockHistoricalData();
      setHistoricalData(mockData);
    } catch (err) {
      console.error('Error fetching historical data:', err);
    }
  };

  // Generate mock historical data
  const generateMockHistoricalData = (): HistoricalData[] => {
    const data: HistoricalData[] = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 10);
    for (let i = 0; i < 120; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      data.push({
        date: date.toISOString().split('T')[0],
        inflation: 2 + Math.sin(i / 10) * 3 + Math.random(),
        FoodCPI: 100 + Math.sin(i / 8) * 20 + Math.random() * 5,
        NonFoodCPI: 100 + Math.cos(i / 12) * 15 + Math.random() * 3,
        ExchangeRate: 1.2 + Math.sin(i / 15) * 0.3 + Math.random() * 0.1,
        PolicyRate: 0.5 + Math.cos(i / 20) * 2 + Math.random() * 0.3
      });
    }
    return data;
  };

  useEffect(() => {
    fetchPrediction(selectedDate);
    fetchHistoricalData();
  }, []);

  const handleDateChange = (date: Date | null, event?: React.SyntheticEvent<any> | undefined) => {
    if (!date) return;
    // Always set the day to 1
    const newDate = new Date(date);
    newDate.setDate(1);
    setSelectedDate(newDate);
    fetchPrediction(newDate);
  };

  const filteredHistoricalData = historicalData.filter(item => {
    const itemDate = new Date(item.date);
    const now = new Date();
    if (timeRange === '1y') {
      return itemDate > new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    } else if (timeRange === '5y') {
      return itemDate > new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
    } else if (timeRange === '10y') {
      return itemDate > new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
    }
    return true;
  });

  const renderPredictionDetails = () => {
    if (!prediction) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Inflation Prediction</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-gray-500">Predicted Value</span>
              <p className="text-3xl font-bold">
                {prediction.predictions.inflation.toFixed(2)}%
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">Confidence Range</span>
              <p className="text-lg">
                {prediction.predictions.inflation_lower.toFixed(2)}% - {prediction.predictions.inflation_upper.toFixed(2)}%
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Data Source: <span className="font-medium">{prediction.source}</span></p>
            <p className="text-sm text-gray-600">
              {prediction.source === 'historical data' 
                ? 'This prediction is based on actual recorded economic indicators.'
                : 'This prediction is based on forecasted economic indicators using our Prophet model.'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Key Economic Indicators</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(prediction.predictions)
              .filter(([key]) => !['inflation', 'inflation_lower', 'inflation_upper'].includes(key))
              .map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-500">{key}</p>
                  <p className="text-lg">
                    {typeof value === 'number' ? value.toFixed(2) : value}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const renderHistoricalChart = () => {
    if (historicalData.length === 0) return null;
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Historical Inflation Trends</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setTimeRange('1y')} 
              className={`px-3 py-1 text-sm rounded ${timeRange === '1y' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              1 Year
            </button>
            <button 
              onClick={() => setTimeRange('5y')} 
              className={`px-3 py-1 text-sm rounded ${timeRange === '5y' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              5 Years
            </button>
            <button 
              onClick={() => setTimeRange('10y')} 
              className={`px-3 py-1 text-sm rounded ${timeRange === '10y' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              10 Years
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredHistoricalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
              />
              <YAxis label={{ value: 'Inflation %', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                formatter={(value) => [`${value}%`, 'Inflation']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="inflation" 
                name="Inflation Rate" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderFeatureImportance = () => {
    if (featureImportance.length === 0) return null;
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Feature Importance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={featureImportance}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip 
                formatter={(value) => [typeof value === 'number' ? value.toFixed(2) : String(value), 'Value']}
                labelFormatter={(name) => `Feature: ${name}`}
              />
              <Legend />
              <Bar dataKey="value" name="Absolute Impact">
                {featureImportance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.impact === 'Positive' ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderShapVisualization = () => {
    if (!shapData) return null;
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">SHAP Value Explanation</h3>
        <p className="text-sm text-gray-600 mb-4">
          SHAP (SHapley Additive exPlanations) values show how each feature contributes to pushing the
          model output from the base value to the predicted value.
        </p>
        
        <div className="h-96">
          <Plot
            data={[
              {
                type: 'bar',
                x: shapData.features.map(f => f.shap_value),
                y: shapData.features.map(f => f.feature),
                orientation: 'h',
                marker: {
                  color: shapData.features.map(f => f.shap_value > 0 ? '#10b981' : '#ef4444')
                }
              }
            ]}
            layout={{
              title: { text: 'SHAP Values for Inflation Prediction' },
              xaxis: {
                title: 'SHAP Value (impact on prediction)',
                zeroline: true,
                zerolinecolor: '#6b7280',
                zerolinewidth: 2
              },
              yaxis: {
                title: 'Feature',
                automargin: true
              },
              shapes: [{
                type: 'line',
                x0: 0,
                x1: 0,
                y0: -1,
                y1: shapData.features.length,
                line: {
                  color: '#6b7280',
                  width: 2,
                  dash: 'dot'
                }
              }],
              margin: { l: 150, r: 30, t: 30, b: 30 }
            } as Partial<Layout>}
            config={{ responsive: true }}
          />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Base Value</p>
            <p className="text-lg">{shapData.base_value.toFixed(2)}%</p>
            <p className="text-xs text-gray-500">Average model output</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Feature Effects</p>
            <p className="text-lg">{(shapData.prediction - shapData.base_value).toFixed(2)}%</p>
            <p className="text-xs text-gray-500">Combined feature impacts</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Prediction</p>
            <p className="text-lg">{shapData.prediction.toFixed(2)}%</p>
            <p className="text-xs text-gray-500">Final model output</p>
          </div>
        </div>
      </div>
    );
  };

  const renderEconomicIndicators = () => {
    if (!prediction) return null;
    
    const indicators = Object.entries(prediction.predictions)
      .filter(([key]) => !['inflation', 'inflation_lower', 'inflation_upper'].includes(key));
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Economic Indicators Trend Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {indicators.map(([key, value]) => (
            <div key={key} className="border rounded-lg p-4">
              <h4 className="font-medium text-lg mb-2">{key}</h4>
              <p className="text-2xl font-bold mb-3">
                {typeof value === 'number' ? value.toFixed(2) : value}
              </p>
              
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredHistoricalData.filter(d => d[key as keyof HistoricalData] !== undefined)}
                  >
                    <Line
                      type="monotone"
                      dataKey={key as keyof HistoricalData}
                      stroke="#8884d8"
                      dot={false}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      formatter={(value) => [value, key]}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Head>
        <title>Inflation Prediction Dashboard</title>
        <meta name="description" content="Interactive dashboard for inflation rate predictions" />
      </Head>
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Inflation Prediction Dashboard</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-semibold">Select Prediction Date</h2>
                <p className="text-sm text-gray-600">
                  Choose a date to see the predicted inflation rate and contributing factors
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date(2001, 0, 1)}
                  maxDate={new Date(2040, 11, 1)}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  className="border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  popperPlacement="bottom-end"
                />
                
                <button
                  onClick={() => fetchPrediction(selectedDate)}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('prediction')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'prediction' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Prediction Details
              </button>
              <button
                onClick={() => setActiveTab('historical')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'historical' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Historical Trends
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'analysis' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Model Analysis
              </button>
              <button
                onClick={() => setActiveTab('indicators')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'indicators' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Economic Indicators
              </button>
            </nav>
          </div>
          
          {activeTab === 'prediction' && (
            <div className="space-y-6">
              {renderPredictionDetails()}
              {renderFeatureImportance()}
            </div>
          )}
          
          {activeTab === 'historical' && renderHistoricalChart()}
          
          {activeTab === 'analysis' && renderShapVisualization()}
          
          {activeTab === 'indicators' && renderEconomicIndicators()}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Inflation Prediction Dashboard &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InflationPredictionPage;