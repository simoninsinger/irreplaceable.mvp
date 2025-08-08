"use client"

import { useState } from "react"
import { 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  Circle,
  DollarSign,
  BookOpen,
  Award,
  Users,
  Target,
  Calendar,
  TrendingUp,
  AlertCircle,
  Star,
  MapPin
} from "lucide-react"

interface TransitionPhase {
  id: string
  title: string
  duration: string
  description: string
  tasks: string[]
  cost?: number
  milestone: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

interface CareerTransition {
  id: string
  fromCareer: string
  toCareer: string
  totalDuration: string
  totalCost: number
  averageSalaryIncrease: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  phases: TransitionPhase[]
  requirements: string[]
  tips: string[]
  aiResistanceScore: number
}

const careerTransitions: CareerTransition[] = [
  {
    id: 'office_to_nurse',
    fromCareer: 'Office/Administrative Work',
    toCareer: 'Registered Nurse',
    totalDuration: '24-36 months',
    totalCost: 35000,
    averageSalaryIncrease: 25000,
    difficulty: 'Hard',
    aiResistanceScore: 9,
    phases: [
      {
        id: 'prerequisites',
        title: 'Prerequisites & Planning',
        duration: '3-6 months',
        description: 'Complete required science courses and prepare for nursing school',
        tasks: [
          'Complete Anatomy & Physiology I & II',
          'Complete Microbiology and Chemistry',
          'Maintain 3.0+ GPA in sciences',
          'Take TEAS or HESI entrance exam',
          'Research nursing programs',
          'Complete volunteer hours in healthcare'
        ],
        cost: 3000,
        milestone: 'Nursing school acceptance',
        difficulty: 'Medium'
      },
      {
        id: 'education',
        title: 'Nursing Education',
        duration: '18-24 months',
        description: 'Complete Associate or Bachelor degree in nursing',
        tasks: [
          'Complete nursing coursework',
          'Pass clinical rotations',
          'Maintain good academic standing',
          'Complete capstone/senior project',
          'Apply for graduation'
        ],
        cost: 30000,
        milestone: 'Nursing degree completion',
        difficulty: 'Hard'
      },
      {
        id: 'licensing',
        title: 'Licensure & First Job',
        duration: '3-6 months',
        description: 'Obtain RN license and secure first nursing position',
        tasks: [
          'Pass NCLEX-RN examination',
          'Apply for state nursing license',
          'Create nursing resume',
          'Apply for entry-level RN positions',
          'Complete new graduate orientation',
          'Begin practicing as RN'
        ],
        cost: 2000,
        milestone: 'Licensed RN with job',
        difficulty: 'Medium'
      }
    ],
    requirements: [
      'High school diploma or equivalent',
      'Basic math and science aptitude',
      'Physical and emotional stamina',
      'Strong communication skills',
      'Clean criminal background'
    ],
    tips: [
      'Start with prerequisite courses part-time while working',
      'Shadow nurses to understand the role better',
      'Consider accelerated BSN programs if you have a degree',
      'Network with nurses and healthcare professionals',
      'Research loan forgiveness programs for nurses'
    ]
  },
  {
    id: 'retail_to_electrician',
    fromCareer: 'Retail/Customer Service',
    toCareer: 'Electrician',
    totalDuration: '12-24 months',
    totalCost: 15000,
    averageSalaryIncrease: 20000,
    difficulty: 'Medium',
    aiResistanceScore: 9,
    phases: [
      {
        id: 'education',
        title: 'Electrical Training Program',
        duration: '6-12 months',
        description: 'Complete electrical technology program at trade school',
        tasks: [
          'Enroll in electrical technology program',
          'Learn electrical theory and codes',
          'Practice wiring and circuit installation',
          'Study National Electrical Code (NEC)',
          'Complete hands-on lab work',
          'Pass program certification'
        ],
        cost: 12000,
        milestone: 'Certificate in Electrical Technology',
        difficulty: 'Medium'
      },
      {
        id: 'apprenticeship',
        title: 'Apprenticeship Application',
        duration: '2-6 months',
        description: 'Apply for and secure electrical apprenticeship',
        tasks: [
          'Research apprenticeship programs',
          'Complete apprenticeship applications',
          'Take aptitude and interview tests',
          'Network with electrical contractors',
          'Accept apprenticeship offer',
          'Begin apprentice work'
        ],
        cost: 1000,
        milestone: 'Apprenticeship position secured',
        difficulty: 'Medium'
      },
      {
        id: 'experience',
        title: 'Gain Experience & License',
        duration: '4-8 months initial',
        description: 'Work as apprentice and prepare for licensing',
        tasks: [
          'Complete on-the-job training hours',
          'Continue electrical education',
          'Learn from journeyman electricians',
          'Study for electrical license exam',
          'Meet licensing hour requirements',
          'Take state licensing examination'
        ],
        cost: 2000,
        milestone: 'Electrical license obtained',
        difficulty: 'Medium'
      }
    ],
    requirements: [
      'Physical fitness and manual dexterity',
      'Basic math and problem-solving skills',
      'Ability to work in various conditions',
      'Good color vision',
      'High school diploma or equivalent'
    ],
    tips: [
      'Many apprenticeships are paid positions',
      'Consider union vs. non-union apprenticeships',
      'Start learning electrical basics online',
      'Network at electrical supply stores',
      'Maintain a clean driving record'
    ]
  },
  {
    id: 'corporate_to_teacher',
    fromCareer: 'Corporate/Business',
    toCareer: 'Elementary Teacher',
    totalDuration: '15-24 months',
    totalCost: 25000,
    averageSalaryIncrease: -5000,
    difficulty: 'Medium',
    aiResistanceScore: 8,
    phases: [
      {
        id: 'certification',
        title: 'Teaching Certification Program',
        duration: '12-18 months',
        description: 'Complete alternative certification or Master in Teaching',
        tasks: [
          'Enroll in teaching certification program',
          'Complete education coursework',
          'Learn classroom management techniques',
          'Study child development and psychology',
          'Complete student teaching placement',
          'Pass state teaching exams (Praxis)'
        ],
        cost: 20000,
        milestone: 'Teaching certification earned',
        difficulty: 'Medium'
      },
      {
        id: 'job_search',
        title: 'Job Search & First Year',
        duration: '3-6 months',
        description: 'Secure teaching position and complete first year',
        tasks: [
          'Create teaching portfolio',
          'Apply for teaching positions',
          'Interview with school districts',
          'Complete background checks',
          'Accept teaching position',
          'Complete first year successfully'
        ],
        cost: 5000,
        milestone: 'Successful first year teaching',
        difficulty: 'Medium'
      }
    ],
    requirements: [
      "Bachelor's degree in any subject",
      'Passion for working with children',
      'Strong communication skills',
      'Patience and creativity',
      'Clean background check'
    ],
    tips: [
      'Consider substitute teaching while in program',
      'Volunteer in classrooms to gain experience',
      'Network with current teachers and principals',
      'Research high-need subject areas',
      'Look into loan forgiveness programs for teachers'
    ]
  },
  {
    id: 'service_to_plumber',
    fromCareer: 'Food Service/Hospitality',
    toCareer: 'Plumber',
    totalDuration: '12-18 months',
    totalCost: 18000,
    averageSalaryIncrease: 15000,
    difficulty: 'Medium',
    aiResistanceScore: 9,
    phases: [
      {
        id: 'training',
        title: 'Plumbing Trade School',
        duration: '6-12 months',
        description: 'Complete plumbing technology program',
        tasks: [
          'Enroll in plumbing trade program',
          'Learn pipe systems and installation',
          'Study plumbing codes and regulations',
          'Practice with tools and equipment',
          'Complete hands-on projects',
          'Pass trade school certification'
        ],
        cost: 15000,
        milestone: 'Plumbing technology certificate',
        difficulty: 'Medium'
      },
      {
        id: 'apprenticeship_start',
        title: 'Enter Apprenticeship',
        duration: '2-4 months',
        description: 'Find and begin plumbing apprenticeship',
        tasks: [
          'Apply to plumbing contractors',
          'Interview for apprentice positions',
          'Complete safety training',
          'Begin working with journeyman plumbers',
          'Learn on-the-job skills',
          'Start accumulating required hours'
        ],
        cost: 2000,
        milestone: 'Apprenticeship started',
        difficulty: 'Easy'
      },
      {
        id: 'licensing_prep',
        title: 'License Preparation',
        duration: '4-6 months',
        description: 'Prepare for plumbing license examination',
        tasks: [
          'Continue apprenticeship training',
          'Study for licensing exam',
          'Meet required training hours',
          'Complete specialized certifications',
          'Take state plumbing exam',
          'Obtain plumbing license'
        ],
        cost: 1000,
        milestone: 'Licensed plumber',
        difficulty: 'Medium'
      }
    ],
    requirements: [
      'Physical strength and stamina',
      'Problem-solving abilities',
      'Manual dexterity',
      'Ability to work in tight spaces',
      'Basic math skills'
    ],
    tips: [
      'Many apprenticeships offer immediate income',
      'Emergency plumbing pays very well',
      'Consider specializing in green plumbing',
      'Build relationships with contractors early',
      'Learn business skills for self-employment'
    ]
  }
]

export default function CareerTransitionPage() {
  const [selectedTransition, setSelectedTransition] = useState<CareerTransition>(careerTransitions[0])
  const [currentPhase, setCurrentPhase] = useState(0)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cost)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 mr-3 text-blue-600" />
              Career Transition Timelines
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Plan your transition to an AI-resistant career with detailed timelines, costs, and actionable steps.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Career Transition Selection */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Transition</h2>
            
