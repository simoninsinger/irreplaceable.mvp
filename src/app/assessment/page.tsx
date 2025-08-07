"use client"

import { useState } from "react"
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  Users,
  Lightbulb,
  Heart,
  Award,
  ChevronRight,
  Target,
  Brain,
  Zap,
  TrendingUp,
  Shield,
  Globe,
  DollarSign,
  BookOpen,
  Star
} from "lucide-react"

interface Question {
  id: number
  question: string
  description: string
  category: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  options: {
    text: string
    icon: React.ReactNode
    weights: Record<string, number>
    description?: string
  }[]
}

interface AssessmentTier {
  name: string
  description: string
  duration: string
  questions: number
  icon: React.ReactNode
  features: string[]
}

// Quick Assessment - 5 questions
const quickQuestions: Question[] = [
  {
    id: 1,
    question: "What type of work environment energizes you most?",
    description: "Think about where you feel most productive and engaged.",
    category: "Environment",
    difficulty: "basic",
    options: [
      {
        text: "Working directly with people, helping solve their problems",
        icon: <Users className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Human Services": 3, "Education": 2, "Sales": 2 }
      },
      {
        text: "Working with my hands to build or fix things",
        icon: <div className="h-6 w-6 bg-orange-500 rounded"></div>,
        weights: { "Skilled Trades": 3, "Healthcare": 1 }
      },
      {
        text: "Creating and expressing through art, design, or media",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Entrepreneurship": 1 }
      },
      {
        text: "Leading teams and driving business results",
        icon: <Award className="h-6 w-6" />,
        weights: { "Leadership": 3, "Sales": 2, "Entrepreneurship": 2 }
      }
    ]
  },
  {
    id: 2,
    question: "How do you prefer to solve problems?",
    description: "Consider your natural approach when facing challenges.",
    category: "Problem Solving",
    difficulty: "basic",
    options: [
      {
        text: "Through creative thinking and innovative solutions",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 2, "Entrepreneurship": 2, "Leadership": 1 }
      },
      {
        text: "By understanding people's needs and emotions",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Human Services": 3, "Education": 2 }
      },
      {
        text: "Using practical, hands-on approaches",
        icon: <div className="h-6 w-6 bg-blue-500 rounded"></div>,
        weights: { "Skilled Trades": 3, "Healthcare": 1 }
      },
      {
        text: "Through analysis, planning, and strategic thinking",
        icon: <Award className="h-6 w-6" />,
        weights: { "Leadership": 2, "Sales": 2, "Entrepreneurship": 2 }
      }
    ]
  },
  {
    id: 3,
    question: "What motivates you most in your work?",
    description: "Think about what gives you the greatest sense of satisfaction.",
    category: "Motivation",
    difficulty: "basic",
    options: [
      {
        text: "Making a direct positive impact on people's lives",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Human Services": 3, "Education": 2 }
      },
      {
        text: "Creating something tangible and lasting",
        icon: <div className="h-6 w-6 bg-green-500 rounded"></div>,
        weights: { "Skilled Trades": 2, "Creative Arts": 2, "Entrepreneurship": 1 }
      },
      {
        text: "Expressing creativity and artistic vision",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Education": 1 }
      },
      {
        text: "Building successful relationships and achieving goals",
        icon: <Users className="h-6 w-6" />,
        weights: { "Sales": 3, "Leadership": 2, "Entrepreneurship": 2 }
      }
    ]
  },
  {
    id: 4,
    question: "How do you prefer to learn new skills?",
    description: "Consider your most effective learning style.",
    category: "Learning Style",
    difficulty: "basic",
    options: [
      {
        text: "Through hands-on practice and experimentation",
        icon: <div className="h-6 w-6 bg-purple-500 rounded"></div>,
        weights: { "Skilled Trades": 3, "Creative Arts": 2, "Healthcare": 1 }
      },
      {
        text: "By working with mentors and experienced professionals",
        icon: <Users className="h-6 w-6" />,
        weights: { "Healthcare": 2, "Skilled Trades": 2, "Sales": 2 }
      },
      {
        text: "Through creative exploration and self-expression",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Entrepreneurship": 1 }
      },
      {
        text: "By studying best practices and proven methods", 
        icon: <Award className="h-6 w-6" />,
        weights: { "Leadership": 2, "Sales": 2, "Education": 2 }
      }
    ]
  },
  {
    id: 5,
    question: "What type of impact do you want to have?",
    description: "Think about the legacy you want to leave through your work.",
    category: "Impact",
    difficulty: "basic",
    options: [
      {
        text: "Help people heal, grow, and overcome challenges",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Human Services": 3, "Education": 2 }
      },
      {
        text: "Build infrastructure that improves daily life",
        icon: <div className="h-6 w-6 bg-yellow-500 rounded"></div>,
        weights: { "Skilled Trades": 3, "Entrepreneurship": 1 }
      },
      {
        text: "Create art and culture that inspires others",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Education": 1 }
      },
      {
        text: "Drive economic growth and business success",
        icon: <Award className="h-6 w-6" />,
        weights: { "Leadership": 3, "Sales": 2, "Entrepreneurship": 3 }
      }
    ]
  }
]

