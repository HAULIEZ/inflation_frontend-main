"use client";
import React from "react";

// Custom SVG Icons matching the style
const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/>
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const DatabaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M5 13l4 4L19 7"/>
  </svg>
);

const BookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const TrendIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M2 20l3.5-3.5 4 4L18 9l3-3"/>
    <path d="M22 6l-3 3-3.5-3.5-4 4L7 4"/>
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const TEAM = [
  {
    name: "Clever Hauli",
    role: "Lead Data Scientist",
    desc: "Designed the forecasting models and led the analytics pipeline.",
    github: "https://github.com/HAULIEZ"
  }
];

const DATA_SOURCES = [
  {
    name: "Reserve Bank of Malawi",
    url: "https://www.rbm.mw/",
    desc: "Monthly inflation and CPI data."
  },
  {
    name: "World Bank Open Data",
    url: "https://data.worldbank.org/",
    desc: "Annual macroeconomic indicators."
  },
  {
    name: "National Statistical Office of Malawi",
    url: "https://www.nsomalawi.mw/",
    desc: "Official government statistics and datasets."
  }
];

const ROADMAP = [
  { milestone: "Beta Launch", desc: "Initial release with core forecasting and analytics features.", done: true },
  { milestone: "User Feedback Integration", desc: "Collect and implement user suggestions.", done: false },
  { milestone: "API for External Apps", desc: "Expose forecasting API for third-party integration.", done: false },
  { milestone: "Mobile App", desc: "Release a mobile version for on-the-go access.", done: false }
];

const VERSION = "v1.0.0-beta";
const LAST_UPDATED = "2024-06-01";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-8 pt-12">
        {/* 1. Project Overview */}
        <section className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <ChartIcon className="text-blue-600 w-8 h-8" />
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">
              About the Inflation Forecasting System
            </h1>
          </div>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              The Inflation Forecasting System is an advanced analytics platform designed to predict monthly inflation trends for Malawi. Leveraging state-of-the-art machine learning models, it provides timely and accurate forecasts to support economic planning and decision-making.
            </p>
            <p>
              Intended for use by government agencies, researchers, and business analysts, the system enables data-driven policy formulation, academic research, and business intelligence. Its user-friendly dashboard and robust backend make it accessible to both technical and non-technical users.
            </p>
            <p>
              Key use cases include government planning, economic research, and business strategy development, with a focus on transparency, reliability, and actionable insights.
            </p>
          </div>
        </section>

        {/* 2. Methodology & Technologies */}
        <section className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-black">
            <SettingsIcon className="text-green-600 w-6 h-6" />
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <TrendIcon className="text-purple-600 w-5 h-5" />
                <h3 className="font-semibold text-lg text-gray-800">Forecasting Models</h3>
              </div>
              <ul className="list-disc ml-5 space-y-1 text-gray-800">
                <li>Random Forest(Feature selection)</li>
                <li>Prophets(Each feature and Main model)</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3 mb-3">
                <ZapIcon className="text-yellow-600 w-5 h-5" />
                <h3 className="font-semibold text-lg text-gray-800">Pipeline</h3>
              </div>
              <ul className="list-disc ml-5 space-y-1 text-gray-800">
                <li>Data ingestion & preprocessing</li>
                <li>Feature engineering & selection</li>
                <li>Model training, validation, and selection</li>
                <li>Forecast generation & evaluation</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <DatabaseIcon className="text-blue-600 w-5 h-5" />
                <h3 className="font-semibold text-lg text-gray-800">Technologies</h3>
              </div>
              <ul className="list-disc ml-5 space-y-1 text-gray-800">
                <li>Python, FastAPI, Pandas, Scikit-learn</li>
                <li>React, Next.js, Tailwind CSS</li>
                <li>PostgreSQL, Docker, GitHub Actions</li>
              </ul>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <div className="flex items-center gap-3 mb-3">
                <ArrowRightIcon className="text-pink-600 w-5 h-5" />
                <h3 className="font-semibold text-lg text-gray-800">Workflow</h3>
              </div>
              <ul className="list-disc ml-5 space-y-1 text-gray-800">
                <li>Automated data updates</li>
                <li>Interactive dashboard for analysis</li>
                <li>Exportable reports and insights</li>
              </ul>
            </div>
          </div>
          {/* Simple flowchart */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <BookIcon className="w-4 h-4" />
              <span>Data</span>
              <ArrowRightIcon className="w-4 h-4" />
              <ZapIcon className="w-4 h-4" />
              <span>Processing</span>
              <ArrowRightIcon className="w-4 h-4" />
              <TrendIcon className="w-4 h-4" />
              <span>Modeling</span>
              <ArrowRightIcon className="w-4 h-4" />
              <ChartIcon className="w-4 h-4" />
              <span>Forecasts</span>
            </div>
          </div>
        </section>

        {/* 3. Data Sources */}
        <section className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-black">
            <DatabaseIcon className="text-blue-600 w-6 h-6" />
            Data Sources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DATA_SOURCES.map(ds => (
              <a 
                key={ds.name} 
                href={ds.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block p-4 bg-gray-50 rounded-lg border hover:shadow transition-all hover:border-blue-300"
              >
                <div className="flex items-center gap-2 text-blue-700 font-semibold">
                  <GlobeIcon className="w-5 h-5" />
                  {ds.name}
                </div>
                <div className="text-gray-600 text-sm mt-2">{ds.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* 4. Team & Contributors */}
        <section className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-black">
            <UsersIcon className="text-pink-600 w-6 h-6" />
            Developer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TEAM.map(member => (
              <div 
                key={member.name} 
                className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="font-semibold text-xl text-gray-800 mb-1">{member.name}</div>
                <div className="text-blue-600 text-sm mb-2">{member.role}</div>
                <div className="text-gray-600 text-sm mb-4">{member.desc}</div>
                <div className="flex gap-3">
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="GitHub"
                  >
                    <GithubIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Contact & Feedback */}
        <section className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-black">
            <MailIcon className="text-green-600 w-6 h-6" />
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
              <a 
                href="mailto:cleverhauli@gmail.com" 
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <MailIcon className="w-5 h-5" />
                cleverhauli@gmail.com
              </a>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Project Repository</h3>
              <div className="space-y-2">
                <a 
                  href="https://github.com/HAULIEZ/inflation_frontend" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:underline flex items-center gap-2"
                >
                  <GithubIcon className="w-5 h-5" />
                  Frontend
                </a>
                <a 
                  href="https://github.com/HAULIEZ/inflation_backend" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:underline flex items-center gap-2"
                >
                  <GithubIcon className="w-5 h-5" />
                  Backend
                </a>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Feedback</h3>
              <a 
                href="#" 
                className="text-blue-600 hover:underline"
              >
                Submit feedback or report a bug
              </a>
            </div>
          </div>
        </section>

        {/* Roadmap & Version */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-black">
            <CalendarIcon className="text-orange-500 w-6 h-6" />
            Roadmap & Version
          </h2>
          <div className="space-y-4 mb-6">
            {ROADMAP.map(rm => (
              <div 
                key={rm.milestone} 
                className={`p-4 rounded-lg border ${rm.done ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex items-center gap-3">
                  {rm.done ? (
                    <CheckIcon className="text-green-600 w-5 h-5 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="text-gray-400 w-5 h-5 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{rm.milestone}</h3>
                    <p className="text-gray-600 text-sm">{rm.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded mr-2">{VERSION}</span>
            <span>Last updated: {LAST_UPDATED}</span>
          </div>
        </section>
      </div>
    </div>
  );
}