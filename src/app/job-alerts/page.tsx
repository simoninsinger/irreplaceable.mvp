"use client"

import { useState, useEffect } from "react"
import { 
  Bell, 
  Plus, 
  Search, 
  MapPin, 
  DollarSign, 
  Shield, 
  Mail,
  Trash2,
  Edit,
  Power,
  PowerOff,
  Calendar,
  Check
} from "lucide-react"

interface JobAlert {
  id: string
  email: string
  keywords: string[]
  location?: string
  minSalary?: number
  categories: string[]
  minAIResistance: number
  frequency: 'daily' | 'weekly' | 'instant'
  active: boolean
  createdAt: string
  lastSent?: string
}

const categories = [
  "Healthcare", 
  "Skilled Trades",
  "Creative Arts",
  "Human Services",
  "Education",
  "Sales & Relations",
  "Leadership & Management",
  "Other"
]

export default function JobAlertsPage() {
  const [alerts, setAlerts] = useState<JobAlert[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    keywords: "",
    location: "",
    minSalary: "",
    categories: [] as string[],
    minAIResistance: "6",
    frequency: "weekly" as 'daily' | 'weekly' | 'instant'
  })

  useEffect(() => {
    // Get user email from localStorage or auth
    const storedEmail = localStorage.getItem('userEmail') || ""
    setUserEmail(storedEmail)
    setFormData(prev => ({ ...prev, email: storedEmail }))
    
    if (storedEmail) {
      fetchAlerts(storedEmail)
    }
  }, [])

  const fetchAlerts = async (email: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/job-alerts?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (data.success) {
        setAlerts(data.data)
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch('/api/job-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
          minSalary: formData.minSalary ? parseInt(formData.minSalary) : undefined
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage("Job alert created successfully!")
        setShowCreateForm(false)
        setFormData({
          email: userEmail,
          keywords: "",
          location: "",
          minSalary: "",
          categories: [],
          minAIResistance: "6",
          frequency: "weekly"
        })
        fetchAlerts(userEmail)
      } else {
        setMessage(data.message || "Error creating job alert")
      }
    } catch (error) {
      setMessage("Error creating job alert")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAlert = async (alertId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/job-alerts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alertId,
          email: userEmail,
          active: !currentStatus
        })
      })

      const data = await response.json()
      
      if (data.success) {
        fetchAlerts(userEmail)
      }
    } catch (error) {
      console.error('Error toggling alert:', error)
    }
  }

  const deleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this job alert?')) return

    try {
      const response = await fetch(`/api/job-alerts?id=${alertId}&email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        fetchAlerts(userEmail)
      }
    } catch (error) {
      console.error('Error deleting alert:', error)
    }
  }

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'instant': return 'Instant'
      case 'daily': return 'Daily'
      case 'weekly': return 'Weekly'
      default: return frequency
    }
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center mb-6">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Enter Your Email</h2>
            <p className="text-gray-600">We need your email to manage job alerts</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault()
            const email = (e.target as any).email.value
            localStorage.setItem('userEmail', email)
            setUserEmail(email)
            setFormData(prev => ({ ...prev, email }))
            fetchAlerts(email)
          }}>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="h-8 w-8 mr-3 text-blue-600" />
                Job Alerts
              </h1>
              <p className="text-gray-600 mt-2">
                Get notified when new AI-resistant jobs match your criteria
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Alert</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-800">{message}</span>
            </div>
          </div>
        )}

        {/* Create Alert Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Job Alert</h2>
            
            <form onSubmit={createAlert} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="nurse, healthcare, patient care"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="New York, NY"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary (optional)
                  </label>
                  <input
                    type="number"
                    value={formData.minSalary}
                    onChange={(e) => setFormData(prev => ({ ...prev, minSalary: e.target.value }))}
                    placeholder="50000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                    <option value="instant">Instant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum AI Resistance Score
                </label>
                <select
                  value={formData.minAIResistance}
                  onChange={(e) => setFormData(prev => ({ ...prev, minAIResistance: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">Any Level (1+)</option>
                  <option value="6">Medium (6+)</option>
                  <option value="8">High (8+)</option>
                  <option value="9">Very High (9+)</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading || formData.categories.length === 0}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400"
                >
                  {isLoading ? 'Creating...' : 'Create Alert'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Job Alerts ({alerts.length})</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Alerts Yet</h3>
              <p className="text-gray-600 mb-4">Create your first job alert to get notified of new opportunities.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Create Your First Alert
              </button>
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {alert.keywords.join(', ')}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        alert.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {alert.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600 mb-2">
                      {alert.location && (
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {alert.location}
                        </span>
                      )}
                      
                      {alert.minSalary && (
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${alert.minSalary.toLocaleString()}+
                        </span>
                      )}
                      
                      <span className="flex items-center">
                        <Shield className="h-4 w-4 mr-1" />
                        {alert.minAIResistance}/10 AI-Resistance
                      </span>
                      
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {getFrequencyLabel(alert.frequency)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {alert.categories.map(category => (
                        <span key={category} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleAlert(alert.id, alert.active)}
                      className={`p-2 rounded-lg ${
                        alert.active
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={alert.active ? 'Pause Alert' : 'Activate Alert'}
                    >
                      {alert.active ? <Power className="h-5 w-5" /> : <PowerOff className="h-5 w-5" />}
                    </button>
                    
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Alert"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Created: {new Date(alert.createdAt).toLocaleDateString()}
                  {alert.lastSent && (
                    <span> • Last sent: {new Date(alert.lastSent).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}