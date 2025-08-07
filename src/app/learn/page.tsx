"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  BookOpen, 
  Play, 
  FileText, 
  ExternalLink,
  Clock,
  Users,
  Award,
  ChevronRight,
  Search,
  Filter,
  Star
} from "lucide-react"

// Mock learning content data
const categories = [
  {
    id: "healthcare",
    name: "Healthcare & Wellness",
    description: "Learn to start and grow healthcare practices",
    icon: "🏥",
    color: "bg-red-500",
    courseCount: 24,
    content: [
      {
        title: "Starting Your Physical Therapy Practice",
        type: "guide",
        duration: "45 min read",
        difficulty: "intermediate",
        rating: 4.8,
        description: "Complete guide to launching a successful PT practice, from licensing to marketing.",
        content: "Learn the essential steps to establish your own physical therapy practice...",
        topics: ["Business licensing", "Insurance billing", "Patient marketing", "Equipment needs"]
      },
      {
        title: "Mental Health Counseling Business Fundamentals",
        type: "video",
        duration: "2.5 hours",
        difficulty: "beginner", 
        rating: 4.9,
        description: "Video series on building a sustainable counseling practice.",
        content: "Discover how to create a thriving mental health practice...",
        topics: ["HIPAA compliance", "Client acquisition", "Pricing strategies", "Office setup"]
      },
      {
        title: "Healthcare Marketing That Works",
        type: "article",
        duration: "20 min read",
        difficulty: "beginner",
        rating: 4.6,
        description: "Ethical marketing strategies for healthcare professionals.",
        content: "Build trust and attract patients through proven marketing methods...",
        topics: ["Patient referrals", "Online presence", "Community outreach", "Reputation management"]
      }
    ]
  },
  {
    id: "trades",
    name: "Skilled Trades",
    description: "Master the business side of trade work",
    icon: "🔧",
    color: "bg-orange-500",
    courseCount: 18,
    content: [
      {
        title: "Electrical Contractor Business Basics",
        type: "guide",
        duration: "1 hour read",
        difficulty: "intermediate",
        rating: 4.7,
        description: "Everything you need to know about running an electrical contracting business.",
        content: "Transform your electrical skills into a profitable business...",
        topics: ["Contractor licensing", "Job estimating", "Crew management", "Safety compliance"]
      },
      {
        title: "Plumbing Business Pricing Guide",
        type: "resource",
        duration: "30 min read",
        difficulty: "beginner",
        rating: 4.5,
        description: "Set profitable rates and win more jobs with strategic pricing.",
        content: "Price your plumbing services competitively while maintaining margins...",
        topics: ["Service call pricing", "Material markup", "Emergency rates", "Warranty policies"]
      },
      {
        title: "Building a Trades Business Brand",
        type: "video",
        duration: "1.5 hours",
        difficulty: "intermediate",
        rating: 4.8,
        description: "Create a strong brand that attracts quality customers.",
        content: "Stand out in the trades industry with professional branding...",
        topics: ["Logo design", "Vehicle wraps", "Uniforms", "Online reviews"]
      }
    ]
  },
  {
    id: "creative",
    name: "Creative Arts",
    description: "Turn creativity into sustainable income",
    icon: "🎨",
    color: "bg-purple-500",
    courseCount: 31,
    content: [
      {
        title: "Freelance Artist's Client Management Guide",
        type: "guide",
        duration: "40 min read",
        difficulty: "intermediate",
        rating: 4.9,
        description: "Build lasting relationships with clients and grow your creative business.",
        content: "Master the art of client relationships and project management...",
        topics: ["Client contracts", "Project scoping", "Revision policies", "Payment terms"]
      },
      {
        title: "Art Therapy Practice Setup",
        type: "article",
        duration: "25 min read",
        difficulty: "advanced",
        rating: 4.7,
        description: "Combine your artistic skills with therapeutic practice.",
        content: "Launch a meaningful art therapy practice that heals and inspires...",
        topics: ["Certification requirements", "Therapy space design", "Insurance billing", "Client screening"]
      },
      {
        title: "Photography Business Essentials",
        type: "video",
        duration: "3 hours",
        difficulty: "beginner",
        rating: 4.6,
        description: "From hobbyist to professional photographer in 90 days.",
        content: "Build a profitable photography business with proven strategies...",
        topics: ["Portfolio building", "Pricing packages", "Client acquisition", "Equipment investment"]
      }
    ]
  },
  {
    id: "education",
    name: "Education & Training",
    description: "Share knowledge and build teaching businesses",
    icon: "📚",
    color: "bg-blue-500",
    courseCount: 16,
    content: [
      {
        title: "Corporate Training Business Startup",
        type: "guide",
        duration: "55 min read",
        difficulty: "intermediate",
        rating: 4.8,
        description: "Launch a successful corporate training consultancy.",
        content: "Create and deliver training programs that companies need...",
        topics: ["Training needs assessment", "Curriculum development", "Sales process", "Delivery methods"]
      },
      {
        title: "Online Course Creation Blueprint",
        type: "video",
        duration: "2 hours",
        difficulty: "beginner",
        rating: 4.7,
        description: "Turn your expertise into profitable online courses.",
        content: "Design, create, and market online courses that sell...",
        topics: ["Course planning", "Video production", "Platform selection", "Marketing strategies"]
      }
    ]
  }
]

