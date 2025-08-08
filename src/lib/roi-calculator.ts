// ROI Calculator for Career Investment Analysis
export interface EducationCost {
  type: 'certificate' | 'associate' | 'bachelor' | 'master' | 'doctorate' | 'bootcamp' | 'apprenticeship'
  duration: number // in months
  tuitionCost: number
  materialsAndFees: number
  livingExpenses: number // opportunity cost
  opportunityCost: number // lost wages during study
  certification?: {
    name: string
    cost: number
    renewalCost?: number
    renewalPeriod?: number // years
  }[]
}

export interface CareerROI {
  careerId: string
  careerTitle: string
  educationOptions: EducationCost[]
  averageSalary: {
    entry: number
    mid: number
    senior: number
    executive: number
  }
  salaryGrowthRate: number // annual percentage
  jobSecurity: number // 1-10 scale
  aiResistanceScore: number
  geographicFactors: {
    location: string
    salaryMultiplier: number
    costOfLivingIndex: number
  }[]
  industryGrowth: number // percentage
}

export interface ROICalculation {
  totalEducationCost: number
  timeToBreakeven: number // in years
  lifetimeROI: number
  netPresentValue: number
  annualizedReturn: number
  paybackPeriod: number
  riskAdjustedReturn: number
  comparisonMetrics: {
    vsCurrentSalary?: number
    vsOtherCareers?: number
    vsStockMarket?: number // 7% average
  }
}

// Real education cost data for different career paths
export const EDUCATION_COSTS: Record<string, EducationCost[]> = {
  'healthcare_nursing': [
    {
      type: 'associate',
      duration: 24,
      tuitionCost: 15000,
      materialsAndFees: 3000,
      livingExpenses: 48000, // 24 months * $2k/month
      opportunityCost: 60000, // 24 months * $30k/year
      certification: [
        { name: 'RN License', cost: 300, renewalCost: 100, renewalPeriod: 2 },
        { name: 'BLS Certification', cost: 75, renewalCost: 75, renewalPeriod: 2 }
      ]
    },
    {
      type: 'bachelor',
      duration: 48,
      tuitionCost: 45000,
      materialsAndFees: 8000,
      livingExpenses: 96000,
      opportunityCost: 120000,
      certification: [
        { name: 'RN License', cost: 300, renewalCost: 100, renewalPeriod: 2 },
        { name: 'BLS Certification', cost: 75, renewalCost: 75, renewalPeriod: 2 }
      ]
    }
  ],
  'trades_electrician': [
    {
      type: 'apprenticeship',
      duration: 48,
      tuitionCost: 8000,
      materialsAndFees: 5000,
      livingExpenses: 0, // apprentices earn while learning
      opportunityCost: -60000, // negative because they earn during apprenticeship
      certification: [
        { name: 'Journeyman License', cost: 150, renewalCost: 100, renewalPeriod: 3 },
        { name: 'OSHA 30', cost: 200, renewalCost: 200, renewalPeriod: 5 }
      ]
    },
    {
      type: 'certificate',
      duration: 12,
      tuitionCost: 15000,
      materialsAndFees: 3000,
      livingExpenses: 24000,
      opportunityCost: 30000,
      certification: [
        { name: 'Electrician Certificate', cost: 200, renewalCost: 150, renewalPeriod: 3 }
      ]
    }
  ],
  'creative_therapist': [
    {
      type: 'master',
      duration: 30,
      tuitionCost: 65000,
      materialsAndFees: 5000,
      livingExpenses: 60000,
      opportunityCost: 100000,
      certification: [
        { name: 'PT License', cost: 400, renewalCost: 200, renewalPeriod: 2 },
        { name: 'CPR Certification', cost: 50, renewalCost: 50, renewalPeriod: 2 }
      ]
    }
  ],
  'education_teacher': [
    {
      type: 'bachelor',
      duration: 48,
      tuitionCost: 40000,
      materialsAndFees: 6000,
      livingExpenses: 96000,
      opportunityCost: 120000,
      certification: [
        { name: 'Teaching License', cost: 250, renewalCost: 150, renewalPeriod: 5 }
      ]
    },
    {
      type: 'master',
      duration: 24,
      tuitionCost: 35000,
      materialsAndFees: 4000,
      livingExpenses: 48000,
      opportunityCost: 80000,
      certification: [
        { name: 'Teaching License', cost: 250, renewalCost: 150, renewalPeriod: 5 }
      ]
    }
  ],
  'tech_cybersecurity': [
    {
      type: 'bootcamp',
      duration: 6,
      tuitionCost: 15000,
      materialsAndFees: 2000,
      livingExpenses: 12000,
      opportunityCost: 15000,
      certification: [
        { name: 'Security+', cost: 350, renewalCost: 350, renewalPeriod: 3 },
        { name: 'CISSP', cost: 750, renewalCost: 125, renewalPeriod: 1 }
      ]
    },
    {
      type: 'bachelor',
      duration: 48,
      tuitionCost: 50000,
      materialsAndFees: 10000,
      livingExpenses: 96000,
      opportunityCost: 120000,
      certification: [
        { name: 'Security+', cost: 350, renewalCost: 350, renewalPeriod: 3 }
      ]
    }
  ]
}

