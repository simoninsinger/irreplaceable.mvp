"use client"

import { useState } from "react"
import { 
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  Phone,
  Plus,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Edit,
  ExternalLink,
  AlertCircle,
  Award,
  Building,
  MapPin,
  DollarSign
} from "lucide-react"

// Mock application data
const applications = [
  {
    id: "1",
    jobTitle: "Physical Therapist",
    company: "HealthFirst Rehabilitation",
    location: "San Francisco, CA",
    salary: "$85,000 - $110,000",
    appliedDate: "2025-01-02",
    lastUpdate: "2025-01-15",
    status: "interview",
    aiResistance: "High",
    category: "Healthcare & Wellness",
    nextAction: "Prepare for final interview on Jan 20th",
    interviewDate: "2025-01-20",
    notes: "Great culture fit. Emphasized my patient care philosophy. Ask about continuing education opportunities.",
    contacts: [
      { name: "Sarah Johnson", role: "Hiring Manager", email: "sarah@healthfirst.com" }
    ],
    timeline: [
      { date: "2025-01-02", event: "Application submitted", type: "applied" },
      { date: "2025-01-08", event: "Phone screening completed", type: "phone" },
      { date: "2025-01-15", event: "First interview completed", type: "interview" },
      { date: "2025-01-20", event: "Final interview scheduled", type: "upcoming" }
    ]
  },
  {
    id: "2",
    jobTitle: "Art Therapist",
    company: "Mindful Healing Center",
    location: "Portland, OR",
    salary: "$60,000 - $75,000",
    appliedDate: "2024-12-20",
    lastUpdate: "2025-01-10",
    status: "offer",
    aiResistance: "High",
    category: "Creative Arts",
    nextAction: "Negotiate salary and benefits package",
    notes: "Received offer! They love my portfolio. Need to negotiate start date and salary.",
    contacts: [
      { name: "Dr. Michael Chen", role: "Clinical Director", email: "mchen@mindfulhealing.org" }
    ],
    timeline: [
      { date: "2024-12-20", event: "Application submitted", type: "applied" },
      { date: "2024-12-28", event: "Portfolio review", type: "review" },
      { date: "2025-01-05", event: "Interview completed", type: "interview" },
      { date: "2025-01-10", event: "Job offer received", type: "offer" }
    ]
  },
  {
    id: "3",
    jobTitle: "Master Electrician",
    company: "PowerPro Electric",
    location: "Austin, TX",
    salary: "$75,000 - $95,000",
    appliedDate: "2025-01-12",
    lastUpdate: "2025-01-14",
    status: "review",
    aiResistance: "High",
    category: "Skilled Trades",
    nextAction: "Follow up if no response by Jan 25th",
    notes: "Highlighted my commercial experience and apprentice training background.",
    contacts: [],
    timeline: [
      { date: "2025-01-12", event: "Application submitted", type: "applied" },
      { date: "2025-01-14", event: "Application acknowledged", type: "review" }
    ]
  },
  {
    id: "4",
    jobTitle: "Sales Manager - Medical Devices",
    company: "MedTech Solutions",
    location: "Chicago, IL",
    salary: "$90,000 - $120,000",
    appliedDate: "2024-12-15",
    lastUpdate: "2025-01-05",
    status: "rejected",
    aiResistance: "High",
    category: "Sales & Relations",
    nextAction: "Request feedback and apply lessons learned",
    notes: "Didn't advance past phone screen. Need to better emphasize consultative selling experience.",
    contacts: [
      { name: "Jennifer Smith", role: "Recruiter", email: "jsmith@medtechsolutions.com" }
    ],
    timeline: [
      { date: "2024-12-15", event: "Application submitted", type: "applied" },
      { date: "2024-12-22", event: "Phone screen completed", type: "phone" },
      { date: "2025-01-05", event: "Application rejected", type: "rejected" }
    ]
  },
  {
    id: "5",
    jobTitle: "Corporate Trainer",
    company: "TechSkills Academy",
    location: "Remote",
    salary: "$70,000 - $85,000",
    appliedDate: "2025-01-08",
    lastUpdate: "2025-01-08",
    status: "applied",
    aiResistance: "Medium",
    category: "Education & Training",
    nextAction: "Wait for initial response (applied 1 week ago)",
    notes: "Remote role focusing on soft skills training. Good fit for my background.",
    contacts: [],
    timeline: [
      { date: "2025-01-08", event: "Application submitted", type: "applied" }
    ]
  }
]

