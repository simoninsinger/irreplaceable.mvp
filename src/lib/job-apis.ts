// Job API integrations for real job data
export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  salary?: {
    min?: number
    max?: number
    currency: string
    period: 'hourly' | 'yearly' | 'monthly'
  }
  aiResistanceScore: number // 1-10 scale
  category: string
  remote: boolean
  experience: 'entry' | 'mid' | 'senior' | 'executive'
  postedDate: Date
  expiryDate?: Date
  url: string
  source: 'adzuna' | 'indeed' | 'manual' | 'scraped'
  tags: string[]
  benefits: string[]
}

export interface CareerPath {
  id: string
  title: string
  description: string
  aiResistanceScore: number
  averageSalary: {
    min: number
    max: number
    currency: string
  }
  growthOutlook: 'high' | 'medium' | 'low'
  education: string[]
  skills: string[]
  certifications?: string[]
  industries: string[]
  relatedJobs: string[]
  whyAIResistant: string[]
}

// AI-Resistant Job Categories
export const AI_RESISTANT_KEYWORDS = [
  // Healthcare & Medical
  'nurse', 'doctor', 'physician', 'therapist', 'physical therapy', 'occupational therapy',
  'dentist', 'surgeon', 'medical', 'healthcare', 'patient care', 'clinical',
  
  // Skilled Trades
  'electrician', 'plumber', 'carpenter', 'welder', 'hvac', 'mechanic', 'technician',
  'construction', 'maintenance', 'repair', 'installation', 'handyman',
  
  // Creative & Arts
  'designer', 'artist', 'creative', 'photographer', 'videographer', 'musician',
  'writer', 'content creator', 'marketing creative', 'brand designer',
  
  // Human Services
  'teacher', 'educator', 'counselor', 'social worker', 'coach', 'trainer',
  'consultant', 'advisor', 'recruiter', 'hr specialist',
  
  // Personal Services
  'chef', 'cook', 'barber', 'stylist', 'massage therapist', 'fitness trainer',
  'personal trainer', 'beautician', 'esthetician',
  
  // Leadership & Management
  'manager', 'director', 'supervisor', 'team lead', 'project manager',
  'executive', 'ceo', 'founder', 'entrepreneur',
  
  // Emergency Services
  'firefighter', 'police', 'emt', 'paramedic', 'security', 'safety',
  
  // Agriculture & Environment
  'farmer', 'agricultural', 'environmental', 'conservation', 'sustainability',
  'renewable energy', 'solar', 'wind energy'
]

// Adzuna API Integration
export class AdzunaAPI {
  private appId: string
  private appKey: string
  private baseUrl = 'https://api.adzuna.com/v1/api/jobs'

  constructor(appId: string, appKey: string) {
    this.appId = appId
    this.appKey = appKey
  }

