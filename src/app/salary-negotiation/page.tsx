"use client"

import { useState } from "react"
import { 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  FileText, 
  MessageSquare,
  CheckCircle,
  Target,
  Users,
  Award,
  Lightbulb,
  ArrowRight,
  Star,
  X
} from "lucide-react"

interface NegotiationData {
  currentSalary: string
  targetSalary: string
  jobTitle: string
  location: string
  experienceYears: string
  industryExperience: string
  uniqueSkills: string
  recentAchievements: string
  marketResearch: string
}

interface SalaryAnalysis {
  negotiationRange: {
    conservative: number
    moderate: number
    aggressive: number
  }
  marketPosition: string
  increasePotential: number
  recommendedApproach: string
}

export default function SalaryNegotiationPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'guide' | 'scripts' | 'research'>('calculator')
  const [formData, setFormData] = useState<NegotiationData>({
    currentSalary: '',
    targetSalary: '',
    jobTitle: '',
    location: '',
    experienceYears: '',
    industryExperience: '',
    uniqueSkills: '',
    recentAchievements: '',
    marketResearch: ''
  })
  const [analysis, setAnalysis] = useState<SalaryAnalysis | null>(null)

  const calculateNegotiation = () => {
    const current = parseFloat(formData.currentSalary) || 0
    const target = parseFloat(formData.targetSalary) || 0
    const years = parseFloat(formData.experienceYears) || 0

    if (current === 0) return

    // Calculate negotiation ranges
    const baseIncrease = Math.max(current * 0.03, 2000) // Minimum 3% or $2k
    const experienceBonus = years > 5 ? current * 0.02 : 0
    const skillsBonus = formData.uniqueSkills ? current * 0.05 : 0

    const conservative = current + baseIncrease
    const moderate = current + baseIncrease + experienceBonus + (skillsBonus * 0.5)
    const aggressive = target > 0 ? Math.min(target, current + baseIncrease + experienceBonus + skillsBonus) : current + baseIncrease + experienceBonus + skillsBonus

    const increasePotential = ((moderate - current) / current) * 100

    let marketPosition = "Average"
    let recommendedApproach = "Standard negotiation"

    if (years > 7) {
      marketPosition = "Experienced"
      recommendedApproach = "Emphasize leadership and expertise"
    } else if (years > 3) {
      marketPosition = "Mid-level"
      recommendedApproach = "Focus on growth and achievements"
    } else {
      marketPosition = "Entry-Mid level"
      recommendedApproach = "Highlight potential and recent wins"
    }

    setAnalysis({
      negotiationRange: { conservative, moderate, aggressive },
      marketPosition,
      increasePotential,
      recommendedApproach
    })
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const negotiationTips = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Research Market Rates",
      description: "Use sites like Glassdoor, PayScale, and LinkedIn Salary to understand your market value."
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Document Achievements",
      description: "Prepare specific examples of your contributions, metrics, and impact on the organization."
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Consider Total Compensation",
      description: "Look beyond base salary - benefits, PTO, flexibility, and growth opportunities matter."
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Practice Your Pitch",
      description: "Rehearse your negotiation conversation. Be confident but collaborative."
    }
  ]

  const negotiationScripts = [
    {
      situation: "Initial Salary Discussion",
      script: "Thank you for the offer. I'm excited about this opportunity. Based on my research and experience in [specific area], I was hoping we could discuss a salary in the range of [X to Y]. This reflects the value I can bring through [specific skills/achievements]."
    },
    {
      situation: "Countering a Low Offer",
      script: "I appreciate the offer and I'm very interested in the position. However, based on my [X years] of experience and my track record of [specific achievement], I was expecting something closer to [target amount]. Could we explore options to bridge this gap?"
    },
    {
      situation: "When Budget is 'Fixed'",
      script: "I understand the salary range for this role. Could we discuss other aspects of the compensation package? I'm particularly interested in [professional development, flexible work arrangements, additional PTO, etc.]."
    },
    {
      situation: "After Getting a Competing Offer",
      script: "I've received another offer, but I'd prefer to stay here because [reasons]. The other offer includes [specific benefits/salary]. Is there flexibility to match or get closer to that package?"
    }
  ]

  const researchResources = [
    {
      name: "Glassdoor",
      description: "Company reviews and salary information",
      type: "Salary Data",
      url: "https://glassdoor.com"
    },
    {
      name: "PayScale",
      description: "Personalized salary reports",
      type: "Salary Data",
      url: "https://payscale.com"
    },
    {
      name: "LinkedIn Salary",
      description: "Professional network salary insights",
      type: "Salary Data",
      url: "https://linkedin.com/salary"
    },
    {
      name: "Bureau of Labor Statistics",
      description: "Government employment statistics",
      type: "Official Data",
      url: "https://bls.gov"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <DollarSign className="h-8 w-8 mr-3 text-green-600" />
              Salary Negotiation Tools
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Master the art of salary negotiation with data-driven insights, proven scripts, and strategic guidance to maximize your earning potential.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'calculator', label: 'Salary Calculator', icon: Calculator },
                { id: 'guide', label: 'Negotiation Guide', icon: Lightbulb },
                { id: 'scripts', label: 'Conversation Scripts', icon: MessageSquare },
                { id: 'research', label: 'Market Research', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Calculator Tab */}
            {activeTab === 'calculator' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Salary Negotiation Calculator</h2>
                    
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Salary
                          </label>
                          <input
                            type="number"
                            value={formData.currentSalary}
                            onChange={(e) => setFormData(prev => ({ ...prev, currentSalary: e.target.value }))}
                            placeholder="65000"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Target Salary (optional)
                          </label>
                          <input
                            type="number"
                            value={formData.targetSalary}
                            onChange={(e) => setFormData(prev => ({ ...prev, targetSalary: e.target.value }))}
                            placeholder="75000"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                            placeholder="Software Engineer"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="San Francisco, CA"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years of Experience
                          </label>
                          <input
                            type="number"
                            value={formData.experienceYears}
                            onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                            placeholder="5"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Industry Experience
                          </label>
                          <input
                            type="text"
                            value={formData.industryExperience}
                            onChange={(e) => setFormData(prev => ({ ...prev, industryExperience: e.target.value }))}
                            placeholder="Healthcare, Fintech"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unique Skills & Certifications
                        </label>
                        <textarea
                          value={formData.uniqueSkills}
                          onChange={(e) => setFormData(prev => ({ ...prev, uniqueSkills: e.target.value }))}
                          placeholder="AWS Certified, Machine Learning, Team Leadership..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recent Achievements
                        </label>
                        <textarea
                          value={formData.recentAchievements}
                          onChange={(e) => setFormData(prev => ({ ...prev, recentAchievements: e.target.value }))}
                          placeholder="Led team that increased revenue by 20%, implemented new system that saved $50k annually..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={calculateNegotiation}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center space-x-2"
                      >
                        <Calculator className="h-5 w-5" />
                        <span>Calculate Negotiation Strategy</span>
                      </button>
                    </form>
                  </div>
                  
                  <div>
                    {analysis && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-green-900 mb-4">Your Negotiation Analysis</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2">Negotiation Ranges:</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Conservative:</span>
                                <span className="font-semibold">{formatSalary(analysis.negotiationRange.conservative)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Moderate (Recommended):</span>
                                <span className="font-semibold text-green-700">{formatSalary(analysis.negotiationRange.moderate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Aggressive:</span>
                                <span className="font-semibold">{formatSalary(analysis.negotiationRange.aggressive)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-green-800 mb-1">Market Position:</h4>
                            <p className="text-green-700">{analysis.marketPosition}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-green-800 mb-1">Increase Potential:</h4>
                            <p className="text-green-700">{analysis.increasePotential.toFixed(1)}% above current</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-green-800 mb-1">Recommended Approach:</h4>
                            <p className="text-green-700">{analysis.recommendedApproach}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">Quick Tips</h3>
                      <div className="space-y-3">
                        {negotiationTips.map((tip, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="text-blue-600 mt-1">{tip.icon}</div>
                            <div>
                              <h4 className="font-medium text-blue-900">{tip.title}</h4>
                              <p className="text-sm text-blue-700">{tip.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Guide Tab */}
            {activeTab === 'guide' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Negotiation Guide</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                      <h3 className="text-xl font-bold text-blue-900 mb-4">Before You Negotiate</h3>
                      <ul className="space-y-2 text-blue-800">
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Research market rates for your role and location</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Document your achievements and quantify your impact</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Understand the company's compensation philosophy</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Practice your negotiation conversation</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Consider the full compensation package</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 border-l-4 border-green-500 p-6">
                      <h3 className="text-xl font-bold text-green-900 mb-4">During the Negotiation</h3>
                      <ul className="space-y-2 text-green-800">
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Express enthusiasm for the role first</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Present your case based on value, not personal needs</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Use ranges rather than fixed numbers</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Be prepared to discuss alternatives (benefits, PTO, etc.)</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Listen actively and be collaborative</li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
                      <h3 className="text-xl font-bold text-yellow-900 mb-4">Common Mistakes to Avoid</h3>
                      <ul className="space-y-2 text-yellow-800">
                        <li className="flex items-center"><X className="h-4 w-4 mr-2" /> Don't negotiate before receiving an offer</li>
                        <li className="flex items-center"><X className="h-4 w-4 mr-2" /> Don't make it personal or about financial pressures</li>
                        <li className="flex items-center"><X className="h-4 w-4 mr-2" /> Don't accept the first offer immediately</li>
                        <li className="flex items-center"><X className="h-4 w-4 mr-2" /> Don't lie about competing offers</li>
                        <li className="flex items-center"><X className="h-4 w-4 mr-2" /> Don't negotiate via email if possible</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scripts Tab */}
            {activeTab === 'scripts' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Negotiation Scripts & Examples</h2>
                
                <div className="space-y-6">
                  {negotiationScripts.map((script, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                        {script.situation}
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-gray-700 italic">"{script.script}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Research Tab */}
            {activeTab === 'research' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Research Resources</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {researchResources.map((resource, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{resource.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{resource.description}</p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Visit Resource
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  ))}
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-purple-900 mb-4">AI-Resistant Career Advantage</h3>
                  <p className="text-purple-800 mb-4">
                    As someone in an AI-resistant career, you have unique negotiation advantages:
                  </p>
                  <ul className="space-y-2 text-purple-700">
                    <li className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-purple-600" />
                      Your skills cannot be easily automated or outsourced
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-purple-600" />
                      Demand for human expertise in your field is growing
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-purple-600" />
                      You provide irreplaceable value through human connection
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-purple-600" />
                      Your experience and judgment are critical for quality outcomes
                    </li>
                  </ul>
                  <p className="text-purple-800 mt-4 font-medium">
                    Use these points to strengthen your negotiation position!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}