'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiUserPlus, FiLogIn, FiCalendar, FiTrendingUp, FiPieChart, FiArrowRight } from 'react-icons/fi'

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => router.push('/dashboard/forecasts')

  const features = [
    {
      title: "Date Range Selection",
      description: "Specify your forecast period with our intuitive date picker interface.",
      icon: <FiCalendar className="h-5 w-5" />,
      link: "/dashboard/forecasts"
    },
    {
      title: "Precision Forecasting",
      description: "Receive inflation predictions with 92.4% historical accuracy.",
      icon: <FiTrendingUp className="h-5 w-5" />,
      link: "/dashboard/forecasts"
    },
    {
      title: "Visual Analysis",
      description: "Interactive charts showing key inflation indicators and trends.",
      icon: <FiPieChart className="h-5 w-5" />,
      link: "/dashboard/analysis"
    }
  ]

  const stats = [
    { value: "92.4%", label: "Forecast Accuracy" },
    { value: "18", label: "Economic Indicators" },
    { value: "10-Year", label: "Historical Data" },
    { value: "Real-Time", label: "Market Updates" }
  ]

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header - Now matches sidebar styling */}
      <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <FiTrendingUp className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-blue-700">
                InflaForecast
              </h1>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100/80 rounded-lg transition-all duration-200"
              >
                <FiUserPlus className="mr-1.5 h-4 w-4" />
                Sign Up
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
              >
                <FiLogIn className="mr-1.5 h-4 w-4" />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Hero Section */}
          <section className="text-center md:text-left mt-8 space-y-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                Inflation Forecasting <span className="text-blue-600">Simplified</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Select your date range and get immediate inflation predictions powered by our machine learning models analyzing 18 key economic indicators.
              </p>
              <div className="flex justify-center md:justify-start mt-8">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow hover:shadow-md transition-all duration-200"
                >
                  Start Forecasting
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
          
          {/* Features Section - Now matches sidebar cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <Link 
                key={index}
                href={feature.link}
                className="group bg-white p-6 rounded-xl border border-gray-200/50 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 mb-4 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Link>
            ))}
          </section>

          {/* Stats Section - Cleaner presentation */}
          <section className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ready to forecast with precision?
            </h2>
            <div className="flex justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow hover:shadow-md transition-all duration-200"
              >
                Create Free Account
              </Link>
              <Link
                href="/dashboard/forecasts"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200"
              >
                Live Demo
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}