// Comprehensive Assessment - 15 questions (includes quick + 10 more)
const comprehensiveQuestions: Question[] = [
  ...quickQuestions,
  {
    id: 6,
    question: "How important is work-life balance to you?",
    description: "Consider how you want to structure your personal and professional time.",
    category: "Values",
    difficulty: "intermediate",
    options: [
      {
        text: "Extremely important - I need clear boundaries",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Healthcare": 2, "Education": 2, "Human Services": 2 },
        description: "Prefer structured schedules and predictable hours"
      },
      {
        text: "Somewhat important - willing to work extra when needed",
        icon: <Clock className="h-6 w-6" />,
        weights: { "Sales": 2, "Skilled Trades": 2, "Leadership": 1 }
      },
      {
        text: "Flexible - I'm driven by passion and results",
        icon: <Target className="h-6 w-6" />,
        weights: { "Entrepreneurship": 3, "Creative Arts": 2, "Leadership": 2 }
      },
      {
        text: "Balance varies - depends on projects and seasons",
        icon: <TrendingUp className="h-6 w-6" />,
        weights: { "Creative Arts": 1, "Sales": 1, "Leadership": 1 }
      }
    ]
  },
  {
    id: 7,
    question: "What's your risk tolerance when it comes to career decisions?",
    description: "Think about how comfortable you are with uncertainty and change.",
    category: "Risk Tolerance",
    difficulty: "intermediate",
    options: [
      {
        text: "Low risk - I prefer stable, predictable careers",
        icon: <Shield className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Education": 2, "Skilled Trades": 2 }
      },
      {
        text: "Moderate risk - some uncertainty is acceptable",
        icon: <TrendingUp className="h-6 w-6" />,
        weights: { "Sales": 2, "Creative Arts": 2, "Leadership": 2 }
      },
      {
        text: "High risk - I thrive on uncertainty and new challenges",
        icon: <Zap className="h-6 w-6" />,
        weights: { "Entrepreneurship": 3, "Creative Arts": 2, "Sales": 1 }
      },
      {
        text: "Calculated risk - I research thoroughly before deciding",
        icon: <Brain className="h-6 w-6" />,
        weights: { "Leadership": 2, "Entrepreneurship": 2, "Sales": 1 }
      }
    ]
  },
  {
    id: 8,
    question: "How do you prefer to work with others?",
    description: "Consider your ideal team dynamic and collaboration style.",
    category: "Teamwork",
    difficulty: "intermediate",
    options: [
      {
        text: "One-on-one interactions with deep personal connections",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Human Services": 3, "Education": 2 }
      },
      {
        text: "Small teams working closely on shared projects",
        icon: <Users className="h-6 w-6" />,
        weights: { "Creative Arts": 2, "Skilled Trades": 2, "Leadership": 2 }
      },
      {
        text: "Leading and directing larger groups",
        icon: <Target className="h-6 w-6" />,
        weights: { "Leadership": 3, "Sales": 2, "Entrepreneurship": 2 }
      },
      {
        text: "Working independently with periodic collaboration",
        icon: <Brain className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Entrepreneurship": 2, "Skilled Trades": 1 }
      }
    ]
  },
  {
    id: 9,
    question: "What role does salary play in your career decisions?",
    description: "Be honest about your financial priorities and lifestyle needs.",
    category: "Financial Priorities",
    difficulty: "intermediate",
    options: [
      {
        text: "High salary is my top priority",
        icon: <DollarSign className="h-6 w-6" />,
        weights: { "Sales": 3, "Leadership": 2, "Entrepreneurship": 2 }
      },
      {
        text: "Good salary is important, but not everything",
        icon: <TrendingUp className="h-6 w-6" />,
        weights: { "Healthcare": 2, "Skilled Trades": 2, "Sales": 1 }
      },
      {
        text: "Fulfillment matters more than money",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Human Services": 3, "Education": 3, "Creative Arts": 2 }
      },
      {
        text: "I want both high pay and meaningful work",
        icon: <Star className="h-6 w-6" />,
        weights: { "Healthcare": 2, "Leadership": 2, "Entrepreneurship": 1 }
      }
    ]
  },
  {
    id: 10,
    question: "How comfortable are you with technology integration in your work?",
    description: "Consider your relationship with technology and automation.",
    category: "Technology Comfort",
    difficulty: "intermediate",
    options: [
      {
        text: "I prefer minimal technology - hands-on, human-centered work",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Skilled Trades": 3, "Human Services": 2, "Creative Arts": 1 }
      },
      {
        text: "Technology as a tool is fine, but humans should lead",
        icon: <Users className="h-6 w-6" />,
        weights: { "Healthcare": 2, "Education": 2, "Sales": 2 }
      },
      {
        text: "I embrace technology to enhance human capabilities",
        icon: <Zap className="h-6 w-6" />,
        weights: { "Leadership": 2, "Entrepreneurship": 2, "Creative Arts": 1 }
      },
      {
        text: "I want to be at the forefront of technology integration",
        icon: <Brain className="h-6 w-6" />,
        weights: { "Entrepreneurship": 3, "Leadership": 1, "Creative Arts": 1 }
      }
    ]
  },
  {
    id: 11,
    question: "What's your preferred pace of work?",
    description: "Think about the rhythm and intensity that suits you best.",
    category: "Work Pace",
    difficulty: "intermediate",
    options: [
      {
        text: "Steady, consistent pace with predictable rhythms",
        icon: <Clock className="h-6 w-6" />,
        weights: { "Healthcare": 2, "Education": 2, "Skilled Trades": 2 }
      },
      {
        text: "Varied pace - busy periods followed by slower times",
        icon: <TrendingUp className="h-6 w-6" />,
        weights: { "Creative Arts": 2, "Sales": 2, "Entrepreneurship": 1 }
      },
      {
        text: "High-energy, fast-paced environment",
        icon: <Zap className="h-6 w-6" />,
        weights: { "Sales": 3, "Leadership": 2, "Entrepreneurship": 2 }
      },
      {
        text: "Flexible pace that I can control and adjust",
        icon: <Target className="h-6 w-6" />,
        weights: { "Entrepreneurship": 3, "Creative Arts": 2, "Human Services": 1 }
      }
    ]
  },
  {
    id: 12,
    question: "How do you handle criticism and feedback?",
    description: "Consider your response to constructive criticism and suggestions.",
    category: "Feedback Reception",
    difficulty: "intermediate",
    options: [
      {
        text: "I appreciate gentle, supportive feedback",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Creative Arts": 2, "Human Services": 2, "Education": 1 }
      },
      {
        text: "I want direct, honest feedback to improve quickly",
        icon: <Target className="h-6 w-6" />,
        weights: { "Sales": 2, "Leadership": 2, "Skilled Trades": 2 }
      },
      {
        text: "I prefer self-evaluation with minimal external input",
        icon: <Brain className="h-6 w-6" />,
        weights: { "Entrepreneurship": 2, "Creative Arts": 2, "Skilled Trades": 1 }
      },
      {
        text: "I thrive on challenging, results-focused feedback",
        icon: <Award className="h-6 w-6" />,
        weights: { "Leadership": 3, "Sales": 2, "Entrepreneurship": 1 }
      }
    ]
  },
  {
    id: 13,
    question: "What's your ideal career trajectory?",
    description: "Think about where you want to be in 5-10 years.",
    category: "Career Goals",
    difficulty: "intermediate",
    options: [
      {
        text: "Becoming a recognized expert in my field",
        icon: <Award className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Skilled Trades": 2, "Education": 2 }
      },
      {
        text: "Leading and managing teams or organizations",
        icon: <Users className="h-6 w-6" />,
        weights: { "Leadership": 3, "Sales": 2, "Healthcare": 1 }
      },
      {
        text: "Building my own business or consultancy",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Entrepreneurship": 3, "Creative Arts": 2, "Sales": 1 }
      },
      {
        text: "Making a lasting impact on individuals or communities",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Human Services": 3, "Education": 3, "Healthcare": 2 }
      }
    ]
  },
  {
    id: 14,
    question: "How do you prefer to develop new skills?",
    description: "Consider your most effective learning and growth methods.",
    category: "Skill Development",
    difficulty: "intermediate",
    options: [
      {
        text: "Formal education and structured programs",
        icon: <BookOpen className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Education": 2, "Leadership": 1 }
      },
      {
        text: "Apprenticeships and mentoring relationships",
        icon: <Users className="h-6 w-6" />,
        weights: { "Skilled Trades": 3, "Healthcare": 2, "Sales": 2 }
      },
      {
        text: "Self-directed learning and experimentation",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Entrepreneurship": 2, "Skilled Trades": 1 }
      },
      {
        text: "Learning through real-world challenges and projects",
        icon: <Target className="h-6 w-6" />,
        weights: { "Leadership": 2, "Sales": 2, "Entrepreneurship": 2 }
      }
    ]
  },
  {
    id: 15,
    question: "What type of physical environment do you work best in?",
    description: "Consider the physical spaces where you feel most productive.",
    category: "Physical Environment",
    difficulty: "intermediate",
    options: [
      {
        text: "Clinical or medical settings with specialized equipment",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Human Services": 1 }
      },
      {
        text: "Workshops, construction sites, or hands-on environments",
        icon: <div className="h-6 w-6 bg-orange-500 rounded"></div>,
        weights: { "Skilled Trades": 3, "Creative Arts": 1 }
      },
      {
        text: "Creative studios, offices, or collaborative spaces",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Leadership": 1, "Sales": 1 }
      },
      {
        text: "Flexible locations - office, home, client sites, outdoors",
        icon: <Globe className="h-6 w-6" />,
        weights: { "Sales": 2, "Entrepreneurship": 2, "Human Services": 1 }
      }
    ]
  }
]

