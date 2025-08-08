// Multi-source job scraping system for real job listings
import { JobListing, AI_RESISTANT_KEYWORDS } from './job-apis'

export interface JobSource {
  name: string
  enabled: boolean
  rateLimit: number // requests per hour
  apiKey?: string
  fetchJobs: (query: string, location?: string, limit?: number) => Promise<JobListing[]>
}

// JSearch API - Indeed, LinkedIn, Glassdoor aggregator
export class JSearchAPI {
  private apiKey: string
  private baseUrl = 'https://jsearch.p.rapidapi.com'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchJobs(query: string, location: string = 'United States', limit: number = 50): Promise<JobListing[]> {
    try {
      const params = new URLSearchParams({
        query: `${query} in ${location}`,
        page: '1',
        num_pages: '1',
        date_posted: 'week'
      })

      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`JSearch API error: ${data.message || response.statusText}`)
      }

      return data.data?.slice(0, limit).map((job: any) => this.transformJSearchJob(job)) || []
    } catch (error) {
      console.error('Error fetching from JSearch:', error)
      return []
    }
  }

  private transformJSearchJob(job: any): JobListing {
    const aiResistanceScore = this.calculateAIResistance(job.job_title, job.job_description)
    
    return {
      id: `jsearch_${job.job_id}`,
      title: job.job_title,
      company: job.employer_name || 'Company Not Listed',
      location: job.job_city && job.job_state ? `${job.job_city}, ${job.job_state}` : job.job_country || 'Location Not Specified',
      description: job.job_description || 'No description available',
      requirements: this.extractRequirements(job.job_description || ''),
      salary: job.job_min_salary && job.job_max_salary ? {
        min: job.job_min_salary,
        max: job.job_max_salary,
        currency: 'USD',
        period: 'yearly'
      } : undefined,
      aiResistanceScore,
      category: this.categorizeJob(job.job_title, job.job_description),
      remote: job.job_is_remote || false,
      experience: this.determineExperience(job.job_title, job.job_description),
      postedDate: new Date(job.job_posted_at_datetime_utc || Date.now()),
      url: job.job_apply_link || job.job_offer_expiration_datetime_utc || '#',
      source: 'jsearch',
      tags: this.extractTags(job.job_title, job.job_description),
      benefits: this.extractBenefits(job.job_description || '')
    }
  }

  private calculateAIResistance(title: string, description: string): number {
    const text = `${title} ${description || ''}`.toLowerCase()
    let score = 5 // Base score

    // High resistance indicators
    const highResistanceKeywords = [
      'nurse', 'doctor', 'therapist', 'electrician', 'plumber', 'teacher',
      'counselor', 'chef', 'mechanic', 'hands-on', 'physical', 'creative',
      'leadership', 'management', 'emergency', 'patient care', 'installation'
    ]

    // Low resistance indicators  
    const lowResistanceKeywords = [
      'data entry', 'administrative', 'clerical', 'automated', 'routine',
      'processing', 'basic computer', 'repetitive', 'clerk'
    ]

    highResistanceKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 1.2
    })

    lowResistanceKeywords.forEach(keyword => {
      if (text.includes(keyword)) score -= 1.5
    })

    return Math.max(1, Math.min(10, Math.round(score)))
  }

  private extractRequirements(description: string): string[] {
    const requirements: string[] = []
    const text = description.toLowerCase()

    const patterns = [
      /(?:require[sd]?|must have|need|looking for)[^.]*?(?:degree|certification|experience|years?|license)/gi,
      /(?:bachelor|master|phd|associate)[^.]*$/gi,
      /\d+\+?\s*years?\s*(?:of\s*)?experience/gi
    ]

    patterns.forEach(pattern => {
      const matches = description.match(pattern)
      if (matches) {
        requirements.push(...matches.slice(0, 2))
      }
    })

    return requirements.slice(0, 4)
  }

  private categorizeJob(title: string, description: string): string {
    const text = `${title} ${description || ''}`.toLowerCase()
    
    if (text.includes('nurse') || text.includes('doctor') || text.includes('medical') || text.includes('healthcare')) {
      return 'Healthcare'
    }
    if (text.includes('teacher') || text.includes('educator') || text.includes('instructor')) {
      return 'Education'
    }
    if (text.includes('electrician') || text.includes('plumber') || text.includes('carpenter') || text.includes('mechanic')) {
      return 'Skilled Trades'
    }
    if (text.includes('designer') || text.includes('artist') || text.includes('creative')) {
      return 'Creative Arts'
    }
    if (text.includes('manager') || text.includes('director') || text.includes('supervisor')) {
      return 'Leadership & Management'
    }
    
    return 'Other'
  }

  private determineExperience(title: string, description: string): 'entry' | 'mid' | 'senior' | 'executive' {
    const text = `${title} ${description || ''}`.toLowerCase()

    if (text.includes('senior') || text.includes('lead') || text.includes('principal')) {
      return 'senior'
    }
    if (text.includes('director') || text.includes('vp') || text.includes('executive')) {
      return 'executive'
    }
    if (text.includes('junior') || text.includes('entry') || text.includes('intern')) {
      return 'entry'
    }
    
    return 'mid'
  }

  private extractTags(title: string, description: string): string[] {
    const tags: string[] = []
    const text = `${title} ${description || ''}`.toLowerCase()

    AI_RESISTANT_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        tags.push(keyword)
      }
    })

    return [...new Set(tags)].slice(0, 6)
  }

  private extractBenefits(description: string): string[] {
    const benefits: string[] = []
    const benefitKeywords = [
      'health insurance', 'dental', 'vision', '401k', 'retirement',
      'paid time off', 'pto', 'vacation', 'flexible', 'remote',
      'bonus', 'stock options', 'training'
    ]

    const text = description.toLowerCase()
    benefitKeywords.forEach(benefit => {
      if (text.includes(benefit)) {
        benefits.push(benefit)
      }
    })

    return [...new Set(benefits)].slice(0, 5)
  }
}

