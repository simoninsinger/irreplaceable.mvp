import { 
  Shield, 
  Heart, 
  Users, 
  TrendingUp, 
  Target,
  Award,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Irreplaceable - AI-Resistant Career Platform | Our Mission & Story",
  description: "Learn about Irreplaceable's mission to help professionals discover and transition into AI-resistant careers. Discover our story, values, and commitment to human-centered career development.",
  keywords: "about irreplaceable, AI-resistant careers mission, career platform story, human-centered careers, future-proof job platform",
  authors: [{ name: "Irreplaceable" }],
  creator: "Irreplaceable",
  publisher: "Irreplaceable",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://irreplaceable.careers/about",
    title: "About Irreplaceable - AI-Resistant Career Platform",
    description: "Learn about our mission to help professionals discover AI-resistant careers that celebrate uniquely human skills and build secure, fulfilling futures.",
    siteName: "Irreplaceable",
    images: [
      {
        url: "/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About Irreplaceable - Our Mission and Story",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Irreplaceable - AI-Resistant Career Platform",
    description: "Learn about our mission to help professionals discover AI-resistant careers that celebrate uniquely human skills.",
    images: ["/og-about.jpg"],
    creator: "@irreplaceable_careers",
  },
  alternates: {
    canonical: "https://irreplaceable.careers/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Building{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Irreplaceable
              </span>{" "}
              Careers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe that the most fulfilling and secure careers are those that celebrate uniquely human skills - 
              creativity, empathy, complex problem-solving, and personal connection.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                In an age where artificial intelligence is rapidly transforming the job market, 
                we&apos;re here to guide you toward careers that not only survive but thrive in the future economy.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Irreplaceable isn&apos;t just about job security - it&apos;s about finding meaningful work that leverages 
                what makes us fundamentally human. We believe the future belongs to those who can heal, create, 
                build, teach, and connect in ways that no machine ever could.
              </p>
              <div className="flex items-center space-x-3 text-blue-600">
                <Heart className="h-6 w-6" />
                <span className="font-semibold">Human-centered careers for a human-centered future</span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">By the Numbers</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">AI-Resistant Jobs Identified</span>
                  <span className="text-2xl font-bold text-blue-600">500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Career Categories</span>
                  <span className="text-2xl font-bold text-green-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Stories</span>
                  <span className="text-2xl font-bold text-purple-600">100+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Learning Resources</span>
                  <span className="text-2xl font-bold text-orange-600">50+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-lg text-gray-600">How we discovered the power of AI-resistant careers</p>
          </div>

          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="text-lg leading-relaxed mb-6">
              The idea for Irreplaceable was born from a simple but profound realization: while AI excels at 
              processing data and automating routine tasks, it struggles with the messy, beautiful complexity of human life.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              We watched as friends and colleagues worried about their careers being automated away, while others 
              in healthcare, skilled trades, and creative fields experienced unprecedented demand for their uniquely human skills.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              That&apos;s when we realized the solution wasn&apos;t to compete with AI - it was to focus on careers where 
              human connection, creativity, and complex problem-solving are not just valuable, but irreplaceable.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
              <p className="text-lg italic text-blue-900">
                &ldquo;The future doesn&apos;t belong to those who can do what machines can do better, 
                but to those who can do what only humans can do - with empathy, creativity, and soul.&rdquo;
              </p>
            </div>

            <p className="text-lg leading-relaxed">
              Today, Irreplaceable serves professionals across Colorado, Michigan, and beyond - helping them 
              discover, transition to, and thrive in careers that celebrate their humanity while building a 
              secure financial future.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Human-Centered</h3>
              <p className="text-gray-600">
                We believe that the best careers are those that celebrate and amplify uniquely human capabilities - 
                empathy, creativity, and meaningful connection.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Future-Proof</h3>
              <p className="text-gray-600">
                Every career path we recommend has been carefully evaluated for its resistance to automation 
                and its growth potential in the AI-driven economy.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized</h3>
              <p className="text-gray-600">
                Your career journey is unique. We provide personalized assessments, recommendations, 
                and guidance tailored to your specific skills, interests, and goals.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth-Minded</h3>
              <p className="text-gray-600">
                We don&apos;t just help you find a job - we help you build skills, develop expertise, 
                and create opportunities for long-term career growth and satisfaction.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community-Driven</h3>
              <p className="text-gray-600">
                Career transitions are easier with support. We&apos;re building a community of professionals 
                who share knowledge, opportunities, and encouragement.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We&apos;re committed to providing the highest quality career guidance, job opportunities, 
                and learning resources to help you achieve your professional goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-lg text-gray-600">
              We&apos;re not just another job board - we&apos;re your partner in building an AI-resistant career
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Resistance Analysis</h3>
                <p className="text-gray-600">
                  Every job and career path on our platform has been carefully evaluated for its resistance to 
                  AI automation, ensuring you invest your time in truly future-proof opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Career Support</h3>
                <p className="text-gray-600">
                  From initial assessment to job application tracking to business education - we support 
                  your entire career journey, not just job placement.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Education Focus</h3>
                <p className="text-gray-600">
                  Many AI-resistant careers offer entrepreneurial opportunities. We provide the business 
                  education and resources you need to build your own practice or company.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
                <p className="text-gray-600">
                  Our recommendations are backed by labor market data, industry trends, and real success 
                  stories from professionals who have successfully transitioned to AI-resistant careers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Build Your Irreplaceable Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are discovering meaningful, AI-resistant careers that 
            celebrate their humanity while building financial security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 font-semibold flex items-center justify-center space-x-2"
            >
              <span>Take Our Assessment</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/jobs"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-blue-500 font-semibold"
            >
              Browse AI-Resistant Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}