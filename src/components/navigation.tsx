"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { 
  Shield, 
  Menu, 
  X, 
  Search, 
  BookOpen, 
  CheckCircle, 
  User,
  LogOut,
  Calculator,
  TrendingUp,
  Briefcase,
  Bell,
  DollarSign,
  Clock,
  BarChart3,
  Gift,
  Target,
  Building
} from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                Irreplaceable
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/jobs" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <Search className="h-4 w-4" />
              <span>Find Jobs</span>
            </Link>
            <Link 
              href="/assessment" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Assessment</span>
            </Link>
            <Link 
              href="/careers" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Careers</span>
            </Link>
            <Link 
              href="/roi-calculator" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <Calculator className="h-4 w-4" />
              <span>ROI Calculator</span>
            </Link>
            <Link 
              href="/job-alerts" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <Bell className="h-4 w-4" />
              <span>Job Alerts</span>
            </Link>
            <Link 
              href="/salary-negotiation" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <DollarSign className="h-4 w-4" />
              <span>Salary Tools</span>
            </Link>
            <Link 
              href="/career-transition" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <Clock className="h-4 w-4" />
              <span>Transitions</span>
            </Link>
            <Link 
              href="/market-trends" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Market Trends</span>
            </Link>
            <Link 
              href="/referrals" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <Gift className="h-4 w-4" />
              <span>Referrals</span>
            </Link>
            <Link 
              href="/skills-matching" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <Target className="h-4 w-4" />
              <span>Skills Match</span>
            </Link>
            <Link 
              href="/company-reviews" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <Building className="h-4 w-4" />
              <span>Reviews</span>
            </Link>
            <Link 
              href="/employers/post-job" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
            >
              <Briefcase className="h-4 w-4" />
              <span>Post Jobs</span>
            </Link>

            {/* User Authentication */}
            {status === "loading" ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <User className="h-4 w-4" />
                  <span>{session.user?.name || session.user?.email}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                  <Link 
                    href="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => signIn()}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </button>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/jobs"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="/assessment"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Assessment
            </Link>
            <Link
              href="/careers"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Careers
            </Link>
            <Link
              href="/roi-calculator"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              ROI Calculator
            </Link>
            <Link
              href="/job-alerts"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Job Alerts
            </Link>
            <Link
              href="/salary-negotiation"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Salary Tools
            </Link>
            <Link
              href="/career-transition"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Transitions
            </Link>
            <Link
              href="/market-trends"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Market Trends
            </Link>
            <Link
              href="/referrals"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Referrals
            </Link>
            <Link
              href="/skills-matching"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Skills Match
            </Link>
            <Link
              href="/company-reviews"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Reviews
            </Link>
            <Link
              href="/employers/post-job"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Post Jobs
            </Link>
            
            {session ? (
              <div className="pt-4 border-t">
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t space-y-1">
                <button
                  onClick={() => {
                    signIn()
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </button>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}