// Expert Assessment - 25 questions (includes comprehensive + 10 more advanced)
const expertQuestions: Question[] = [
  ...comprehensiveQuestions,
  {
    id: 16,
    question: "You're leading a project that's behind schedule. What's your first instinct?",
    description: "This scenario tests your leadership and problem-solving approach under pressure.",
    category: "Leadership Scenario",
    difficulty: "advanced",
    options: [
      {
        text: "Analyze the root causes and adjust the plan systematically",
        icon: <Brain className="h-6 w-6" />,
        weights: { "Leadership": 3, "Healthcare": 2, "Skilled Trades": 1 }
      },
      {
        text: "Rally the team and work extra hours to catch up",
        icon: <Users className="h-6 w-6" />,
        weights: { "Sales": 2, "Leadership": 2, "Entrepreneurship": 1 }
      },
      {
        text: "Find creative solutions or alternative approaches",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Entrepreneurship": 2, "Leadership": 1 }
      },
      {
        text: "Focus on team wellbeing while finding sustainable solutions",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Human Services": 3, "Education": 2, "Healthcare": 2 }
      }
    ]
  },
  {
    id: 17,
    question: "A client is unhappy with your work. How do you respond?",
    description: "This tests your client relationship and conflict resolution skills.",
    category: "Client Relations",
    difficulty: "advanced",
    options: [
      {
        text: "Listen carefully, empathize, and work together on solutions",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Human Services": 3, "Sales": 2 }
      },
      {
        text: "Review the work objectively and make necessary corrections",
        icon: <Target className="h-6 w-6" />,
        weights: { "Skilled Trades": 3, "Leadership": 2, "Healthcare": 1 }
      },
      {
        text: "Explore creative alternatives that might better meet their needs",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Sales": 2, "Entrepreneurship": 1 }
      },
      {
        text: "Use this as an opportunity to strengthen the relationship",
        icon: <Users className="h-6 w-6" />,
        weights: { "Sales": 3, "Leadership": 2, "Entrepreneurship": 2 }
      }
    ]
  },
  {
    id: 18,
    question: "Your industry is changing rapidly due to new technology. How do you adapt?",
    description: "This assesses your adaptability and approach to technological change.",
    category: "Technology Adaptation",
    difficulty: "advanced",
    options: [
      {
        text: "Focus on the human elements that technology can't replace",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Human Services": 2, "Education": 2 }
      },
      {
        text: "Learn the new technology and integrate it into my skillset",
        icon: <Brain className="h-6 w-6" />,
        weights: { "Leadership": 2, "Skilled Trades": 2, "Sales": 2 }
      },
      {
        text: "Find innovative ways to combine technology with creativity",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Entrepreneurship": 2, "Leadership": 1 }
      },
      {
        text: "Become an early adopter and help others adapt",
        icon: <Target className="h-6 w-6" />,
        weights: { "Entrepreneurship": 3, "Leadership": 2, "Education": 1 }
      }
    ]
  },
  {
    id: 19,
    question: "You have an opportunity to mentor someone new to your field. What's your approach?",
    description: "This evaluates your teaching style and knowledge transfer abilities.",
    category: "Mentoring Style",
    difficulty: "advanced",
    options: [
      {
        text: "Create a structured learning plan with clear milestones",
        icon: <BookOpen className="h-6 w-6" />,
        weights: { "Education": 3, "Healthcare": 2, "Leadership": 2 }
      },
      {
        text: "Learn alongside them and share the journey",
        icon: <Users className="h-6 w-6" />,
        weights: { "Human Services": 2, "Creative Arts": 2, "Entrepreneurship": 1 }
      },
      {
        text: "Give them real challenges and support them through it",
        icon: <Target className="h-6 w-6" />,
        weights: { "Skilled Trades": 3, "Sales": 2, "Leadership": 2 }
      },
      {
        text: "Inspire them to find their own path and creative solutions",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Entrepreneurship": 2, "Education": 1 }
      }
    ]
  },
  {
    id: 20,
    question: "What's your approach to ethical dilemmas in your work?",
    description: "This tests your ethical reasoning and value-based decision making.",
    category: "Ethics",
    difficulty: "advanced",
    options: [
      {
        text: "Follow established guidelines and professional standards",
        icon: <Shield className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Education": 2, "Human Services": 2 }
      },
      {
        text: "Consider the impact on all stakeholders involved",
        icon: <Users className="h-6 w-6" />,
        weights: { "Leadership": 3, "Human Services": 2, "Sales": 1 }
      },
      {
        text: "Trust my intuition and personal values",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Creative Arts": 2, "Entrepreneurship": 2, "Human Services": 2 }
      },
      {
        text: "Seek creative solutions that honor all parties",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 2, "Entrepreneurship": 2, "Leadership": 1 }
      }
    ]
  },
  {
    id: 21,
    question: "How do you measure success in your career?",
    description: "This reveals your core values and long-term motivations.",
    category: "Success Metrics",
    difficulty: "advanced",
    options: [
      {
        text: "The positive impact I have on individuals' lives",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Human Services": 3, "Education": 3 }
      },
      {
        text: "The quality and craftsmanship of my work",
        icon: <Award className="h-6 w-6" />,
        weights: { "Skilled Trades": 3, "Creative Arts": 2, "Healthcare": 1 }
      },
      {
        text: "Financial achievement and business growth",
        icon: <TrendingUp className="h-6 w-6" />,
        weights: { "Sales": 3, "Leadership": 2, "Entrepreneurship": 3 }
      },
      {
        text: "Innovation and creative breakthroughs",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Entrepreneurship": 2, "Leadership": 1 }
      }
    ]
  },
  {
    id: 22,
    question: "When working on a long-term project, what keeps you motivated?",
    description: "This assesses your persistence and internal motivation sources.",
    category: "Long-term Motivation",
    difficulty: "advanced",
    options: [
      {
        text: "Seeing gradual progress and improvement in those I serve",
        icon: <TrendingUp className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Education": 3, "Human Services": 2 }
      },
      {
        text: "The satisfaction of building something tangible and lasting",
        icon: <Target className="h-6 w-6" />,
        weights: { "Skilled Trades": 3, "Creative Arts": 2, "Entrepreneurship": 1 }
      },
      {
        text: "The creative process and artistic expression",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Entrepreneurship": 1, "Education": 1 }
      },
      {
        text: "Achievement of strategic goals and measurable outcomes",
        icon: <Award className="h-6 w-6" />,
        weights: { "Leadership": 3, "Sales": 2, "Entrepreneurship": 2 }
      }
    ]
  },
  {
    id: 23,
    question: "How do you handle failure or setbacks in your work?",
    description: "This evaluates resilience and learning from challenges.",
    category: "Resilience",
    difficulty: "advanced",
    options: [
      {
        text: "Reflect deeply on lessons learned and adjust my approach",
        icon: <Brain className="h-6 w-6" />,
        weights: { "Leadership": 2, "Healthcare": 2, "Education": 2 }
      },
      {
        text: "Focus on supporting those affected and rebuilding trust",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Human Services": 3, "Healthcare": 2, "Education": 2 }
      },
      {
        text: "Use it as fuel for creative problem-solving",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Entrepreneurship": 2, "Sales": 1 }
      },
      {
        text: "Analyze what went wrong and implement systematic improvements",
        icon: <Target className="h-6 w-6" />,
        weights: { "Skilled Trades": 2, "Leadership": 2, "Sales": 2 }
      }
    ]
  },
  {
    id: 24,
    question: "What role do you prefer to play in team dynamics?",
    description: "This assesses your natural team role and collaboration style.",
    category: "Team Dynamics",
    difficulty: "advanced",
    options: [
      {
        text: "The supportive caregiver who ensures everyone's wellbeing",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Human Services": 3, "Healthcare": 2, "Education": 2 }
      },
      {
        text: "The practical expert who solves technical problems",
        icon: <Target className="h-6 w-6" />,
        weights: { "Skilled Trades": 3, "Healthcare": 1, "Leadership": 1 }
      },
      {
        text: "The creative visionary who generates innovative ideas",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Entrepreneurship": 2, "Leadership": 1 }
      },
      {
        text: "The strategic leader who coordinates and motivates",
        icon: <Users className="h-6 w-6" />,
        weights: { "Leadership": 3, "Sales": 2, "Entrepreneurship": 2 }
      }
    ]
  },
  {
    id: 25,
    question: "Looking ahead 10 years, what legacy do you want to leave?",
    description: "This final question captures your deepest career values and long-term vision.",
    category: "Legacy",
    difficulty: "advanced",
    options: [
      {
        text: "Lives I've helped heal, improve, or transform",
        icon: <Heart className="h-6 w-6" />,
        weights: { "Healthcare": 3, "Human Services": 3, "Education": 2 }
      },
      {
        text: "Structures, systems, or creations that outlast me",
        icon: <Award className="h-6 w-6" />,
        weights: { "Skilled Trades": 3, "Creative Arts": 2, "Entrepreneurship": 2 }
      },
      {
        text: "Artistic works or innovations that inspire others",
        icon: <Lightbulb className="h-6 w-6" />,
        weights: { "Creative Arts": 3, "Education": 1, "Entrepreneurship": 1 }
      },
      {
        text: "Organizations built and people developed into leaders",
        icon: <Users className="h-6 w-6" />,
        weights: { "Leadership": 3, "Entrepreneurship": 2, "Sales": 2 }
      }
    ]
  }
]