  async searchJobs(
    keywords: string,
    location: string = 'us',
    page: number = 1,
    resultsPerPage: number = 50
  ): Promise<JobListing[]> {
    try {
      const url = `${this.baseUrl}/${location}/search/${page}`
      const params = new URLSearchParams({
        app_id: this.appId,
        app_key: this.appKey,
        what: keywords,
        results_per_page: resultsPerPage.toString(),
        content_type: 'application/json'
      })

      const response = await fetch(`${url}?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(`Adzuna API error: ${data.message || response.statusText}`)
      }

      return data.results.map((job: any) => this.transformAdzunaJob(job))
    } catch (error) {
      console.error('Error fetching jobs from Adzuna:', error)
      return []
    }
  }

  private transformAdzunaJob(job: any): JobListing {
    const aiResistanceScore = this.calculateAIResistanceScore(job.title, job.description)
    
    return {
      id: `adzuna_${job.id}`,
      title: job.title,
      company: job.company?.display_name || 'Company Not Listed',
      location: `${job.location.area[3] || job.location.area[2] || job.location.area[1] || job.location.area[0]}`,
      description: job.description,
      requirements: this.extractRequirements(job.description),
      salary: job.salary_min && job.salary_max ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: 'USD',
        period: 'yearly'
      } : undefined,
      aiResistanceScore,
      category: job.category?.label || 'Other',
      remote: job.location.display_name?.toLowerCase().includes('remote') || false,
      experience: this.determineExperienceLevel(job.title, job.description),
      postedDate: new Date(job.created),
      url: job.redirect_url,
      source: 'adzuna',
      tags: this.extractTags(job.title, job.description),
      benefits: this.extractBenefits(job.description)
    }
  }

  private calculateAIResistanceScore(title: string, description: string): number {
    const text = `${title} ${description}`.toLowerCase()
    let score = 5 // Base score

    // High AI resistance indicators
    const highResistanceKeywords = [
      'hands-on', 'physical', 'manual', 'in-person', 'face-to-face',
      'creative', 'artistic', 'leadership', 'management', 'counseling',
      'therapy', 'teaching', 'nursing', 'medical', 'emergency',
      'skilled trade', 'craftsmanship', 'installation', 'repair'
    ]

    // Low AI resistance indicators
    const lowResistanceKeywords = [
      'data entry', 'administrative', 'clerical', 'routine',
      'automated', 'algorithm', 'machine learning', 'ai',
      'repetitive', 'processing', 'basic computer'
    ]

    // Check for high resistance keywords
    highResistanceKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 1.5
      }
    })

    // Check for low resistance keywords
    lowResistanceKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score -= 1
      }
    })

    // Cap between 1-10
    return Math.max(1, Math.min(10, Math.round(score)))
  }

  private extractRequirements(description: string): string[] {
    const requirements: string[] = []
    const text = description.toLowerCase()

    // Common requirement patterns
    const patterns = [
      /(?:require[sd]?|must have|need|looking for)[^.]*?(?:degree|certification|experience|years?|skill)/gi,
      /(?:bachelor|master|phd|certificate|license)[^.]*$/gi,
      /\d+\+?\s*years?\s*(?:of\s*)?experience/gi
    ]

    patterns.forEach(pattern => {
      const matches = description.match(pattern)
      if (matches) {
        requirements.push(...matches.slice(0, 3)) // Limit to 3 matches per pattern
      }
    })

    return requirements.slice(0, 5) // Max 5 requirements
  }

  private determineExperienceLevel(title: string, description: string): 'entry' | 'mid' | 'senior' | 'executive' {
    const text = `${title} ${description}`.toLowerCase()

    if (text.includes('senior') || text.includes('lead') || text.includes('principal') || 
        text.includes('director') || text.includes('manager')) {
      return 'senior'
    }
    
    if (text.includes('executive') || text.includes('vp') || text.includes('ceo') || 
        text.includes('cto') || text.includes('cfo')) {
      return 'executive'
    }
    
    if (text.includes('junior') || text.includes('entry') || text.includes('graduate') || 
        text.includes('intern') || text.includes('associate')) {
      return 'entry'
    }
    
    return 'mid'
  }

  private extractTags(title: string, description: string): string[] {
    const tags: string[] = []
    const text = `${title} ${description}`.toLowerCase()

    AI_RESISTANT_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        tags.push(keyword)
      }
    })

    return [...new Set(tags)].slice(0, 8) // Remove duplicates, max 8 tags
  }

  private extractBenefits(description: string): string[] {
    const benefits: string[] = []
    const benefitKeywords = [
      'health insurance', 'dental', 'vision', '401k', 'retirement',
      'paid time off', 'pto', 'vacation', 'flexible hours', 'remote work',
      'professional development', 'training', 'certification', 'bonus',
      'stock options', 'equity'
    ]

    const text = description.toLowerCase()
    benefitKeywords.forEach(benefit => {
      if (text.includes(benefit)) {
        benefits.push(benefit)
      }
    })

    return [...new Set(benefits)].slice(0, 6) // Remove duplicates, max 6 benefits
  }
}

// Manual job seeding for immediate content
export const SEED_JOBS: JobListing[] = [
  {
    id: 'seed_1',
    title: 'Registered Nurse - ICU',
    company: 'Metro General Hospital',
    location: 'New York, NY',
    description: 'Join our ICU team providing critical care to patients. Requires hands-on patient assessment, medication administration, and collaboration with multidisciplinary teams.',
    requirements: [
      'RN License required',
      'BSN preferred',
      '2+ years ICU experience',
      'BLS and ACLS certification'
    ],
    salary: {
      min: 75000,
      max: 95000,
      currency: 'USD',
      period: 'yearly'
    },
    aiResistanceScore: 9,
    category: 'Healthcare',
    remote: false,
    experience: 'mid',
    postedDate: new Date(),
    url: '#',
    source: 'manual',
    tags: ['nurse', 'healthcare', 'patient care', 'medical'],
    benefits: ['health insurance', 'dental', '401k', 'pto']
  },
  {
    id: 'seed_2',
    title: 'Master Electrician',
    company: 'Bright Future Electric',
    location: 'Austin, TX',
    description: 'Lead electrical installations and repairs for residential and commercial projects. Supervise apprentices and ensure code compliance.',
    requirements: [
      'Master Electrician License',
      '8+ years experience',
      'Valid drivers license',
      'Ability to lift 50lbs'
    ],
    salary: {
      min: 65000,
      max: 85000,
      currency: 'USD',
      period: 'yearly'
    },
    aiResistanceScore: 9,
    category: 'Skilled Trades',
    remote: false,
    experience: 'senior',
    postedDate: new Date(),
    url: '#',
    source: 'manual',
    tags: ['electrician', 'skilled trade', 'construction', 'installation'],
    benefits: ['health insurance', 'retirement', 'training', 'bonus']
  },
  {
    id: 'seed_3',
    title: 'Elementary School Teacher',
    company: 'Sunshine Elementary',
    location: 'Denver, CO',
    description: 'Teach 3rd grade students in a supportive environment. Develop lesson plans, assess student progress, and communicate with parents.',
    requirements: [
      'Teaching license',
      'Bachelor\'s degree in Education',
      'Classroom management experience',
      'Background check required'
    ],
    salary: {
      min: 45000,
      max: 65000,
      currency: 'USD',
      period: 'yearly'
    },
    aiResistanceScore: 8,
    category: 'Education',
    remote: false,
    experience: 'mid',
    postedDate: new Date(),
    url: '#',
    source: 'manual',
    tags: ['teacher', 'education', 'children', 'curriculum'],
    benefits: ['health insurance', 'retirement', 'summer break', 'professional development']
  }
]

// Career exploration data
export const AI_RESISTANT_CAREERS: CareerPath[] = [
  {
    id: 'healthcare_nursing',
    title: 'Registered Nurse',
    description: 'Provide direct patient care, administer medications, and coordinate with healthcare teams to ensure optimal patient outcomes.',
    aiResistanceScore: 9,
    averageSalary: {
      min: 60000,
      max: 90000,
      currency: 'USD'
    },
    growthOutlook: 'high',
    education: ['Associate or Bachelor in Nursing', 'RN License'],
    skills: ['Patient care', 'Critical thinking', 'Communication', 'Medical knowledge', 'Empathy'],
    certifications: ['RN License', 'BLS', 'ACLS (specialized)'],
    industries: ['Healthcare', 'Hospitals', 'Clinics', 'Home healthcare'],
    relatedJobs: ['Nurse Practitioner', 'Charge Nurse', 'Clinical Coordinator'],
    whyAIResistant: [
      'Requires human touch and empathy',
      'Complex decision-making in unpredictable situations',
      'Direct patient interaction and emotional support',
      'Physical assessment and hands-on care'
    ]
  },
  {
    id: 'trades_electrician',
    title: 'Electrician',
    description: 'Install, maintain, and repair electrical systems in homes, businesses, and industrial facilities.',
    aiResistanceScore: 9,
    averageSalary: {
      min: 50000,
      max: 80000,
      currency: 'USD'
    },
    growthOutlook: 'high',
    education: ['High school diploma', 'Trade school or apprenticeship'],
    skills: ['Electrical knowledge', 'Problem-solving', 'Physical dexterity', 'Safety protocols'],
    certifications: ['Electrician License', 'OSHA Safety'],
    industries: ['Construction', 'Manufacturing', 'Utilities', 'Maintenance'],
    relatedJobs: ['Master Electrician', 'Electrical Contractor', 'Electrical Inspector'],
    whyAIResistant: [
      'Requires hands-on installation and repair work',
      'Complex problem-solving in unique environments',
      'Safety-critical work requiring human judgment',
      'Physical presence needed for installation'
    ]
  },
  {
    id: 'healthcare_physical_therapist',
    title: 'Physical Therapist',
    description: 'Help patients recover from injuries and improve mobility through personalized treatment plans and hands-on therapy.',
    aiResistanceScore: 9,
    averageSalary: {
      min: 70000,
      max: 95000,
      currency: 'USD'
    },
    growthOutlook: 'high',
    education: ['Doctorate in Physical Therapy (DPT)'],
    skills: ['Anatomy knowledge', 'Manual therapy', 'Patient communication', 'Treatment planning'],
    certifications: ['PT License', 'CPR', 'Specialty certifications'],
    industries: ['Healthcare', 'Sports medicine', 'Rehabilitation', 'Private practice'],
    relatedJobs: ['Occupational Therapist', 'Sports Therapist', 'Rehabilitation Coordinator'],
    whyAIResistant: [
      'Requires hands-on manual therapy techniques',
      'Personalized treatment based on individual assessment',
      'Motivational and emotional support for patients',
      'Complex movement analysis and adjustment'
    ]
  },
  {
    id: 'education_teacher',
    title: 'Elementary School Teacher',
    description: 'Educate and nurture young children, developing lesson plans, managing classrooms, and fostering social-emotional growth.',
    aiResistanceScore: 8,
    averageSalary: {
      min: 42000,
      max: 68000,
      currency: 'USD'
    },
    growthOutlook: 'medium',
    education: ['Bachelor in Education', 'Teaching License', 'Student Teaching Experience'],
    skills: ['Classroom management', 'Curriculum development', 'Child psychology', 'Communication', 'Patience'],
    certifications: ['Teaching License', 'CPR/First Aid', 'Special Education (optional)'],
    industries: ['Public Schools', 'Private Schools', 'Charter Schools', 'Tutoring'],
    relatedJobs: ['Principal', 'Curriculum Coordinator', 'Special Education Teacher'],
    whyAIResistant: [
      'Requires emotional intelligence and human connection',
      'Complex behavioral management and adaptation',
      'Creative lesson planning for diverse learning styles',
      'Nurturing social and emotional development'
    ]
  },
  {
    id: 'trades_plumber',
    title: 'Plumber',
    description: 'Install, repair, and maintain plumbing systems in residential and commercial buildings, handling emergencies and complex installations.',
    aiResistanceScore: 9,
    averageSalary: {
      min: 48000,
      max: 78000,
      currency: 'USD'
    },
    growthOutlook: 'high',
    education: ['High school diploma', 'Plumbing apprenticeship or trade school'],
    skills: ['Plumbing systems knowledge', 'Problem-solving', 'Physical strength', 'Customer service'],
    certifications: ['Plumbing License', 'Backflow Prevention', 'OSHA Safety'],
    industries: ['Construction', 'Residential Services', 'Commercial Maintenance', 'Emergency Services'],
    relatedJobs: ['Master Plumber', 'Plumbing Contractor', 'Pipe Fitter'],
    whyAIResistant: [
      'Requires physical access to unique spaces',
      'Complex problem-solving in unpredictable situations',
      'Emergency response requiring human judgment',
      'Customer interaction and trust-building'
    ]
  },
  {
    id: 'culinary_chef',
    title: 'Professional Chef',
    description: 'Create innovative dishes, manage kitchen operations, and lead culinary teams in restaurants and hospitality venues.',
    aiResistanceScore: 8,
    averageSalary: {
      min: 45000,
      max: 85000,
      currency: 'USD'
    },
    growthOutlook: 'medium',
    education: ['Culinary arts degree or apprenticeship', 'Kitchen experience'],
    skills: ['Culinary techniques', 'Creativity', 'Leadership', 'Time management', 'Food safety'],
    certifications: ['ServSafe Manager', 'Specialized cuisine certifications'],
    industries: ['Restaurants', 'Hotels', 'Catering', 'Food Services'],
    relatedJobs: ['Sous Chef', 'Executive Chef', 'Food & Beverage Manager'],
    whyAIResistant: [
      'Requires creativity and artistic expression',
      'Taste and sensory evaluation cannot be automated',
      'Cultural and personal preferences in cuisine',
      'Team leadership and kitchen management'
    ]
  },
  {
    id: 'healthcare_dental_hygienist',
    title: 'Dental Hygienist',
    description: 'Provide preventive dental care, clean teeth, examine patients, and educate about oral health practices.',
    aiResistanceScore: 8,
    averageSalary: {
      min: 65000,
      max: 85000,
      currency: 'USD'
    },
    growthOutlook: 'high',
    education: ['Associate degree in Dental Hygiene'],
    skills: ['Dental procedures', 'Patient care', 'Attention to detail', 'Communication', 'Manual dexterity'],
    certifications: ['Dental Hygiene License', 'CPR', 'Local Anesthesia (some states)'],
    industries: ['Dental Offices', 'Clinics', 'Public Health', 'Schools'],
    relatedJobs: ['Dentist', 'Dental Assistant', 'Public Health Dental Hygienist'],
    whyAIResistant: [
      'Requires precise manual dexterity and touch',
      'Patient comfort and anxiety management',
      'Visual and tactile examination skills',
      'Personalized patient education and motivation'
    ]
  },
  {
    id: 'emergency_firefighter',
    title: 'Firefighter',
    description: 'Respond to fires, medical emergencies, and disasters while protecting lives and property in dangerous situations.',
    aiResistanceScore: 9,
    averageSalary: {
      min: 50000,
      max: 80000,
      currency: 'USD'
    },
    growthOutlook: 'medium',
    education: ['High school diploma', 'Fire academy training', 'EMT certification'],
    skills: ['Physical fitness', 'Emergency response', 'Teamwork', 'Problem-solving', 'Courage'],
    certifications: ['Firefighter I & II', 'EMT', 'CPR', 'Hazmat'],
    industries: ['Fire Departments', 'Emergency Services', 'Industrial Safety', 'Airport Fire'],
    relatedJobs: ['Fire Captain', 'Fire Inspector', 'Emergency Medical Technician'],
    whyAIResistant: [
      'Life-or-death decision making under extreme pressure',
      'Physical rescue operations requiring human strength',
      'Unpredictable emergency situations',
      'Community trust and public safety responsibility'
    ]
  },
  {
    id: 'personal_massage_therapist',
    title: 'Massage Therapist',
    description: 'Provide therapeutic massage treatments to help clients manage pain, reduce stress, and improve wellness.',
    aiResistanceScore: 9,
    averageSalary: {
      min: 35000,
      max: 65000,
      currency: 'USD'
    },
    growthOutlook: 'high',
    education: ['Massage therapy program (500+ hours)', 'Anatomy and physiology'],
    skills: ['Manual therapy techniques', 'Anatomy knowledge', 'Empathy', 'Physical stamina'],
    certifications: ['Massage Therapy License', 'CPR', 'Specialized techniques'],
    industries: ['Spas', 'Healthcare', 'Sports medicine', 'Private practice'],
    relatedJobs: ['Physical Therapist', 'Spa Manager', 'Sports Massage Therapist'],
    whyAIResistant: [
      'Requires human touch and therapeutic presence',
      'Individualized treatment based on client needs',
      'Emotional support and stress relief',
      'Complex muscle and tissue assessment'
    ]
  },
  {
    id: 'trades_hvac_technician',
    title: 'HVAC Technician',
    description: 'Install, maintain, and repair heating, ventilation, and air conditioning systems in residential and commercial buildings.',
    aiResistanceScore: 8,
    averageSalary: {
      min: 45000,
      max: 75000,
      currency: 'USD'
    },
    growthOutlook: 'high',
    education: ['Technical school or apprenticeship', 'HVAC certification'],
    skills: ['Mechanical systems', 'Electrical knowledge', 'Problem-solving', 'Customer service'],
    certifications: ['EPA 608 Certification', 'NATE Certification', 'State licenses'],
    industries: ['HVAC contractors', 'Building maintenance', 'Construction', 'Manufacturing'],
    relatedJobs: ['HVAC Supervisor', 'Building Engineer', 'Energy Auditor'],
    whyAIResistant: [
      'Complex mechanical troubleshooting',
      'Crawling in tight spaces and physical installation',
      'Customer interaction and problem explanation',
      'Varied work environments requiring adaptation'
    ]
  },
  {
    id: 'creative_hair_stylist',
    title: 'Hair Stylist',
    description: 'Cut, color, and style hair while building client relationships and staying current with fashion trends.',
    aiResistanceScore: 8,
    averageSalary: {
      min: 30000,
      max: 65000,
      currency: 'USD'
    },
    growthOutlook: 'medium',
    education: ['Cosmetology school (1000-1500 hours)', 'State licensing'],
    skills: ['Haircutting techniques', 'Color theory', 'Customer service', 'Creativity', 'Trends awareness'],
    certifications: ['Cosmetology License', 'Specialized technique certifications'],
    industries: ['Salons', 'Spas', 'Film/TV', 'Freelance'],
    relatedJobs: ['Salon Owner', 'Color Specialist', 'Platform Artist'],
    whyAIResistant: [
      'Artistic creativity and personal style interpretation',
      'Building personal relationships with clients',
      'Manual dexterity and artistic skill',
      'Fashion trends and individual preferences'
    ]
  },
  {
    id: 'healthcare_occupational_therapist',
    title: 'Occupational Therapist',
    description: 'Help patients develop or recover skills needed for daily living and working through therapeutic activities.',
    aiResistanceScore: 9,
    averageSalary: {
      min: 75000,
      max: 95000,
      currency: 'USD'
    },
    growthOutlook: 'high',
    education: ['Master in Occupational Therapy (MOT)'],
    skills: ['Assessment skills', 'Treatment planning', 'Patient motivation', 'Adaptive techniques'],
    certifications: ['OT License', 'CPR', 'Specialty certifications'],
    industries: ['Healthcare', 'Rehabilitation', 'Schools', 'Mental health'],
    relatedJobs: ['Physical Therapist', 'Rehabilitation Director', 'Hand Therapist'],
    whyAIResistant: [
      'Individualized assessment and treatment planning',
      'Creative problem-solving for daily living',
      'Emotional support and motivation',
      'Hands-on therapeutic intervention'
    ]
  },
  {
    id: 'social_counselor',
    title: 'Mental Health Counselor',
    description: 'Provide therapy and support to individuals dealing with mental health, emotional, and behavioral challenges.',
    aiResistanceScore: 9,
    averageSalary: {
      min: 45000,
      max: 75000,
      currency: 'USD'
    },
    growthOutlook: 'high',
    education: ['Master in Counseling or Psychology', 'Clinical training'],
    skills: ['Active listening', 'Empathy', 'Assessment', 'Therapeutic techniques', 'Crisis intervention'],
    certifications: ['Licensed Professional Counselor (LPC)', 'Specialty therapy certifications'],
    industries: ['Mental health clinics', 'Hospitals', 'Private practice', 'Community centers'],
    relatedJobs: ['Clinical Psychologist', 'Social Worker', 'Substance Abuse Counselor'],
    whyAIResistant: [
      'Requires deep human empathy and understanding',
      'Complex emotional and psychological assessment',
      'Building therapeutic relationships and trust',
      'Crisis intervention requiring human judgment'
    ]
  }
]