            <div className="space-y-4">
              {careerTransitions.map((transition, index) => (
                <div
                  key={transition.id}
                  onClick={() => {
                    setSelectedTransition(transition)
                    setCurrentPhase(0)
                  }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedTransition.id === transition.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {transition.fromCareer}
                      </h3>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        <ArrowRight className="h-3 w-3 mx-1" />
                        <span>{transition.toCareer}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transition.aiResistanceScore >= 9 ? 'bg-green-100 text-green-800' :
                      transition.aiResistanceScore >= 7 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      AI-Resistance: {transition.aiResistanceScore}/10
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {transition.totalDuration}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {formatCost(transition.totalCost)}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(transition.difficulty)}`}>
                      {transition.difficulty} Transition
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Transition Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {/* Header */}
              <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTransition.fromCareer} → {selectedTransition.toCareer}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedTransition.difficulty)}`}>
                    {selectedTransition.difficulty}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Timeline</div>
                      <div className="text-gray-600">{selectedTransition.totalDuration}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Total Cost</div>
                      <div className="text-gray-600">{formatCost(selectedTransition.totalCost)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Salary Impact</div>
                      <div className={`${selectedTransition.averageSalaryIncrease >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedTransition.averageSalaryIncrease >= 0 ? '+' : ''}{formatCost(selectedTransition.averageSalaryIncrease)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase Timeline */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Transition Phases</h3>
                
                <div className="space-y-6">
                  {selectedTransition.phases.map((phase, phaseIndex) => (
                    <div key={phase.id} className="relative">
                      {/* Timeline connector */}
                      {phaseIndex < selectedTransition.phases.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-20 bg-gray-300"></div>
                      )}
                      
                      <div className={`flex items-start space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        currentPhase === phaseIndex
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`} onClick={() => setCurrentPhase(phaseIndex)}>
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          currentPhase === phaseIndex ? 'bg-blue-600 text-white' :
                          currentPhase > phaseIndex ? 'bg-green-600 text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {currentPhase > phaseIndex ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <span className="font-bold">{phaseIndex + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{phase.title}</h4>
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {phase.duration}
                              </span>
                              {phase.cost && (
                                <span className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  {formatCost(phase.cost)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{phase.description}</p>
                          
                          {currentPhase === phaseIndex && (
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Key Tasks:</h5>
                                <ul className="space-y-1">
                                  {phase.tasks.map((task, taskIndex) => (
                                    <li key={taskIndex} className="flex items-center text-sm text-gray-700">
                                      <Circle className="h-3 w-3 mr-2 text-blue-600" />
                                      {task}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center">
                                  <Target className="h-4 w-4 text-green-600 mr-2" />
                                  <span className="font-medium text-green-800">Milestone: </span>
                                  <span className="text-green-700">{phase.milestone}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements and Tips */}
              <div className="p-6 border-t bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                      Requirements
                    </h4>
                    <ul className="space-y-1">
                      {selectedTransition.requirements.map((req, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="h-3 w-3 mr-2 text-orange-600 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-600" />
                      Pro Tips
                    </h4>
                    <ul className="space-y-1">
                      {selectedTransition.tips.map((tip, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700">
                          <Star className="h-3 w-3 mr-2 text-yellow-600 flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why These Transitions Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Human Connection</h3>
              <p className="text-gray-600">These careers require empathy, intuition, and human interaction that AI cannot replicate.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Skill-Based Work</h3>
              <p className="text-gray-600">Physical skills, craftsmanship, and hands-on expertise that require years of practice to master.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Growing Demand</h3>
              <p className="text-gray-600">Increasing demand for these roles as population ages and infrastructure needs grow.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}