const careerCategories = {
  "Healthcare": {
    name: "Healthcare & Wellness",
    description: "Help others heal and maintain their physical and mental well-being",
    jobs: ["Physical Therapist", "Mental Health Counselor", "Nurse Practitioner", "Massage Therapist"],
    color: "bg-red-500"
  },
  "Skilled Trades": {
    name: "Skilled Trades",
    description: "Build, repair, and maintain the physical infrastructure we depend on",
    jobs: ["Electrician", "Plumber", "HVAC Technician", "Carpenter"],
    color: "bg-orange-500"
  },
  "Creative Arts": {
    name: "Creative Arts",
    description: "Express creativity while helping others through art, design, and media",
    jobs: ["Art Therapist", "Graphic Designer", "Interior Designer", "Photographer"],
    color: "bg-purple-500"
  },
  "Human Services": {
    name: "Human Services",
    description: "Support individuals and communities through social work and advocacy",
    jobs: ["Social Worker", "Community Organizer", "Non-profit Director", "Counselor"],
    color: "bg-green-500"
  },
  "Education": {
    name: "Education & Training",
    description: "Shape the next generation through teaching and skill development",
    jobs: ["Teacher", "Corporate Trainer", "Educational Consultant", "Coach"],
    color: "bg-blue-500"
  },
  "Sales": {
    name: "Sales & Relations",
    description: "Build relationships and help others find solutions to their needs",
    jobs: ["Sales Manager", "Account Executive", "Real Estate Agent", "Consultant"],
    color: "bg-indigo-500"
  },
  "Leadership": {
    name: "Leadership & Management",
    description: "Guide teams and organizations toward success and growth",
    jobs: ["Operations Manager", "Project Manager", "Executive Director", "Team Lead"],
    color: "bg-pink-500"
  },
  "Entrepreneurship": {
    name: "Entrepreneurship",
    description: "Create your own opportunities and build innovative businesses",
    jobs: ["Business Owner", "Consultant", "Freelancer", "Startup Founder"],
    color: "bg-yellow-500"
  }
}