const statusConfig = {
  applied: { 
    label: "Applied", 
    icon: FileText, 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    bgColor: "bg-blue-50"
  },
  review: { 
    label: "Under Review", 
    icon: Eye, 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bgColor: "bg-yellow-50"
  },
  phone: { 
    label: "Phone Screen", 
    icon: Phone, 
    color: "bg-purple-100 text-purple-800 border-purple-200",
    bgColor: "bg-purple-50"
  },
  interview: { 
    label: "Interview", 
    icon: Users, 
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    bgColor: "bg-indigo-50"
  },
  final: { 
    label: "Final Round", 
    icon: Target, 
    color: "bg-orange-100 text-orange-800 border-orange-200",
    bgColor: "bg-orange-50"
  },
  offer: { 
    label: "Offer", 
    icon: Award, 
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "bg-green-50"
  },
  rejected: { 
    label: "Rejected", 
    icon: X, 
    color: "bg-red-100 text-red-800 border-red-200",
    bgColor: "bg-red-50"
  },
  waiting: { 
    label: "Waiting", 
    icon: Clock, 
    color: "bg-gray-100 text-gray-800 border-gray-200",
    bgColor: "bg-gray-50"
  }
}

export default function DashboardPage() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Calculate stats
  const totalApplications = applications.length
  const activeApplications = applications.filter(app => !['rejected', 'offer'].includes(app.status)).length
  const offers = applications.filter(app => app.status === 'offer').length
  const aiResistantApps = applications.filter(app => app.aiResistance === 'High').length
  const aiResistancePercentage = Math.round((aiResistantApps / totalApplications) * 100)

  const recentActivity = applications
    .flatMap(app => app.timeline.map(event => ({ ...event, application: app })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config?.icon || FileText
    return <Icon className="h-4 w-4" />
  }

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config?.color || 'bg-gray-100 text-gray-800'}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{config?.label || status}</span>
      </span>
    )
  }

  const selectedApp = applications.find(app => app.id === selectedApplication)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Career Dashboard</h1>
              <p className="text-gray-600">Track your AI-resistant career journey</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Application</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Total Applications</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalApplications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Active</p>
                    <p className="text-2xl font-semibold text-gray-900">{activeApplications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Offers</p>
                    <p className="text-2xl font-semibold text-gray-900">{offers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">AI-Resistant</p>
                    <p className="text-2xl font-semibold text-gray-900">{aiResistancePercentage}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Your Applications</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {applications.map(app => (
                  <div key={app.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedApplication(app.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{app.jobTitle}</h3>
                          {getStatusBadge(app.status)}
                          <span className={`px-2 py-1 text-xs font-medium border rounded-full ${
                            app.aiResistance === 'High' 
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                            <Shield className="inline h-3 w-3 mr-1" />
                            {app.aiResistance} AI-Resistance
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {app.company}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {app.location}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {app.salary}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                          <span>Updated: {new Date(app.lastUpdate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900 font-medium mb-1">Next Action:</div>
                        <div className="text-sm text-gray-600">{app.nextAction}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI-Resistance Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Resistance Focus</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>High Resistance</span>
                  <span className="font-medium">{aiResistantApps} jobs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${aiResistancePercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {aiResistancePercentage}% of your applications are in high AI-resistant roles. Great job future-proofing your career!
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.event}</p>
                      <p className="text-xs text-gray-500">{activity.application.jobTitle} at {activity.application.company}</p>
                      <p className="text-xs text-gray-400">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Browse Jobs</p>
                    <p className="text-xs text-gray-600">Find new AI-resistant opportunities</p>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                  <Target className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Take Assessment</p>
                    <p className="text-xs text-gray-600">Discover your ideal career path</p>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                  <Star className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Learn & Grow</p>
                    <p className="text-xs text-gray-600">Business education resources</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{selectedApp.jobTitle}</h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Company Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center"><Building className="h-4 w-4 mr-2" />{selectedApp.company}</p>
                    <p className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{selectedApp.location}</p>
                    <p className="flex items-center"><DollarSign className="h-4 w-4 mr-2" />{selectedApp.salary}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Application Status</h4>
                  <div className="space-y-2">
                    {getStatusBadge(selectedApp.status)}
                    <div className="text-sm text-gray-600">
                      <p>Applied: {new Date(selectedApp.appliedDate).toLocaleDateString()}</p>
                      <p>Last Update: {new Date(selectedApp.lastUpdate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Action */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Next Action</h4>
                    <p className="text-sm text-blue-800">{selectedApp.nextAction}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{selectedApp.notes}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Timeline</h4>
                <div className="space-y-3">
                  {selectedApp.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.event}</p>
                        <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contacts */}
              {selectedApp.contacts && selectedApp.contacts.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contacts</h4>
                  <div className="space-y-2">
                    {selectedApp.contacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                          <p className="text-xs text-gray-600">{contact.role}</p>
                        </div>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          {contact.email}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Update Status</span>
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Add Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Application</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Physical Therapist"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., HealthFirst Rehabilitation"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., $80,000 - $100,000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Healthcare & Wellness</option>
                    <option>Skilled Trades</option>
                    <option>Creative Arts</option>
                    <option>Human Services</option>
                    <option>Education & Training</option>
                    <option>Sales & Relations</option>
                    <option>Leadership & Management</option>
                    <option>Entrepreneurship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AI Resistance</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any notes about this application..."
                ></textarea>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Application
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}