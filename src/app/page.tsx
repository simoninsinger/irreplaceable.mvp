import Link from "next/link"
import { Metadata } from "next"
import { 
  Shield, 
  Search, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight
} from "lucide-react"
import { NewsletterSignup } from "@/components/newsletter-signup"

export const metadata: Metadata = {
  title: "Irreplaceable - Build an AI-Resistant Career | Future-Proof Jobs & Career Platform",
  description: "Discover AI-resistant careers that celebrate your uniquely human skills. Find meaningful work, take career assessments, and build skills that will keep you valuable in the future economy.",
  keywords: "AI-resistant careers, future-proof jobs, career platform, physical therapy jobs, skilled trades, career assessment, job search, AI automation, human skills",
  authors: [{ name: "Irreplaceable" }],
  creator: "Irreplaceable",
  publisher: "Irreplaceable",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://irreplaceable.careers",
    title: "Irreplaceable - Build an AI-Resistant Career",
    description: "Discover AI-resistant careers that celebrate your uniquely human skills. Find meaningful work and build skills that will keep you valuable in the future economy.",
    siteName: "Irreplaceable",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Irreplaceable - AI-Resistant Career Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Irreplaceable - Build an AI-Resistant Career",
    description: "Discover AI-resistant careers that celebrate your uniquely human skills. Find meaningful work and build skills for the future economy.",
    images: ["/og-image.jpg"],
    creator: "@irreplaceable_careers",
  },
  alternates: {
    canonical: "https://irreplaceable.careers",
  },
  category: "Career Platform",
}

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Build an{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Irreplaceable
              </span>{" "}
              Career
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover AI-resistant careers, find meaningful work, and build skills that will keep you valuable in the future economy. Your career, your future, irreplaceable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/assessment"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center space-x-2 shadow-lg"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Take Assessment</span>
              </Link>
              <Link
                href="/jobs"
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 font-semibold flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Browse Jobs</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Irreplaceable?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We focus on careers that leverage uniquely human skills - creativity, empathy, complex problem-solving, and personal connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Resistant Focus
              </h3>
              <p className="text-gray-600">
                Every career path we feature has been carefully evaluated for its resistance to automation and AI replacement.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Personalized Matching
              </h3>
              <p className="text-gray-600">
                Our assessment analyzes your skills, interests, and goals to recommend the best AI-resistant career paths for you.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Skill Development
              </h3>
              <p className="text-gray-600">
                Access curated learning resources and business education to build the skills you need for your chosen career path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              AI-Resistant Career Categories
            </h2>
            <p className="text-lg text-gray-600">
              Explore careers that emphasize human creativity, empathy, and complex problem-solving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Healthcare & Wellness", count: "1,200+", color: "bg-red-500" },
              { name: "Skilled Trades", count: "800+", color: "bg-orange-500" },
              { name: "Creative Arts", count: "600+", color: "bg-purple-500" },
              { name: "Human Services", count: "900+", color: "bg-green-500" },
              { name: "Education & Training", count: "700+", color: "bg-blue-500" },
              { name: "Sales & Relations", count: "1,100+", color: "bg-indigo-500" },
              { name: "Leadership & Management", count: "500+", color: "bg-pink-500" },
              { name: "Entrepreneurship", count: "300+", color: "bg-yellow-500" },
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">{category.count}</p>
                <p className="text-sm text-gray-600">jobs available</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Irreplaceable Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are future-proofing their careers with AI-resistant skills and opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 font-semibold flex items-center justify-center space-x-2"
            >
              <span>Start Your Assessment</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/newsletter"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-blue-500 font-semibold"
            >
              Join Newsletter
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              Real people building irreplaceable careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Physical Therapist",
                quote: "Found my calling in healthcare through Irreplaceable. The personal assessment helped me realize my passion for helping people heal.",
              },
              {
                name: "Mike Rodriguez",
                role: "Master Electrician",
                quote: "Transitioned from office work to skilled trades. Now I have job security and work I'm genuinely passionate about.",
              },
              {
                name: "Elena Foster",
                role: "Art Therapist",
                quote: "Combined my creativity with human connection. This platform showed me careers I never knew existed.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup 
            title="Stay Ahead of the AI Revolution"
            description="Join 5,000+ professionals getting weekly insights on AI-resistant careers, job opportunities, and market trends."
          />
        </div>
      </section>
    </div>
  )
}
