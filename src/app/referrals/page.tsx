"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  Gift, 
  Copy, 
  Check,
  DollarSign,
  UserPlus,
  Clock,
  Trophy,
  Share2,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Star,
  Target,
  TrendingUp
} from "lucide-react"

interface ReferralData {
  referralCode: string
  stats: {
    totalReferrals: number
    completedReferrals: number
    pendingReferrals: number
    totalRewards: number
    codeUses: number
    maxUses: number
  }
  referrals: Referral[]
}

interface Referral {
  id: string
  referrerEmail: string
  referredEmail: string
  referredName: string
  status: 'pending' | 'registered' | 'completed'
  referralCode: string
  createdAt: string
  completedAt?: string
  reward?: number
}

export default function ReferralsPage() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showReferForm, setShowReferForm] = useState(false)
  const [copied, setCopied] = useState(false)

  // Refer form state
  const [referForm, setReferForm] = useState({
    referredName: "",
    referredEmail: ""
  })

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail') || ""
    setUserEmail(storedEmail)
    if (storedEmail) {
      fetchReferralData(storedEmail)
    }
  }, [])

  const fetchReferralData = async (email: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/referrals?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (data.success) {
        setReferralData(data.data)
      }
    } catch (error) {
      console.error('Error fetching referral data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          referrerEmail: userEmail,
          referredEmail: referForm.referredEmail,
          referredName: referForm.referredName,
          referralCode: referralData?.referralCode
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage("Referral sent successfully!")
        setShowReferForm(false)
        setReferForm({ referredName: "", referredEmail: "" })
        fetchReferralData(userEmail)
      } else {
        setMessage(data.message || "Error sending referral")
      }
    } catch (error) {
      setMessage("Error sending referral")
    } finally {
      setIsLoading(false)
    }
  }

  const copyReferralCode = async () => {
    if (referralData?.referralCode) {
      await navigator.clipboard.writeText(referralData.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyReferralLink = async () => {
    const link = `${window.location.origin}?ref=${referralData?.referralCode}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaEmail = () => {
    const subject = "Join me on this amazing AI-resistant career platform!"
    const body = `Hi!

I've been using Irreplaceable to find AI-resistant career opportunities, and I think you'd love it too!

Use my referral code: ${referralData?.referralCode}
Or click this link: ${window.location.origin}?ref=${referralData?.referralCode}

The platform helps you find careers that AI can't replace - like nursing, skilled trades, teaching, and more. Plus we both get rewards when you sign up!

Check it out!`

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'registered': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Trophy className="h-4 w-4" />
      case 'registered': return <UserPlus className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center mb-6">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Enter Your Email</h2>
            <p className="text-gray-600">We need your email to set up your referral program</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault()
            const email = (e.target as any).email.value
            localStorage.setItem('userEmail', email)
            setUserEmail(email)
            fetchReferralData(email)
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
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Gift className="h-8 w-8 mr-3 text-purple-600" />
              Referral Program
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Help others discover AI-resistant careers and earn rewards when they join our platform!
            </p>
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

        {/* Stats Overview */}
        {referralData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                  <p className="text-2xl font-bold text-gray-900">{referralData.stats.totalReferrals}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{referralData.stats.completedReferrals}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900">${referralData.stats.totalRewards}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Code Uses</p>
                  <p className="text-2xl font-bold text-gray-900">{referralData.stats.codeUses}/{referralData.stats.maxUses}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Share Your Code Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Referral Code</h2>
              
              {referralData && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">Your Referral Code</p>
                        <p className="text-2xl font-bold text-blue-900 font-mono">{referralData.referralCode}</p>
                      </div>
                      <button
                        onClick={copyReferralCode}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={copyReferralLink}
                      className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200"
                    >
                      <Link2 className="h-4 w-4" />
                      <span>Copy Link</span>
                    </button>
                    
                    <button
                      onClick={shareViaEmail}
                      className="flex items-center justify-center space-x-2 bg-purple-100 text-purple-700 px-4 py-3 rounded-lg hover:bg-purple-200"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Share via Email</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Referral Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Refer Someone Directly</h3>
                <button
                  onClick={() => setShowReferForm(!showReferForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Refer Friend</span>
                </button>
              </div>

              {showReferForm && (
                <form onSubmit={createReferral} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Friend's Name
                    </label>
                    <input
                      type="text"
                      value={referForm.referredName}
                      onChange={(e) => setReferForm(prev => ({ ...prev, referredName: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Friend's Email
                    </label>
                    <input
                      type="email"
                      value={referForm.referredEmail}
                      onChange={(e) => setReferForm(prev => ({ ...prev, referredEmail: e.target.value }))}
                      placeholder="john@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400"
                    >
                      {isLoading ? 'Sending...' : 'Send Referral'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReferForm(false)}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Referral History & Program Info */}
          <div className="space-y-6">
            {/* Program Info */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                How It Works
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-purple-900">Share Your Code</h4>
                    <p className="text-purple-700">Share your referral code or link with friends interested in AI-resistant careers.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-purple-900">They Join</h4>
                    <p className="text-purple-700">When they sign up using your code, they get access to our platform.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-purple-900">You Both Earn</h4>
                    <p className="text-purple-700">Get $50 rewards when they complete their profile and find their first job!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Referrals</h3>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading referrals...</p>
                </div>
              ) : referralData && referralData.referrals.length > 0 ? (
                <div className="space-y-3">
                  {referralData.referrals.map(referral => (
                    <div key={referral.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{referral.referredName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(referral.status)}`}>
                          {getStatusIcon(referral.status)}
                          <span className="capitalize">{referral.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{referral.referredEmail}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Referred: {new Date(referral.createdAt).toLocaleDateString()}</span>
                        {referral.reward && (
                          <span className="text-green-600 font-medium">+${referral.reward}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p>No referrals yet. Start sharing your code!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Refer Friends?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Rewards</h3>
              <p className="text-gray-600">Get $50 for each successful referral who finds their AI-resistant career.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Help Friends</h3>
              <p className="text-gray-600">Give your friends access to secure, AI-resistant career opportunities.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Network</h3>
              <p className="text-gray-600">Create a network of professionals in AI-resistant fields for mutual support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}