export class ROICalculator {
  private discountRate = 0.04 // 4% discount rate for NPV calculations
  private stockMarketReturn = 0.07 // 7% average stock market return

  calculateROI(
    careerId: string,
    educationOption: EducationCost,
    careerData: CareerROI,
    currentSalary: number = 35000,
    location: string = 'national',
    timeHorizon: number = 20 // years
  ): ROICalculation {
    
    // Calculate total education cost
    const totalEducationCost = this.calculateTotalEducationCost(educationOption)
    
    // Get location-adjusted salary data
    const locationFactor = this.getLocationFactor(careerData, location)
    const adjustedSalary = {
      entry: careerData.averageSalary.entry * locationFactor.salaryMultiplier,
      mid: careerData.averageSalary.mid * locationFactor.salaryMultiplier,
      senior: careerData.averageSalary.senior * locationFactor.salaryMultiplier,
      executive: careerData.averageSalary.executive * locationFactor.salaryMultiplier
    }

    // Calculate career progression timeline
    const careerProgression = this.calculateCareerProgression(adjustedSalary, careerData.salaryGrowthRate)
    
    // Calculate net present value over time horizon
    const npv = this.calculateNPV(
      totalEducationCost,
      careerProgression,
      currentSalary,
      timeHorizon,
      educationOption.duration
    )

    // Calculate breakeven time
    const timeToBreakeven = this.calculateBreakevenTime(
      totalEducationCost,
      careerProgression,
      currentSalary,
      educationOption.duration
    )

    // Calculate lifetime ROI (40-year career)
    const lifetimeROI = this.calculateLifetimeROI(
      totalEducationCost,
      careerProgression,
      currentSalary,
      40,
      educationOption.duration
    )

    // Calculate annualized return
    const annualizedReturn = Math.pow(1 + lifetimeROI, 1/timeHorizon) - 1

    // Risk-adjusted return (factor in job security and AI resistance)
    const riskFactor = (careerData.jobSecurity / 10) * (careerData.aiResistanceScore / 10)
    const riskAdjustedReturn = annualizedReturn * riskFactor

    return {
      totalEducationCost,
      timeToBreakeven,
      lifetimeROI,
      netPresentValue: npv,
      annualizedReturn,
      paybackPeriod: timeToBreakeven,
      riskAdjustedReturn,
      comparisonMetrics: {
        vsCurrentSalary: adjustedSalary.entry - currentSalary,
        vsStockMarket: annualizedReturn - this.stockMarketReturn
      }
    }
  }

  private calculateTotalEducationCost(education: EducationCost): number {
    let totalCost = education.tuitionCost + education.materialsAndFees + 
                   education.livingExpenses + education.opportunityCost

    // Add certification costs
    if (education.certification) {
      education.certification.forEach(cert => {
        totalCost += cert.cost
        // Add 10 years of renewal costs
        if (cert.renewalCost && cert.renewalPeriod) {
          const renewals = Math.floor(10 / cert.renewalPeriod)
          totalCost += renewals * cert.renewalCost
        }
      })
    }

    return Math.max(0, totalCost) // Ensure non-negative (apprenticeships can have negative opportunity cost)
  }

  private getLocationFactor(careerData: CareerROI, location: string) {
    const locationData = careerData.geographicFactors.find(
      geo => geo.location.toLowerCase() === location.toLowerCase()
    )
    
    return locationData || { 
      location: 'National Average', 
      salaryMultiplier: 1.0, 
      costOfLivingIndex: 1.0 
    }
  }

