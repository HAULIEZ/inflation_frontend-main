'use client'

import { useEffect, useState } from 'react'

interface ComparisonData {
  date: string
  actual: number
  predicted: number
  absolute_error: number
  percent_error: number
  error_direction: string
}

export default function ComparisonTable() {
  const [data, setData] = useState<ComparisonData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetch('/data/comparison_table.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => console.error('Failed to load data'))
  }, [])

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Detailed Comparison of Actual vs Predicted Inflation</h1>

      <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-md">
        <table className="min-w-full divide-y divide-gray-300 text-sm text-black">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Actual (%)</th>
              <th className="px-4 py-2 text-left">Predicted (%)</th>
              <th className="px-4 py-2 text-left">Absolute Error</th>
              <th className="px-4 py-2 text-left">% Error</th>
              <th className="px-4 py-2 text-left">Direction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 text-black">
                <td className="px-4 py-2">{row.date}</td>
                <td className="px-4 py-2">{row.actual.toFixed(2)}</td>
                <td className="px-4 py-2">{row.predicted.toFixed(2)}</td>
                <td className="px-4 py-2">{row.absolute_error.toFixed(2)}</td>
                <td className="px-4 py-2">{(row.percent_error * 100).toFixed(2)}%</td>
                <td className={`px-4 py-2 ${row.error_direction === 'Overpredicted' ? 'text-red-600' : 'text-green-600'}`}>
                  {row.error_direction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-black">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
