"use client"

import { useState, useEffect } from "react"
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Shield,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Target,
  MapPin,
  GraduationCap,
  Briefcase
} from "lucide-react"
import { ROICalculator, SAMPLE_CAREER_DATA, EDUCATION_COSTS, type ROICalculation, type EducationCost } from "@/lib/roi-calculator"

const cities = [
  'National Average',
  'San Francisco',
  'New York', 
  'Austin',
  'Atlanta',
  'Seattle',
  'Chicago',
  'Dallas',
  'Denver',
  'Boston'
]

const careerOptions = [
  { id: 'healthcare_nursing', title: 'Registered Nurse', category: 'Healthcare' },
  { id: 'trades_electrician', title: 'Electrician', category: 'Skilled Trades' },
  { id: 'creative_therapist', title: 'Physical Therapist', category: 'Healthcare' },
  { id: 'education_teacher', title: 'Teacher', category: 'Education' },
  { id: 'tech_cybersecurity', title: 'Cybersecurity Specialist', category: 'Technology' }
]

export default function ROICalculatorPage() {
  const [selectedCareer, setSelectedCareer] = useState('healthcare_nursing')
  const [selectedEducation, setSelectedEducation] = useState(0)
  const [currentSalary, setCurrentSalary] = useState(45000)
  const [selectedLocation, setSelectedLocation] = useState('National Average')
  const [timeHorizon, setTimeHorizon] = useState(20)
  const [roiResult, setROIResult] = useState<ROICalculation | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculator = new ROICalculator()

  useEffect(() => {
    calculateROI()
  }, [selectedCareer, selectedEducation, currentSalary, selectedLocation, timeHorizon])

  const calculateROI = async () => {
    setIsCalculating(true)
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const careerData = SAMPLE_CAREER_DATA[selectedCareer]
      const educationOptions = EDUCATION_COSTS[selectedCareer] || []
      
      if (careerData && educationOptions[selectedEducation]) {
        const result = calculator.calculateROI(
          selectedCareer,
          educationOptions[selectedEducation],
          careerData,
          currentSalary,
          selectedLocation,
          timeHorizon
        )
        setROIResult(result)
      }
      setIsCalculating(false)
    }, 500)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`
  }

  const getROIColor = (roi: number) => {
    if (roi > 2) return 'text-green-600'
    if (roi > 0.5) return 'text-blue-600'
    if (roi > 0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRecommendationColor = (payback: number, annualized: number) => {
    if (payback < 0) return 'bg-red-50 border-red-200 text-red-800'
    if (payback <= 5 && annualized > 0.1) return 'bg-green-50 border-green-200 text-green-800'
    if (payback <= 8 && annualized > 0.07) return 'bg-blue-50 border-blue-200 text-blue-800'
    if (payback <= 12) return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    return 'bg-orange-50 border-orange-200 text-orange-800'
  }

  const selectedCareerData = SAMPLE_CAREER_DATA[selectedCareer]
  const availableEducation = EDUCATION_COSTS[selectedCareer] || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="h-12 w-12 text-blue-600 mr-4" />
              <h1 className="text-3xl font-bold text-gray-900">
                Career Investment ROI Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculate the return on investment for different career paths. Compare education costs 
              vs. lifetime earning potential to make informed career decisions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Career & Education Options
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Career Path
                  </label>
                  <select
                    value={selectedCareer}
                    onChange={(e) => {
                      setSelectedCareer(e.target.value)
                      setSelectedEducation(0) // Reset education selection
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {careerOptions.map(career => (
                      <option key={career.id} value={career.id}>
                        {career.title} ({career.category})
                      </option>
                    ))}
                  </select>
                </div>

                {availableEducation.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Path
                    </label>
                    <select
                      value={selectedEducation}
                      onChange={(e) => setSelectedEducation(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {availableEducation.map((edu, index) => (
                        <option key={index} value={index}>
                          {edu.type.charAt(0).toUpperCase() + edu.type.slice(1)} 
                          {' '}({edu.duration} months) - {formatCurrency(edu.tuitionCost)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Annual Salary
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={currentSalary}
                        onChange={(e) => setCurrentSalary(parseInt(e.target.value) || 0)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="45000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Horizon: {timeHorizon} years
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 years</span>
                    <span>40 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Info */}
            {selectedCareerData && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Career Overview
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Entry Salary</div>
                    <div className="font-semibold">{formatCurrency(selectedCareerData.averageSalary.entry)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Senior Salary</div>
                    <div className="font-semibold">{formatCurrency(selectedCareerData.averageSalary.senior)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Job Security</div>
                    <div className="font-semibold">{selectedCareerData.jobSecurity}/10</div>
                  </div>
                  <div>
                    <div className="text-gray-600">AI Resistance</div>
                    <div className="font-semibold flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-green-600" />
                      {selectedCareerData.aiResistanceScore}/10
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {isCalculating ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Calculating your ROI...</p>
              </div>
            ) : roiResult ? (
              <>
                {/* Main ROI Results */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Investment Analysis
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <div className="text-sm text-gray-600">Total Investment</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(roiResult.totalEducationCost)}
                        </div>
                      </div>
                      
                      <div className="border-b pb-3">
                        <div className="text-sm text-gray-600">Payback Period</div>
                        <div className="text-xl font-semibold">
                          {roiResult.timeToBreakeven > 0 
                            ? `${roiResult.timeToBreakeven.toFixed(1)} years`
                            : 'Never breaks even'
                          }
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600">Net Present Value</div>
                        <div className={`text-xl font-semibold ${roiResult.netPresentValue > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(roiResult.netPresentValue)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <div className="text-sm text-gray-600">Lifetime ROI</div>
                        <div className={`text-2xl font-bold ${getROIColor(roiResult.lifetimeROI)}`}>
                          {formatPercentage(roiResult.lifetimeROI)}
                        </div>
                      </div>
                      
                      <div className="border-b pb-3">
                        <div className="text-sm text-gray-600">Annualized Return</div>
                        <div className="text-xl font-semibold">
                          {formatPercentage(roiResult.annualizedReturn)}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600">Risk-Adjusted Return</div>
                        <div className="text-xl font-semibold text-blue-600">
                          {formatPercentage(roiResult.riskAdjustedReturn)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`rounded-lg p-6 border ${getRecommendationColor(roiResult.timeToBreakeven, roiResult.annualizedReturn)}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {roiResult.timeToBreakeven > 0 && roiResult.annualizedReturn > 0.07 ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <AlertCircle className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {roiResult.timeToBreakeven < 0 ? 'Poor Investment' :
                         roiResult.timeToBreakeven <= 5 && roiResult.annualizedReturn > 0.1 ? 'Excellent Investment' :
                         roiResult.timeToBreakeven <= 8 && roiResult.annualizedReturn > 0.07 ? 'Good Investment' :
                         roiResult.timeToBreakeven <= 12 ? 'Fair Investment' : 'Risky Investment'}
                      </h3>
                      <p className="mt-1">
                        {roiResult.timeToBreakeven < 0 ? 'This career path may not provide positive returns based on your inputs.' :
                         roiResult.timeToBreakeven <= 5 && roiResult.annualizedReturn > 0.1 ? 'Strong returns with reasonable payback period. Highly recommended!' :
                         roiResult.timeToBreakeven <= 8 && roiResult.annualizedReturn > 0.07 ? 'Solid returns that outperform market average. Good choice!' :
                         roiResult.timeToBreakeven <= 12 ? 'Moderate returns with longer payback period. Consider your timeline.' :
                         'Long payback period - consider alternatives or different education paths.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comparison Metrics */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Comparison Metrics
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">vs. Stock Market (7% avg)</span>
                      <span className={`font-semibold ${roiResult.comparisonMetrics.vsStockMarket && roiResult.comparisonMetrics.vsStockMarket > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roiResult.comparisonMetrics.vsStockMarket 
                          ? `${roiResult.comparisonMetrics.vsStockMarket > 0 ? '+' : ''}${formatPercentage(roiResult.comparisonMetrics.vsStockMarket)}`
                          : 'N/A'
                        }
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">vs. Current Salary</span>
                      <span className={`font-semibold ${roiResult.comparisonMetrics.vsCurrentSalary && roiResult.comparisonMetrics.vsCurrentSalary > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roiResult.comparisonMetrics.vsCurrentSalary 
                          ? `${roiResult.comparisonMetrics.vsCurrentSalary > 0 ? '+' : ''}${formatCurrency(roiResult.comparisonMetrics.vsCurrentSalary)}`
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Education Breakdown */}
                {availableEducation[selectedEducation] && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Education Investment Breakdown
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tuition & Fees</span>
                        <span className="font-medium">
                          {formatCurrency(availableEducation[selectedEducation].tuitionCost + availableEducation[selectedEducation].materialsAndFees)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Living Expenses</span>
                        <span className="font-medium">
                          {formatCurrency(availableEducation[selectedEducation].livingExpenses)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Opportunity Cost (Lost Wages)</span>
                        <span className="font-medium">
                          {formatCurrency(Math.max(0, availableEducation[selectedEducation].opportunityCost))}
                        </span>
                      </div>
                      
                      <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Total Investment</span>
                        <span>{formatCurrency(roiResult.totalEducationCost)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a career and education path to see ROI analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Important Notes
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• This calculator provides estimates based on national averages and historical data</p>
            <p>• Actual salaries may vary significantly by employer, location, and individual performance</p>
            <p>• Consider non-financial factors like job satisfaction, work-life balance, and personal interests</p>
            <p>• Economic conditions and industry changes can affect career prospects</p>
            <p>• Consult with career advisors and professionals in your target field for personalized guidance</p>
          </div>
        </div>
      </div>
    </div>
  )
}