  private calculateCareerProgression(salaries: any, growthRate: number): number[] {
    const progression: number[] = []
    
    // Career stages: Entry (0-3 years), Mid (4-10 years), Senior (11-20 years), Executive (21+ years)
    for (let year = 0; year < 40; year++) {
      let baseSalary: number
      
      if (year <= 3) {
        baseSalary = salaries.entry
      } else if (year <= 10) {
        baseSalary = salaries.mid
      } else if (year <= 20) {
        baseSalary = salaries.senior
      } else {
        baseSalary = salaries.executive
      }
      
      // Apply annual growth rate
      const adjustedSalary = baseSalary * Math.pow(1 + growthRate, year)
      progression.push(adjustedSalary)
    }
    
    return progression
  }

  private calculateNPV(
    initialCost: number,
    careerProgression: number[],
    currentSalary: number,
    timeHorizon: number,
    educationDuration: number
  ): number {
    let npv = -initialCost // Initial investment
    const educationYears = Math.ceil(educationDuration / 12)
    
    // Assume current salary continues during education + small growth
    for (let year = 0; year < educationYears; year++) {
      const currentIncome = currentSalary * Math.pow(1.03, year) // 3% annual growth
      const discountedValue = currentIncome / Math.pow(1 + this.discountRate, year + 1)
      npv -= discountedValue // Lost income during education
    }
    
    // Add future career earnings (after education)
    for (let year = educationYears; year < timeHorizon; year++) {
      const newCareerIncome = careerProgression[year - educationYears] || careerProgression[careerProgression.length - 1]
      const currentCareerIncome = currentSalary * Math.pow(1.03, year)
      const incrementalIncome = newCareerIncome - currentCareerIncome
      
      const discountedValue = incrementalIncome / Math.pow(1 + this.discountRate, year + 1)
      npv += discountedValue
    }
    
    return npv
  }

  private calculateBreakevenTime(
    initialCost: number,
    careerProgression: number[],
    currentSalary: number,
    educationDuration: number
  ): number {
    let cumulativeCost = initialCost
    const educationYears = Math.ceil(educationDuration / 12)
    
    // Add lost income during education
    for (let year = 0; year < educationYears; year++) {
      cumulativeCost += currentSalary * Math.pow(1.03, year)
    }
    
    let cumulativeBenefit = 0
    
    for (let year = educationYears; year < 40; year++) {
      const newCareerIncome = careerProgression[year - educationYears]
      const currentCareerIncome = currentSalary * Math.pow(1.03, year)
      const annualBenefit = newCareerIncome - currentCareerIncome
      
      if (annualBenefit <= 0) continue
      
      cumulativeBenefit += annualBenefit
      
      if (cumulativeBenefit >= cumulativeCost) {
        return year + 1 // Add 1 because we're counting from year 0
      }
    }
    
    return -1 // Never breaks even
  }

  private calculateLifetimeROI(
    initialCost: number,
    careerProgression: number[],
    currentSalary: number,
    timeHorizon: number,
    educationDuration: number
  ): number {
    let totalNewCareerEarnings = 0
    let totalCurrentCareerEarnings = 0
    const educationYears = Math.ceil(educationDuration / 12)
    
    // Calculate total earnings for both career paths
    for (let year = 0; year < timeHorizon; year++) {
      if (year < educationYears) {
        // During education: current job income
        totalCurrentCareerEarnings += currentSalary * Math.pow(1.03, year)
        totalNewCareerEarnings += 0 // No income during education
      } else {
        // After education
        const newCareerIncome = careerProgression[year - educationYears] || careerProgression[careerProgression.length - 1]
        const currentCareerIncome = currentSalary * Math.pow(1.03, year)
        
        totalNewCareerEarnings += newCareerIncome
        totalCurrentCareerEarnings += currentCareerIncome
      }
    }
    
    const netBenefit = totalNewCareerEarnings - totalCurrentCareerEarnings - initialCost
    return netBenefit / initialCost // ROI as a ratio
  }

  // Compare multiple education options for the same career
  compareEducationOptions(careerId: string, careerData: CareerROI, currentSalary: number = 35000): ROICalculation[] {
    const educationOptions = EDUCATION_COSTS[careerId] || []
    
    return educationOptions.map(option => 
      this.calculateROI(careerId, option, careerData, currentSalary)
    )
  }

