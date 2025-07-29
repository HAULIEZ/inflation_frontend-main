"use client";

import { useEffect, useState } from "react";

type ComparisonEntry = {
  date: string;
  actual_inflation: number;
  predicted_inflation: number;
};

export default function ComparisonTablePage() {
  const [data, setData] = useState<ComparisonEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/comparison_table.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load comparison data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Inflation Forecast Comparison</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Actual Inflation (%)</th>
                <th className="py-2 px-4 border-b text-left">Predicted Inflation (%)</th>
                <th className="py-2 px-4 border-b text-left">Error (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, i) => {
                const error = (entry.predicted_inflation - entry.actual_inflation).toFixed(2);
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{entry.date}</td>
                    <td className="py-2 px-4 border-b">{entry.actual_inflation}</td>
                    <td className="py-2 px-4 border-b">{entry.predicted_inflation}</td>
                    <td className="py-2 px-4 border-b">{error}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
