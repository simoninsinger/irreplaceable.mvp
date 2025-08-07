import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navigation } from "@/components/navigation"
import { Analytics } from "@/components/analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Irreplaceable - AI-Resistant Career Platform",
    template: "%s | Irreplaceable",
  },
  description: "Discover and pursue careers that won't be replaced by AI. Find jobs, learn skills, and build your irreplaceable future.",
  keywords: "AI-resistant careers, future-proof jobs, career platform, job search, skills training, physical therapy, skilled trades, human skills",
  authors: [{ name: "Irreplaceable" }],
  creator: "Irreplaceable",
  publisher: "Irreplaceable",
  robots: "index, follow",
  metadataBase: new URL("https://irreplaceable.careers"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://irreplaceable.careers",
    title: "Irreplaceable - AI-Resistant Career Platform",
    description: "Discover and pursue careers that won't be replaced by AI. Find jobs, learn skills, and build your irreplaceable future.",
    siteName: "Irreplaceable",
  },
  twitter: {
    card: "summary_large_image",
    title: "Irreplaceable - AI-Resistant Career Platform",
    description: "Discover and pursue careers that won't be replaced by AI. Find jobs, learn skills, and build your irreplaceable future.",
    creator: "@irreplaceable_careers",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Irreplaceable</h3>
                  <p className="text-gray-300">
                    Building careers that stand the test of time and technology.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Platform</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/jobs" className="hover:text-white">Find Jobs</a></li>
                    <li><a href="/assessment" className="hover:text-white">Career Assessment</a></li>
                    <li><a href="/learn" className="hover:text-white">Learn & Grow</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Resources</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                    <li><a href="/guides" className="hover:text-white">Guides</a></li>
                    <li><a href="/newsletter" className="hover:text-white">Newsletter</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/about" className="hover:text-white">About</a></li>
                    <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
                    <li><a href="/terms" className="hover:text-white">Terms</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 Irreplaceable. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
