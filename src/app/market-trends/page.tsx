"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  DollarSign,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap
} from "lucide-react"

interface MarketTrend {
  id: string
  category: string
  currentDemand: 'High' | 'Medium' | 'Low'
  growthRate: number
  averageSalary: number
  openPositions: number
  aiThreatLevel: 'Low' | 'Medium' | 'High'
  trend: 'up' | 'down' | 'stable'
  topSkills: string[]
  topLocations: string[]
}

interface RegionalData {
  region: string
  growth: number
  avgSalary: number
  jobCount: number
}

const marketTrends: MarketTrend[] = [
  {
    id: 'healthcare',
    category: 'Healthcare',
    currentDemand: 'High',
    growthRate: 15.3,
    averageSalary: 75000,
    openPositions: 125000,
    aiThreatLevel: 'Low',
    trend: 'up',
    topSkills: ['Patient Care', 'Clinical Skills', 'EMR Systems', 'Critical Thinking', 'Communication'],
    topLocations: ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania']
  },
  {
    id: 'skilled_trades',
    category: 'Skilled Trades',
    currentDemand: 'High',
    growthRate: 12.8,
    averageSalary: 68000,
    openPositions: 95000,
    aiThreatLevel: 'Low',
    trend: 'up',
    topSkills: ['Electrical Systems', 'Plumbing', 'HVAC', 'Construction', 'Safety Protocols'],
    topLocations: ['Texas', 'California', 'Florida', 'Illinois', 'Ohio']
  },
  {
    id: 'education',
    category: 'Education',
    currentDemand: 'Medium',
    growthRate: 8.1,
    averageSalary: 52000,
    openPositions: 78000,
    aiThreatLevel: 'Low',
    trend: 'up',
    topSkills: ['Curriculum Development', 'Classroom Management', 'Technology Integration', 'Assessment', 'Student Engagement'],
    topLocations: ['California', 'Texas', 'New York', 'Florida', 'Illinois']
  },
  {
    id: 'creative_arts',
    category: 'Creative Arts',
    currentDemand: 'Medium',
    growthRate: 6.5,
    averageSalary: 58000,
    openPositions: 42000,
    aiThreatLevel: 'Medium',
    trend: 'stable',
    topSkills: ['Graphic Design', 'Content Creation', 'Video Production', 'Photography', 'Brand Strategy'],
    topLocations: ['California', 'New York', 'Illinois', 'Washington', 'Georgia']
  },
  {
    id: 'human_services',
    category: 'Human Services',
    currentDemand: 'High',
    growthRate: 11.2,
    averageSalary: 48000,
    openPositions: 63000,
    aiThreatLevel: 'Low',
    trend: 'up',
    topSkills: ['Counseling', 'Case Management', 'Crisis Intervention', 'Social Work', 'Community Outreach'],
    topLocations: ['California', 'New York', 'Texas', 'Florida', 'Pennsylvania']
  },
  {
    id: 'personal_services',
    category: 'Personal Services',
    currentDemand: 'Medium',
    growthRate: 9.7,
    averageSalary: 45000,
    openPositions: 38000,
    aiThreatLevel: 'Low',
    trend: 'up',
    topSkills: ['Customer Service', 'Manual Dexterity', 'Interpersonal Skills', 'Time Management', 'Attention to Detail'],
    topLocations: ['California', 'Texas', 'Florida', 'New York', 'Illinois']
  }
]

const regionalData: RegionalData[] = [
  { region: 'West Coast', growth: 14.2, avgSalary: 78000, jobCount: 156000 },
  { region: 'Southwest', growth: 13.8, avgSalary: 65000, jobCount: 143000 },
  { region: 'Southeast', growth: 11.5, avgSalary: 58000, jobCount: 128000 },
  { region: 'Northeast', growth: 9.3, avgSalary: 72000, jobCount: 119000 },
  { region: 'Midwest', growth: 8.7, avgSalary: 62000, jobCount: 95000 }
]

