"use client"

import { useState } from "react"
import { 
  Building, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Users, 
  Shield,
  CheckCircle,
  AlertCircle,
  Send,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

interface JobPostingForm {
  // Company Info
  companyName: string
  companyEmail: string
  companyWebsite: string
  companySize: string
  
  // Job Details
  jobTitle: string
  jobDescription: string
  requirements: string
  responsibilities: string
  location: string
  isRemote: boolean
  employmentType: string
  
  // Compensation
  salaryMin: string
  salaryMax: string
  salaryCurrency: string
  salaryPeriod: string
  benefits: string
  
  // Experience
  experienceLevel: string
  requiredSkills: string
  preferredSkills: string
  education: string
  certifications: string
  
  // Application
  applicationUrl: string
  applicationEmail: string
  applicationInstructions: string
  
  // Meta
  category: string
  contactPerson: string
  contactPhone: string
}

const initialForm: JobPostingForm = {
  companyName: '',
  companyEmail: '',
  companyWebsite: '',
  companySize: 'small',
  jobTitle: '',
  jobDescription: '',
  requirements: '',
  responsibilities: '',
  location: '',
  isRemote: false,
  employmentType: 'full-time',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  salaryPeriod: 'yearly',
  benefits: '',
  experienceLevel: 'mid',
  requiredSkills: '',
  preferredSkills: '',
  education: '',
  certifications: '',
  applicationUrl: '',
  applicationEmail: '',
  applicationInstructions: '',
  category: 'Healthcare',
  contactPerson: '',
  contactPhone: ''
}

const categories = [
  'Healthcare',
  'Skilled Trades', 
  'Education',
  'Creative Arts',
  'Human Services',
  'Personal Care Services',
  'Emergency Services',
  'Other'
]

const companySizes = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-200 employees)' },
  { value: 'large', label: 'Large (201-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
]