  // Get formatted results for display
  formatROIResults(roi: ROICalculation): any {
    return {
      investment: {
        totalCost: this.formatCurrency(roi.totalEducationCost),
        paybackPeriod: roi.paybackPeriod > 0 
          ? `${roi.paybackPeriod.toFixed(1)} years` 
          : 'Never breaks even'
      },
      returns: {
        lifetimeROI: this.formatPercentage(roi.lifetimeROI),
        annualizedReturn: this.formatPercentage(roi.annualizedReturn),
        riskAdjustedReturn: this.formatPercentage(roi.riskAdjustedReturn),
        npv: this.formatCurrency(roi.netPresentValue)
      },
      comparison: {
        vsStockMarket: roi.comparisonMetrics.vsStockMarket 
          ? this.formatPercentage(roi.comparisonMetrics.vsStockMarket)
          : 'N/A',
        salaryIncrease: roi.comparisonMetrics.vsCurrentSalary
          ? this.formatCurrency(roi.comparisonMetrics.vsCurrentSalary)
          : 'N/A'
      },
      recommendation: this.getRecommendation(roi)
    }
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  private formatPercentage(rate: number): string {
    return `${(rate * 100).toFixed(1)}%`
  }

  private getRecommendation(roi: ROICalculation): { rating: string; message: string; color: string } {
    if (roi.paybackPeriod < 0) {
      return {
        rating: 'Poor Investment',
        message: 'This career path may not provide positive returns',
        color: 'red'
      }
    } else if (roi.paybackPeriod <= 5 && roi.annualizedReturn > 0.1) {
      return {
        rating: 'Excellent Investment',
        message: 'Strong returns with reasonable payback period',
        color: 'green'
      }
    } else if (roi.paybackPeriod <= 8 && roi.annualizedReturn > 0.07) {
      return {
        rating: 'Good Investment',
        message: 'Solid returns that outperform market average',
        color: 'blue'
      }
    } else if (roi.paybackPeriod <= 12) {
      return {
        rating: 'Fair Investment',
        message: 'Moderate returns with longer payback period',
        color: 'yellow'
      }
    } else {
      return {
        rating: 'Risky Investment',
        message: 'Long payback period - consider alternatives',
        color: 'orange'
      }
    }
  }
}

// Sample career data for ROI calculations
export const SAMPLE_CAREER_DATA: Record<string, CareerROI> = {
  'healthcare_nursing': {
    careerId: 'healthcare_nursing',
    careerTitle: 'Registered Nurse',
    educationOptions: EDUCATION_COSTS['healthcare_nursing'],
    averageSalary: {
      entry: 62000,
      mid: 75000,
      senior: 88000,
      executive: 105000
    },
    salaryGrowthRate: 0.035,
    jobSecurity: 9,
    aiResistanceScore: 9,
    geographicFactors: [
      { location: 'National Average', salaryMultiplier: 1.0, costOfLivingIndex: 1.0 },
      { location: 'San Francisco', salaryMultiplier: 1.4, costOfLivingIndex: 1.6 },
      { location: 'New York', salaryMultiplier: 1.3, costOfLivingIndex: 1.5 },
      { location: 'Austin', salaryMultiplier: 1.1, costOfLivingIndex: 1.1 },
      { location: 'Atlanta', salaryMultiplier: 0.95, costOfLivingIndex: 0.9 }
    ],
    industryGrowth: 0.07
  },
  'trades_electrician': {
    careerId: 'trades_electrician',
    careerTitle: 'Electrician',
    educationOptions: EDUCATION_COSTS['trades_electrician'],
    averageSalary: {
      entry: 48000,
      mid: 65000,
      senior: 82000,
      executive: 95000
    },
    salaryGrowthRate: 0.04,
    jobSecurity: 9,
    aiResistanceScore: 9,
    geographicFactors: [
      { location: 'National Average', salaryMultiplier: 1.0, costOfLivingIndex: 1.0 },
      { location: 'San Francisco', salaryMultiplier: 1.5, costOfLivingIndex: 1.6 },
      { location: 'New York', salaryMultiplier: 1.4, costOfLivingIndex: 1.5 },
      { location: 'Austin', salaryMultiplier: 1.2, costOfLivingIndex: 1.1 },
      { location: 'Atlanta', salaryMultiplier: 0.9, costOfLivingIndex: 0.9 }
    ],
    industryGrowth: 0.08
  }
}