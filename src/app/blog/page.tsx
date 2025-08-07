import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  TrendingUp,
  Users,
  Shield,
  Lightbulb,
  Target
} from "lucide-react"

export const metadata: Metadata = {
  title: "Career Insights Blog | AI-Resistant Careers & Future of Work | Irreplaceable",
  description: "Expert insights on AI-resistant careers, industry trends, and career guidance. Discover which jobs will thrive in the AI economy and how to build a future-proof career.",
  keywords: "AI-resistant careers blog, future of work, physical therapy careers, skilled trades, career insights, job market trends, career transition, human skills",
  authors: [{ name: "Irreplaceable" }],
  creator: "Irreplaceable",
  publisher: "Irreplaceable",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://irreplaceable.careers/blog",
    title: "Career Insights Blog - AI-Resistant Careers & Future of Work",
    description: "Expert insights on AI-resistant careers, industry trends, and career guidance. Discover which jobs will thrive in the AI economy.",
    siteName: "Irreplaceable",
    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Irreplaceable Career Insights Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Insights Blog - AI-Resistant Careers & Future of Work",
    description: "Expert insights on AI-resistant careers, industry trends, and career guidance. Discover which jobs will thrive in the AI economy.",
    images: ["/og-blog.jpg"],
    creator: "@irreplaceable_careers",
  },
  alternates: {
    canonical: "https://irreplaceable.careers/blog",
  },
}

// Blog post data - in a real app, this would come from a CMS or database
const blogPosts = [
  {
    slug: "top-10-ai-resistant-careers-2025",
    title: "Top 10 AI-Resistant Careers That Will Thrive in 2025",
    excerpt: "Discover the careers that leverage uniquely human skills and will continue to grow despite AI automation. From healthcare to skilled trades, these opportunities offer both security and fulfillment.",
    author: "Sarah Martinez",
    publishedAt: "2025-01-15",
    readTime: 8,
    category: "Career Insights",
    featured: true,
    tags: ["AI-Resistant", "Career Planning", "Future of Work"],
    image: "/blog/ai-resistant-careers.jpg" // placeholder
  },
  {
    slug: "why-physical-therapy-is-future-proof",
    title: "Why Physical Therapy is the Ultimate Future-Proof Career",
    excerpt: "Physical therapists combine medical expertise with human touch and emotional intelligence. Learn why this field is experiencing explosive growth and why AI can't replace the healing power of human connection.",
    author: "Dr. Michael Chen",
    publishedAt: "2025-01-10",
    readTime: 6,
    category: "Healthcare",
    featured: true,
    tags: ["Physical Therapy", "Healthcare", "Human Touch"],
    image: "/blog/physical-therapy.jpg" // placeholder
  },
  {
    slug: "skilled-trades-ai-automation-boom",
    title: "The Skilled Trades Boom: Why Electricians, Plumbers, and HVAC Technicians Are in High Demand",
    excerpt: "While AI transforms office work, skilled trades professionals are experiencing unprecedented demand and salary growth. Explore why these hands-on careers offer excellent prospects and how to break into them.",
    author: "Tom Rodriguez",
    publishedAt: "2025-01-05",
    readTime: 7,
    category: "Skilled Trades",
    featured: false,
    tags: ["Skilled Trades", "Career Change", "High Demand"],
    image: "/blog/skilled-trades.jpg" // placeholder
  },
  {
    slug: "creative-careers-ai-collaboration",
    title: "Creative Careers in the AI Age: How Artists and Designers Are Adapting and Thriving",
    excerpt: "AI isn't replacing creative professionals—it's becoming their most powerful tool. Learn how graphic designers, artists, and creative directors are leveraging AI to enhance their uniquely human creativity.",
    author: "Emma Thompson",
    publishedAt: "2024-12-28",
    readTime: 9,
    category: "Creative Arts",
    featured: false,
    tags: ["Creative Arts", "AI Collaboration", "Design"],
    image: "/blog/creative-careers.jpg" // placeholder
  },
  {
    slug: "career-transition-guide-ai-resistant",
    title: "The Complete Guide to Transitioning into an AI-Resistant Career",
    excerpt: "Ready to future-proof your career but don't know where to start? This comprehensive guide covers everything from skills assessment to training programs to landing your first role in an AI-resistant field.",
    author: "Lisa Park",
    publishedAt: "2024-12-20",
    readTime: 12,
    category: "Career Planning",
    featured: false,
    tags: ["Career Transition", "Planning", "Skills Development"],
    image: "/blog/career-transition.jpg" // placeholder
  }
]

const categories = [
  { name: "All Posts", count: blogPosts.length, icon: BookOpen },
  { name: "Career Insights", count: 2, icon: TrendingUp },
  { name: "Healthcare", count: 1, icon: Shield },
  { name: "Skilled Trades", count: 1, icon: Target },
  { name: "Creative Arts", count: 1, icon: Lightbulb },
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Career Insights Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert insights, career guidance, and industry trends for building an AI-resistant, 
              future-proof career that celebrates your uniquely human skills.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <article 
                      key={post.slug}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-blue-600" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {post.category}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime} min read
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                          >
                            <span>Read More</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* All Posts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
              <div className="space-y-6">
                {regularPosts.map((post) => (
                  <article 
                    key={post.slug}
                    className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow group"
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                              {post.category}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {post.readTime} min read
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </div>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                            >
                              <span>Read Article</span>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <category.icon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Stay Updated</h3>
              <p className="text-sm text-blue-800 mb-4">
                Get weekly career insights and new blog posts delivered to your inbox.
              </p>
              <Link
                href="/newsletter"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors text-center block"
              >
                Subscribe to Newsletter
              </Link>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["AI-Resistant", "Career Planning", "Healthcare", "Skilled Trades", "Future of Work", "Career Change", "Skills Development"].map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/assessment" className="block text-sm text-blue-600 hover:text-blue-700">
                  Take Career Assessment
                </Link>
                <Link href="/jobs" className="block text-sm text-blue-600 hover:text-blue-700">
                  Browse AI-Resistant Jobs
                </Link>
                <Link href="/learn" className="block text-sm text-blue-600 hover:text-blue-700">
                  Learning Resources
                </Link>
                <Link href="/about" className="block text-sm text-blue-600 hover:text-blue-700">
                  About Irreplaceable
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}