export default function PostJobPage() {
  const [form, setForm] = useState<JobPostingForm>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; data?: any } | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [estimatedAIScore, setEstimatedAIScore] = useState<number | null>(null)

  const updateForm = (field: keyof JobPostingForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
    
    // Calculate estimated AI resistance score
    if (field === 'jobTitle' || field === 'jobDescription' || field === 'requiredSkills') {
      calculateEstimatedAIScore()
    }
  }

  const calculateEstimatedAIScore = () => {
    const text = `${form.jobTitle} ${form.jobDescription} ${form.requiredSkills}`.toLowerCase()
    let score = 5

    const highResistanceKeywords = [
      'nurse', 'doctor', 'therapist', 'electrician', 'plumber', 'teacher',
      'hands-on', 'physical', 'creative', 'leadership', 'emergency', 'patient'
    ]

    const lowResistanceKeywords = [
      'data entry', 'administrative', 'clerical', 'routine', 'automated'
    ]

    highResistanceKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 1.2
    })

    lowResistanceKeywords.forEach(keyword => {
      if (text.includes(keyword)) score -= 1.5
    })

    setEstimatedAIScore(Math.max(1, Math.min(10, Math.round(score))))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const payload = {
        ...form,
        requirements: form.requirements.split('\n').filter(r => r.trim()),
        responsibilities: form.responsibilities.split('\n').filter(r => r.trim()),
        benefits: form.benefits.split(',').map(b => b.trim()).filter(b => b),
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        preferredSkills: form.preferredSkills.split(',').map(s => s.trim()).filter(s => s),
        education: form.education.split(',').map(e => e.trim()).filter(e => e),
        certifications: form.certifications.split(',').map(c => c.trim()).filter(c => c),
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined
      }

      const response = await fetch('/api/employers/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      setSubmitResult(result)

      if (result.success) {
        // Reset form on success
        setForm(initialForm)
        setCurrentStep(1)
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'Failed to submit job posting. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAIScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-100 text-gray-600'
    if (score >= 8) return 'bg-green-100 text-green-800'
    if (score >= 6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Company Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => updateForm('companyName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Company Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email *
                </label>
                <input
                  type="email"
                  value={form.companyEmail}
                  onChange={(e) => updateForm('companyEmail', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="hiring@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  value={form.companyWebsite}
                  onChange={(e) => updateForm('companyWebsite', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  value={form.companySize}
                  onChange={(e) => updateForm('companySize', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {companySizes.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Job Details
              </h3>
              {estimatedAIScore && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getAIScoreColor(estimatedAIScore)}`}>
                  <Shield className="inline h-4 w-4 mr-1" />
                  AI Resistance: {estimatedAIScore}/10
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={(e) => updateForm('jobTitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Registered Nurse - ICU"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => updateForm('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateForm('location', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="City, State"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={form.experienceLevel}
                  onChange={(e) => updateForm('experienceLevel', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.isRemote}
                  onChange={(e) => updateForm('isRemote', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Remote work available</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={form.jobDescription}
                onChange={(e) => updateForm('jobDescription', e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the role, responsibilities, and what makes this job AI-resistant..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements (one per line)
                </label>
                <textarea
                  value={form.requirements}
                  onChange={(e) => updateForm('requirements', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Bachelor's degree required&#10;2+ years experience&#10;Valid license"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Responsibilities (one per line)
                </label>
                <textarea
                  value={form.responsibilities}
                  onChange={(e) => updateForm('responsibilities', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Patient care and assessment&#10;Team collaboration&#10;Documentation"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Compensation & Application
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) => updateForm('salaryMin', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="75000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) => updateForm('salaryMax', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="95000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application URL
                </label>
                <input
                  type="url"
                  value={form.applicationUrl}
                  onChange={(e) => updateForm('applicationUrl', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://company.com/careers/apply"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Email
                </label>
                <input
                  type="email"
                  value={form.applicationEmail}
                  onChange={(e) => updateForm('applicationEmail', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="jobs@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => updateForm('contactPerson', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Sarah Johnson, HR Manager"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => updateForm('contactPhone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits (comma-separated)
              </label>
              <input
                type="text"
                value={form.benefits}
                onChange={(e) => updateForm('benefits', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Health insurance, 401k, PTO, Dental, Vision"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills (comma-separated)
              </label>
              <input
                type="text"
                value={form.requiredSkills}
                onChange={(e) => updateForm('requiredSkills', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Patient care, Critical thinking, Communication, Medical knowledge"
              />
            </div>
          </div>
        )
    }
  }

  if (submitResult?.success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Job Posting Submitted Successfully! 🎉
            </h1>
            <p className="text-gray-600 mb-6">
              Your job posting for "{submitResult.data?.jobListing?.title}" has been submitted for review.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 mb-3">Next Steps:</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  {submitResult.data?.nextSteps?.map((step: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 mt-2"></div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-medium text-gray-900">Submission ID</div>
                <div className="text-gray-600">{submitResult.data?.submissionId}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-medium text-gray-900">AI Resistance Score</div>
                <div className="text-gray-600">{submitResult.data?.jobListing?.aiResistanceScore}/10</div>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => {
                  setSubmitResult(null)
                  setCurrentStep(1)
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Post Another Job
              </button>
              <Link
                href="/jobs"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/jobs" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post an AI-Resistant Job</h1>
          <p className="text-gray-600">
            Connect with candidates seeking careers that won't be replaced by AI
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
              <span className="font-medium">Company Info</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
              <span className="font-medium">Job Details</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
              <span className="font-medium">Compensation</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {/* Error Display */}
            {submitResult && !submitResult.success && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800">{submitResult.message}</span>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Job Posting</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Posting Guidelines</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Jobs should require human creativity, empathy, or physical skills</p>
            <p>• Positions involving complex problem-solving in unpredictable environments</p>
            <p>• Roles requiring face-to-face human interaction</p>
            <p>• Jobs with hands-on technical skills that can't be easily automated</p>
            <p>• All postings are reviewed within 1-2 business days</p>
          </div>
        </div>
      </div>
    </div>
  )
}