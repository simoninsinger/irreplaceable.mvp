"use client"

import { useState } from "react"
import { 
  Camera,
  Save,
  Edit,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Target,
  Award,
  BookOpen,
  TrendingUp,
  Shield,
  Users,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap
} from "lucide-react"

// Mock user data - in real app would come from database/auth
const mockUserData = {
  id: "user1",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  location: "Denver, CO",
  birthYear: 1995,
  profileImage: null,
  bio: "Healthcare professional transitioning to AI-resistant physical therapy career. Passionate about helping people heal and maintaining human-centered care.",
  currentRole: "Medical Assistant",
  targetRole: "Physical Therapist",
  experienceLevel: "mid_level",
  careerGoals: ["Complete DPT program", "Open private practice", "Specialize in sports therapy"],
  skills: ["Patient care", "Medical knowledge", "Communication", "Empathy", "Problem-solving"],
  interests: ["Healthcare", "Sports medicine", "Wellness", "Entrepreneurship"],
  education: [
    {
      degree: "Bachelor of Science in Biology",
      school: "University of Colorado Boulder",
      year: "2017"
    }
  ],
  certifications: [
    {
      name: "Certified Medical Assistant",
      issuer: "AAMA",
      year: "2018"
    }
  ],
  assessmentResults: {
    topCategory: "Healthcare & Wellness",
    score: 92,
    completedDate: "2025-01-15"
  },
  applicationStats: {
    totalApplications: 5,
    activeApplications: 3,
    offers: 1,
    aiResistantPercentage: 80
  },
  subscribeNewsletter: true,
  profileCompleteness: 75
}

const experienceLevels = [
  { value: "entry_level", label: "Entry Level (0-2 years)" },
  { value: "mid_level", label: "Mid Level (2-5 years)" },
  { value: "senior_level", label: "Senior Level (5+ years)" },
  { value: "executive", label: "Executive/Leadership" }
]

const careerCategories = [
  "Healthcare & Wellness",
  "Skilled Trades", 
  "Creative Arts",
  "Human Services",
  "Education & Training",
  "Sales & Relations",
  "Leadership & Management",
  "Entrepreneurship"
]

export default function ProfilePage() {
  const [userData, setUserData] = useState(mockUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [newSkill, setNewSkill] = useState("")
  const [newGoal, setNewGoal] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    setEditingSection(null)
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setUserData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setUserData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setUserData(prev => ({
        ...prev,
        careerGoals: [...prev.careerGoals, newGoal.trim()]
      }))
      setNewGoal("")
    }
  }

  const handleRemoveGoal = (goalToRemove: string) => {
    setUserData(prev => ({
      ...prev,
      careerGoals: prev.careerGoals.filter(goal => goal !== goalToRemove)
    }))
  }

  const getProfileCompletenessItems = () => {
    const items = [
      { name: "Basic Info", completed: userData.firstName && userData.lastName && userData.email },
      { name: "Bio", completed: userData.bio && userData.bio.length > 50 },
      { name: "Career Goals", completed: userData.careerGoals.length >= 2 },
      { name: "Skills", completed: userData.skills.length >= 3 },
      { name: "Assessment", completed: userData.assessmentResults.completedDate },
      { name: "Profile Photo", completed: userData.profileImage },
    ]
    
    const completed = items.filter(item => item.completed).length
    const percentage = Math.round((completed / items.length) * 100)
    
    return { items, percentage, completed, total: items.length }
  }

  const profileCompleteness = getProfileCompletenessItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
              <p className="text-gray-600">Manage your AI-resistant career profile</p>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      {userData.profileImage ? (
                        <img
                          src={userData.profileImage}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          {userData.firstName[0]}{userData.lastName[0]}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {userData.firstName} {userData.lastName}
                    </h2>
                    <p className="text-gray-600">{userData.currentRole} → {userData.targetRole}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {userData.location}
                      </span>
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {userData.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{userData.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{userData.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.location}
                      onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City, State"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{userData.location}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{userData.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={userData.bio}
                  onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about your career journey, goals, and what drives you..."
                />
              ) : (
                <p className="text-gray-700">{userData.bio}</p>
              )}
            </div>

            {/* Career Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Role</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.currentRole}
                      onChange={(e) => setUserData(prev => ({ ...prev, currentRole: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      {userData.currentRole}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.targetRole}
                      onChange={(e) => setUserData(prev => ({ ...prev, targetRole: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg flex items-center">
                      <Target className="h-4 w-4 mr-2 text-blue-600" />
                      {userData.targetRole}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  {isEditing ? (
                    <select
                      value={userData.experienceLevel}
                      onChange={(e) => setUserData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {experienceLevels.find(level => level.value === userData.experienceLevel)?.label}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <button
                      onClick={handleAddSkill}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Career Goals */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Career Goals</h3>
                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Add a goal"
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                    />
                    <button
                      onClick={handleAddGoal}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {userData.careerGoals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="flex-1">{goal}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveGoal(goal)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completeness */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completeness</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span className="font-medium">{profileCompleteness.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${profileCompleteness.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {profileCompleteness.completed} of {profileCompleteness.total} sections complete
                </p>
              </div>
              <div className="space-y-2">
                {profileCompleteness.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {item.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Results */}
            {userData.assessmentResults.completedDate && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Results</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {userData.assessmentResults.score}%
                  </div>
                  <p className="text-sm text-gray-600">match for</p>
                  <p className="font-semibold text-gray-900">{userData.assessmentResults.topCategory}</p>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Completed: {new Date(userData.assessmentResults.completedDate).toLocaleDateString()}
                </div>
                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Full Results
                </button>
              </div>
            )}

            {/* Application Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Applications</span>
                  <span className="font-semibold">{userData.applicationStats.totalApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Applications</span>
                  <span className="font-semibold text-yellow-600">{userData.applicationStats.activeApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Offers Received</span>
                  <span className="font-semibold text-green-600">{userData.applicationStats.offers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    AI-Resistant Focus
                  </span>
                  <span className="font-semibold text-purple-600">{userData.applicationStats.aiResistantPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">View Dashboard</p>
                    <p className="text-xs text-gray-600">Check application progress</p>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                  <Target className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Retake Assessment</p>
                    <p className="text-xs text-gray-600">Update your career match</p>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Browse Learning</p>
                    <p className="text-xs text-gray-600">Skill up for your goals</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}