// APILayer Jobs API
export class APILayerAPI {
  private apiKey: string
  private baseUrl = 'https://api.apilayer.com/jobs'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchJobs(query: string, location: string = 'United States'): Promise<JobListing[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        location: location,
        limit: '50'
      })

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'apikey': this.apiKey
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`APILayer error: ${data.message || response.statusText}`)
      }

      return data.jobs?.map((job: any) => this.transformAPILayerJob(job)) || []
    } catch (error) {
      console.error('Error fetching from APILayer:', error)
      return []
    }
  }

  private transformAPILayerJob(job: any): JobListing {
    const aiResistanceScore = this.calculateAIResistance(job.title, job.description)
    
    return {
      id: `apilayer_${job.id || Math.random().toString(36)}`,
      title: job.title,
      company: job.company || 'Company Not Listed',
      location: job.location || 'Location Not Specified',
      description: job.description || 'No description available',
      requirements: this.extractRequirements(job.description || ''),
      salary: job.salary ? {
        min: parseInt(job.salary.replace(/\D/g, '')) || undefined,
        max: undefined,
        currency: 'USD',
        period: 'yearly'
      } : undefined,
      aiResistanceScore,
      category: this.categorizeJob(job.title, job.description),
      remote: job.remote || false,
      experience: this.determineExperience(job.title, job.description),
      postedDate: new Date(job.date || Date.now()),
      url: job.url || '#',
      source: 'apilayer',
      tags: this.extractTags(job.title, job.description),
      benefits: this.extractBenefits(job.description || '')
    }
  }

  private calculateAIResistance(title: string, description: string): number {
    // Same logic as JSearch
    const text = `${title} ${description || ''}`.toLowerCase()
    let score = 5

    const highResistanceKeywords = [
      'nurse', 'doctor', 'therapist', 'electrician', 'plumber', 'teacher',
      'hands-on', 'physical', 'creative', 'leadership', 'emergency'
    ]

    const lowResistanceKeywords = [
      'data entry', 'administrative', 'clerical', 'automated', 'routine'
    ]

    highResistanceKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 1.2
    })

    lowResistanceKeywords.forEach(keyword => {
      if (text.includes(keyword)) score -= 1.5
    })

    return Math.max(1, Math.min(10, Math.round(score)))
  }

  private extractRequirements(description: string): string[] {
    // Same logic as JSearch
    const requirements: string[] = []
    const patterns = [
      /(?:require[sd]?|must have)[^.]*?(?:degree|certification|experience|years?)/gi
    ]

    patterns.forEach(pattern => {
      const matches = description.match(pattern)
      if (matches) {
        requirements.push(...matches.slice(0, 3))
      }
    })

    return requirements.slice(0, 4)
  }

  private categorizeJob(title: string, description: string): string {
    // Same categorization logic
    const text = `${title} ${description || ''}`.toLowerCase()
    
    if (text.includes('healthcare') || text.includes('medical')) return 'Healthcare'
    if (text.includes('education') || text.includes('teacher')) return 'Education'  
    if (text.includes('trade') || text.includes('electrician')) return 'Skilled Trades'
    if (text.includes('creative') || text.includes('design')) return 'Creative Arts'
    
    return 'Other'
  }

  private determineExperience(title: string, description: string): 'entry' | 'mid' | 'senior' | 'executive' {
    // Same experience logic
    const text = `${title} ${description || ''}`.toLowerCase()
    
    if (text.includes('senior') || text.includes('lead')) return 'senior'
    if (text.includes('director') || text.includes('executive')) return 'executive'
    if (text.includes('entry') || text.includes('junior')) return 'entry'
    
    return 'mid'
  }

  private extractTags(title: string, description: string): string[] {
    // Same tag extraction
    const tags: string[] = []
    const text = `${title} ${description || ''}`.toLowerCase()

    AI_RESISTANT_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        tags.push(keyword)
      }
    })

    return [...new Set(tags)].slice(0, 6)
  }

  private extractBenefits(description: string): string[] {
    // Same benefits extraction
    const benefits: string[] = []
    const benefitKeywords = ['health insurance', 'dental', '401k', 'pto', 'bonus']

    const text = description.toLowerCase()
    benefitKeywords.forEach(benefit => {
      if (text.includes(benefit)) {
        benefits.push(benefit)
      }
    })

    return [...new Set(benefits)].slice(0, 5)
  }
}

