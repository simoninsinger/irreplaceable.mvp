import { Shield, Mail, Eye, Lock, Users, FileText } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Irreplaceable - How We Protect Your Data",
  description: "Read Irreplaceable's privacy policy to understand how we collect, use, and protect your personal information. Learn about your rights and our commitment to data privacy.",
  keywords: "privacy policy, data protection, personal information, user privacy, data security, GDPR compliance",
  authors: [{ name: "Irreplaceable" }],
  creator: "Irreplaceable",
  publisher: "Irreplaceable",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://irreplaceable.careers/privacy",
    title: "Privacy Policy | Irreplaceable",
    description: "Read our privacy policy to understand how we collect, use, and protect your personal information.",
    siteName: "Irreplaceable",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Irreplaceable",
    description: "Read our privacy policy to understand how we collect, use, and protect your personal information.",
    creator: "@irreplaceable_careers",
  },
  alternates: {
    canonical: "https://irreplaceable.careers/privacy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Your privacy matters to us. Here&apos;s how we protect and handle your personal information.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Overview */}
        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Privacy at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">We collect minimal data</h3>
              <p className="text-sm text-blue-700">Only what&apos;s needed to provide our services</p>
            </div>
            <div className="text-center">
              <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Your data is secure</h3>
              <p className="text-sm text-blue-700">Industry-standard security measures</p>
            </div>
            <div className="text-center">
              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">You have control</h3>
              <p className="text-sm text-blue-700">Access, update, or delete your data anytime</p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Information You Provide Directly</h3>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li><strong>Account Information:</strong> Name, email address, password, location, birth year</li>
              <li><strong>Profile Information:</strong> Career goals, skills, interests, experience level, bio</li>
              <li><strong>Application Tracking:</strong> Job applications, notes, status updates, interview dates</li>
              <li><strong>Assessment Data:</strong> Quiz responses and career matching results</li>
              <li><strong>Newsletter Subscription:</strong> Email address and career interests</li>
              <li><strong>Communications:</strong> Messages you send us through contact forms or support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Information We Collect Automatically</h3>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li><strong>Usage Data:</strong> Pages visited, time spent, features used, click patterns</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Cookies:</strong> Session management, preferences, and analytics (see Cookie section)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">To Provide Our Services</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Create and manage your account</li>
                  <li>• Provide personalized career assessments</li>
                  <li>• Track your job applications and progress</li>
                  <li>• Send newsletter content and updates</li>
                  <li>• Improve our matching algorithms</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">To Improve Our Platform</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Analyze usage patterns and preferences</li>
                  <li>• Develop new features and content</li>
                  <li>• Ensure security and prevent fraud</li>
                  <li>• Provide customer support</li>
                  <li>• Comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Information Sharing</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900">We do not sell your personal information.</span>
              </div>
              <p className="text-green-800">Your career data, applications, and personal information are never sold to third parties.</p>
            </div>

            <p className="text-gray-700 mb-4">We may share limited information only in these specific circumstances:</p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform (hosting, analytics, email services)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
              <li><strong>Safety:</strong> To protect the rights, property, or safety of Irreplaceable, users, or others</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Data Security</h2>
            <p className="text-gray-700 mb-6">
              We take the security of your personal information seriously and use industry-standard measures to protect it:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <Lock className="h-8 w-8 text-gray-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Technical Safeguards</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Encrypted data transmission (SSL/TLS)</li>
                  <li>• Secure password hashing</li>
                  <li>• Regular security updates</li>
                  <li>• Access controls and monitoring</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <Users className="h-8 w-8 text-gray-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Operational Safeguards</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Limited employee access to data</li>
                  <li>• Regular security training</li>
                  <li>• Incident response procedures</li>
                  <li>• Third-party security audits</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Your Rights and Choices</h2>
            <p className="text-gray-700 mb-6">You have the following rights regarding your personal information:</p>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-gray-900 mb-2">Access and Portability</h3>
                <p className="text-gray-700">Request a copy of your personal information in a portable format.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="font-semibold text-gray-900 mb-2">Correction</h3>
                <p className="text-gray-700">Update or correct inaccurate information through your profile settings.</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="font-semibold text-gray-900 mb-2">Deletion</h3>
                <p className="text-gray-700">Request deletion of your account and associated data.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="font-semibold text-gray-900 mb-2">Newsletter Unsubscribe</h3>
                <p className="text-gray-700">Unsubscribe from our newsletter at any time using the link in emails.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-6">
              We use cookies and similar technologies to improve your experience on our platform:
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cookie Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Essential</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Login sessions, security, basic functionality</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Session/30 days</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Analytics</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Usage patterns, performance improvement</td>
                    <td className="px-6 py-4 text-sm text-gray-700">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Preferences</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Remember your settings and preferences</td>
                    <td className="px-6 py-4 text-sm text-gray-700">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Children&apos;s Privacy</h2>
            <p className="text-gray-700 mb-4">
              Irreplaceable is designed for users who are at least 16 years old. We do not knowingly collect personal 
              information from children under 16. If we learn that we have collected such information, we will take 
              steps to delete it promptly.
            </p>
            <p className="text-gray-700">
              If you believe a child under 16 has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, 
              legal requirements, or other factors. We will:
            </p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• Post the updated policy on this page</li>
              <li>• Update the &ldquo;Last updated&rdquo; date at the top</li>
              <li>• Notify you of material changes via email or platform notification</li>
              <li>• Give you the opportunity to review changes before they take effect</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. International Data Transfers</h2>
            <p className="text-gray-700">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your personal information in accordance 
              with applicable data protection laws.
            </p>
          </section>

          <section className="mb-12 bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">10. Contact Us</h2>
            <p className="text-blue-800 mb-6">
              If you have questions about this Privacy Policy or how we handle your personal information, 
              please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Email</h3>
                <p className="text-blue-800">privacy@irreplaceable.careers</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Response Time</h3>
                <p className="text-blue-800">We respond within 5 business days</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}