export default function MarketTrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [timeframe, setTimeframe] = useState<'1month' | '3months' | '6months' | '1year'>('6months')
  const [sortBy, setSortBy] = useState<'growth' | 'salary' | 'demand'>('growth')

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'  
      case 'Low': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'Low': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const sortedTrends = [...marketTrends].sort((a, b) => {
    switch (sortBy) {
      case 'growth': return b.growthRate - a.growthRate
      case 'salary': return b.averageSalary - a.averageSalary
      case 'demand': 
        const demandOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
        return demandOrder[b.currentDemand] - demandOrder[a.currentDemand]
      default: return 0
    }
  })

  const filteredTrends = selectedCategory === 'all' 
    ? sortedTrends 
    : sortedTrends.filter(trend => trend.id === selectedCategory)

  const totalJobs = marketTrends.reduce((sum, trend) => sum + trend.openPositions, 0)
  const avgGrowth = marketTrends.reduce((sum, trend) => sum + trend.growthRate, 0) / marketTrends.length
  const highDemandCategories = marketTrends.filter(trend => trend.currentDemand === 'High').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
              Job Market Trends Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay ahead of the curve with real-time insights into AI-resistant career opportunities and market dynamics.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Open Positions</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalJobs)}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+18% from last quarter</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">{avgGrowth.toFixed(1)}%</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>Above national average</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Demand Categories</p>
                <p className="text-2xl font-bold text-gray-900">{highDemandCategories}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-purple-600">
              <Zap className="h-4 w-4 mr-1" />
              <span>Immediate opportunities</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Threat Level</p>
                <p className="text-2xl font-bold text-green-900">Low</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Job security high</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {marketTrends.map(trend => (
                    <option key={trend.id} value={trend.id}>{trend.category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1month">1 Month</option>
                  <option value="3months">3 Months</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="growth">Growth Rate</option>
                  <option value="salary">Average Salary</option>
                  <option value="demand">Current Demand</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trend Cards */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Market Trends by Category</h2>
            
            {filteredTrends.map(trend => (
              <div key={trend.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{trend.category}</h3>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(trend.currentDemand)}`}>
                        {trend.currentDemand} Demand
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatColor(trend.aiThreatLevel)}`}>
                        {trend.aiThreatLevel} AI Threat
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center ${trend.trend === 'up' ? 'text-green-600' : trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                      {trend.trend === 'up' ? <TrendingUp className="h-5 w-5 mr-1" /> :
                       trend.trend === 'down' ? <TrendingDown className="h-5 w-5 mr-1" /> :
                       <BarChart3 className="h-5 w-5 mr-1" />}
                      <span className="font-bold">{trend.growthRate > 0 ? '+' : ''}{trend.growthRate}%</span>
                    </div>
                    <span className="text-sm text-gray-500">Growth Rate</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">{formatSalary(trend.averageSalary)}</div>
                      <div className="text-sm text-gray-500">Avg Salary</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">{formatNumber(trend.openPositions)}</div>
                      <div className="text-sm text-gray-500">Open Positions</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Growing</div>
                      <div className="text-sm text-gray-500">Job Market</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Top Skills in Demand:</h4>
                      <div className="flex flex-wrap gap-1">
                        {trend.topSkills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Top Markets:</h4>
                      <div className="flex flex-wrap gap-1">
                        {trend.topLocations.slice(0, 3).map((location, index) => (
                          <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Regional Data Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Regional Growth Leaders
              </h3>
              
              <div className="space-y-4">
                {regionalData.map((region, index) => (
                  <div key={region.region} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{region.region}</span>
                      <span className="text-green-600 font-bold">+{region.growth}%</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Avg Salary: {formatSalary(region.avgSalary)}</span>
                        <span>{formatNumber(region.jobCount)} jobs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
                Market Insights
              </h3>
              
              <div className="space-y-4 text-sm">
                <div className="bg-white bg-opacity-50 rounded-lg p-3">
                  <div className="font-medium text-blue-900 mb-1">🚀 Rising Star</div>
                  <p className="text-blue-800">Healthcare jobs showing 15.3% growth - highest in our tracking period.</p>
                </div>
                
                <div className="bg-white bg-opacity-50 rounded-lg p-3">
                  <div className="font-medium text-blue-900 mb-1">💡 Opportunity</div>
                  <p className="text-blue-800">Skilled trades facing major shortage - great entry point for career switchers.</p>
                </div>
                
                <div className="bg-white bg-opacity-50 rounded-lg p-3">
                  <div className="font-medium text-blue-900 mb-1">🛡️ AI-Protected</div>
                  <p className="text-blue-800">All tracked categories show "Low" AI threat level - your career is secure!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            6-Month Forecast for AI-Resistant Careers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Continued Growth</h3>
              <p className="text-gray-600">AI-resistant careers expected to grow 12-18% over next 6 months as automation increases demand for human skills.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Salary Increases</h3>
              <p className="text-gray-600">Average salary growth of 8-12% expected as skilled worker shortage drives up compensation across all sectors.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Security</h3>
              <p className="text-gray-600">These careers will remain highly secure as they require uniquely human capabilities that AI cannot replicate.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}