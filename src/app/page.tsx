import Link from 'next/link';
import { 
  CalculatorIcon, 
  CurrencyDollarIcon, 
  AcademicCapIcon, 
  ClipboardDocumentListIcon, 
  ClockIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const tools = [
  {
    id: 'gpa-calculator',
    name: 'GPA Calculator',
    description: 'Calculate your weighted and unweighted GPA',
    href: '/tools/gpa-calculator',
    icon: CalculatorIcon,
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'budget-tracker',
    name: 'Budget Tracker',
    description: 'Track your income and expenses',
    href: '/tools/budget-tracker',
    icon: CurrencyDollarIcon,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'college-cost-estimator',
    name: 'College Cost Estimator',
    description: 'Estimate college costs and compare options',
    href: '/tools/college-cost-estimator',
    icon: AcademicCapIcon,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'to-do-list',
    name: 'To-Do List',
    description: 'Manage your tasks and deadlines',
    href: '/tools/to-do-list',
    icon: ClipboardDocumentListIcon,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    description: 'Track important dates and deadlines',
    href: '/tools/countdown-timer',
    icon: ClockIcon,
    color: 'from-rose-500 to-rose-600',
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    description: 'Create and customize your resume',
    href: '/tools/resume-builder',
    icon: DocumentTextIcon,
    color: 'from-amber-500 to-amber-600',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Stacked</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your all-in-one toolkit for academic and personal success. Streamline your student life with our powerful tools.
            </p>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative block p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" 
                     style={{ backgroundImage: `linear-gradient(to right, ${tool.color.replace('from-', '').replace('to-', '').split(' ').join(', ')})` }}>
                </div>
                <div className="relative">
                  <div className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-r ${tool.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {tool.name}
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