const contentTypes = [
  { value: "all", label: "All Content" },
  { value: "guide", label: "Guides", icon: <BookOpen className="h-4 w-4" /> },
  { value: "video", label: "Videos", icon: <Play className="h-4 w-4" /> },
  { value: "article", label: "Articles", icon: <FileText className="h-4 w-4" /> },
  { value: "resource", label: "Resources", icon: <ExternalLink className="h-4 w-4" /> }
]

const difficulties = ["all", "beginner", "intermediate", "advanced"]

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)

  const filteredContent = selectedCategoryData?.content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesDifficulty = selectedDifficulty === "all" || item.difficulty === selectedDifficulty
    
    return matchesSearch && matchesType && matchesDifficulty
  }) || []

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "guide": return <BookOpen className="h-5 w-5" />
      case "video": return <Play className="h-5 w-5" />
      case "article": return <FileText className="h-5 w-5" />
      case "resource": return <ExternalLink className="h-5 w-5" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Learn to Build Your AI-Resistant Business
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Master the business fundamentals for AI-resistant careers. From licensing and pricing to marketing and growth strategies.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {categories.map(category => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {category.courseCount} resources
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Guides
                    </span>
                    <span className="flex items-center">
                      <Play className="h-4 w-4 mr-1" />
                      Videos
                    </span>
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Articles
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Featured Content Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Featured items from different categories */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-600">Healthcare Guide</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Starting Your Physical Therapy Practice</h3>
                <p className="text-sm text-gray-600 mb-3">Complete guide to launching a successful PT practice.</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>45 min read</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">4.8</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Play className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-600">Trades Video</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Building a Trades Business Brand</h3>
                <p className="text-sm text-gray-600 mb-3">Create a strong brand that attracts quality customers.</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>1.5 hours</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">4.8</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-600">Creative Guide</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Freelance Artist's Client Management</h3>
                <p className="text-sm text-gray-600 mb-3">Build lasting relationships with clients and grow your business.</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>40 min read</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Category detail view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              <span>Back to all categories</span>
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="text-4xl">{selectedCategoryData?.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedCategoryData?.name}</h1>
              <p className="text-lg text-gray-600">{selectedCategoryData?.description}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {contentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold">{filteredContent.length}</span> resources
          </p>
        </div>

        <div className="space-y-6">
          {filteredContent.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {item.duration}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{item.description}</p>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">You'll learn:</h4>
                <div className="flex flex-wrap gap-2">
                  {item.topics.map((topic, topicIndex) => (
                    <span key={topicIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center space-x-2">
                  <span>Start Learning</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                  Save for Later
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}