// Job aggregator that combines all sources
export class JobAggregator {
  private sources: JobSource[] = []
  
  constructor() {
    this.initializeSources()
  }

  private initializeSources() {
    // Adzuna (already implemented in job-apis.ts)
    
    // JSearch API
    if (process.env.JSEARCH_API_KEY) {
      const jsearchAPI = new JSearchAPI(process.env.JSEARCH_API_KEY)
      this.sources.push({
        name: 'JSearch',
        enabled: true,
        rateLimit: 100, // per hour
        fetchJobs: (query, location, limit) => jsearchAPI.searchJobs(query, location, limit)
      })
    }

    // APILayer
    if (process.env.APILAYER_API_KEY) {
      const apilayerAPI = new APILayerAPI(process.env.APILAYER_API_KEY)
      this.sources.push({
        name: 'APILayer',
        enabled: true,
        rateLimit: 50, // per hour
        fetchJobs: (query, location) => apilayerAPI.searchJobs(query, location)
      })
    }
  }

  async aggregateJobs(queries: string[], location?: string): Promise<JobListing[]> {
    const allJobs: JobListing[] = []
    
    for (const source of this.sources.filter(s => s.enabled)) {
      try {
        console.log(`Fetching from ${source.name}...`)
        
        for (const query of queries.slice(0, 2)) { // Limit queries to avoid rate limits
          const jobs = await source.fetchJobs(query, location, 25)
          
          // Filter for high AI-resistance
          const aiResistantJobs = jobs.filter(job => job.aiResistanceScore >= 6)
          allJobs.push(...aiResistantJobs)
          
          // Rate limiting delay
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error)
      }
    }

    // Remove duplicates based on title + company
    const uniqueJobs = this.removeDuplicates(allJobs)
    
    // Sort by AI resistance score
    return uniqueJobs.sort((a, b) => b.aiResistanceScore - a.aiResistanceScore)
  }

  private removeDuplicates(jobs: JobListing[]): JobListing[] {
    const seen = new Set()
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase()}_${job.company.toLowerCase()}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  getEnabledSources(): string[] {
    return this.sources.filter(s => s.enabled).map(s => s.name)
  }
}

// High-priority AI-resistant job search queries
export const AI_RESISTANT_QUERIES = [
  'registered nurse healthcare',
  'physical therapist rehabilitation',
  'electrician skilled trades',
  'teacher education instructor',
  'plumber maintenance technician',
  'chef cook culinary',
  'counselor therapist mental health',
  'dental hygienist dentist',
  'massage therapist wellness',
  'carpenter construction worker',
  'mechanic automotive technician',
  'barber stylist beautician',
  'firefighter emergency services',
  'social worker case manager',
  'personal trainer fitness coach'
]