const assessmentTiers: AssessmentTier[] = [
  {
    name: "Quick Assessment",
    description: "Get instant career insights",
    duration: "5 minutes",
    questions: 5,
    icon: <Zap className="h-8 w-8" />,
    features: [
      "Basic career category matching",
      "Top 3 career paths",
      "Instant results"
    ]
  },
  {
    name: "Comprehensive Assessment",
    description: "Deep dive into your career fit",
    duration: "15 minutes",
    questions: 15,
    icon: <Brain className="h-8 w-8" />,
    features: [
      "Detailed personality analysis",
      "Salary insights",
      "Skills gap analysis",
      "Career roadmap"
    ]
  },
  {
    name: "Expert Assessment",
    description: "Complete professional profile",
    duration: "25 minutes",
    questions: 25,
    icon: <Award className="h-8 w-8" />,
    features: [
      "Industry scenario analysis",
      "Leadership style assessment",
      "Market intelligence",
      "Personalized action plan",
      "Risk tolerance analysis"
    ]
  }
]

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState<"intro" | "tierSelection" | "quiz" | "results">("intro")
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [results, setResults] = useState<Record<string, number>>({})

  const getCurrentQuestions = () => {
    if (selectedTier === 0) return quickQuestions
    if (selectedTier === 1) return comprehensiveQuestions
    if (selectedTier === 2) return expertQuestions
    return quickQuestions
  }

  const calculateResults = () => {
    const scores: Record<string, number> = {}
    const currentQuestions = getCurrentQuestions()
    
    // Initialize scores
    Object.keys(careerCategories).forEach(category => {
      scores[category] = 0
    })

    // Calculate weighted scores
    currentQuestions.forEach(question => {
      const selectedOptionIndex = answers[question.id]
      if (selectedOptionIndex !== undefined) {
        const selectedOption = question.options[selectedOptionIndex]
        Object.entries(selectedOption.weights).forEach(([category, weight]) => {
          scores[category] = (scores[category] || 0) + weight
        })
      }
    })

    // Convert to percentages
    const maxScore = Math.max(...Object.values(scores))
    const percentageScores: Record<string, number> = {}
    Object.entries(scores).forEach(([category, score]) => {
      percentageScores[category] = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    })

    setResults(percentageScores)
    setCurrentStep("results")
  }

  const topResults = Object.entries(results)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)

  const handleStartQuiz = () => {
    setCurrentStep("tierSelection")
  }

  const handleTierSelection = (tierIndex: number) => {
    setSelectedTier(tierIndex)
    setCurrentStep("quiz")
  }

  const handleAnswerSelect = (optionIndex: number) => {
    const currentQuestions = getCurrentQuestions()
    setAnswers(prev => ({ ...prev, [currentQuestions[currentQuestion].id]: optionIndex }))
  }

  const handleNext = () => {
    const currentQuestions = getCurrentQuestions()
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleRetakeQuiz = () => {
    setCurrentStep("intro")
    setSelectedTier(null)
    setCurrentQuestion(0)
    setAnswers({})
    setResults({})
  }

  if (currentStep === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your AI-Resistant Career Path
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Take our assessment to find careers that match your skills, interests, and values while being resistant to AI automation.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Flexible Duration</h3>
                <p className="text-sm text-gray-600">5-25 minutes based on depth</p>
              </div>
              <div className="text-center">
                <Lightbulb className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Personalized</h3>
                <p className="text-sm text-gray-600">Matches your unique profile</p>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">AI-Resistant</h3>
                <p className="text-sm text-gray-600">Future-proof careers</p>
              </div>
            </div>

            <div className="text-left space-y-3 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">You&apos;ll discover:</h3>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Your top career category matches</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Specific job titles to explore</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Why these careers are AI-resistant</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Personalized next steps</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStartQuiz}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 font-semibold text-lg flex items-center justify-center space-x-2"
              >
                <span>Choose Assessment Level</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleTierSelection(0)}
                className="w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 font-medium text-sm flex items-center justify-center space-x-2"
              >
                <span>Skip to Quick Assessment (5 min)</span>
                <Zap className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            No account required. Your results are private and not stored.
          </p>
        </div>
      </div>
    )
  }

  if (currentStep === "tierSelection") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Assessment Level
            </h1>
            <p className="text-lg text-gray-600">
              Select the depth of analysis that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {assessmentTiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-lg p-8 border-2 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                  index === 1 ? 'border-blue-500 relative' : 'border-gray-200'
                }`}
                onClick={() => handleTierSelection(index)}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Recommended
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {tier.duration}
                    </span>
                    <span>{tier.questions} questions</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    index === 1
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Start {tier.name}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentStep("intro")}
              className="text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to intro</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "quiz") {
    const currentQuestions = getCurrentQuestions()
    const question = currentQuestions[currentQuestion]
    const progress = ((currentQuestion + 1) / currentQuestions.length) * 100
    const selectedTierName = assessmentTiers[selectedTier!]?.name || "Assessment"

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {selectedTierName} - Question {currentQuestion + 1} of {currentQuestions.length}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {question.difficulty !== 'basic' && (
              <div className="mb-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  question.difficulty === 'intermediate' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {question.category} • {question.difficulty}
                </span>
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {question.question}
            </h2>
            <p className="text-gray-600 mb-8">{question.description}</p>

            <div className="space-y-4 mb-8">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-6 border-2 rounded-lg text-left transition-all ${
                    answers[question.id] === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${ 
                      answers[question.id] === index ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-900 font-medium block">{option.text}</span>
                      {option.description && (
                        <span className="text-gray-500 text-sm mt-1 block">{option.description}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={answers[question.id] === undefined}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{currentQuestion === currentQuestions.length - 1 ? "Get Results" : "Next"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Results page with enhanced features for different tiers
  const selectedTierInfo = assessmentTiers[selectedTier!]
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your AI-Resistant Career Matches
          </h1>
          <p className="text-lg text-gray-600">
            Based on your {selectedTierInfo?.name.toLowerCase()}, here are your top career paths.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {topResults.map(([category, score], index) => {
            const categoryInfo = careerCategories[category as keyof typeof careerCategories]
            return (
              <div key={category} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{categoryInfo.name}</h3>
                      <p className="text-gray-600">{categoryInfo.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{score}%</div>
                    <div className="text-sm text-gray-500">Match</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Sample careers in this field:</h4>
                  <div className="flex flex-wrap gap-2">
                    {categoryInfo.jobs.map(job => (
                      <span key={job} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {job}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enhanced results for comprehensive and expert tiers */}
                {selectedTier && selectedTier > 0 && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">AI-Resistance Analysis:</h5>
                    <p className="text-sm text-gray-700">
                      This field scores high in AI-resistance due to its emphasis on {
                        category === "Healthcare" ? "human empathy, physical touch, and complex patient care" :
                        category === "Skilled Trades" ? "hands-on problem-solving, physical dexterity, and on-site adaptability" :
                        category === "Creative Arts" ? "human creativity, emotional expression, and subjective interpretation" :
                        category === "Human Services" ? "emotional intelligence, community understanding, and complex social navigation" :
                        category === "Education" ? "personalized mentoring, inspirational leadership, and adaptive teaching" :
                        category === "Sales" ? "relationship building, trust development, and nuanced persuasion" :
                        category === "Leadership" ? "strategic thinking, team motivation, and complex decision-making" :
                        "innovation, risk assessment, and creative problem-solving"
                      }.
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium">
                    Explore Jobs
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Personalized insights for expert tier */}
        {selectedTier === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expert Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Your Leadership Style</h4>
                <p className="text-sm text-gray-600">
                  Based on your responses, you tend to be a collaborative leader who balances results with team wellbeing.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Risk Profile</h4>
                <p className="text-sm text-gray-600">
                  You show a moderate risk tolerance, preferring calculated decisions over pure intuition or extreme caution.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to explore your options?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center space-x-2">
              <span>Browse Jobs</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center space-x-2">
              <span>View Learning Resources</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleRetakeQuiz}
              className="text-blue-600 px-6 py-3 hover:bg-blue-50 font-medium"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}