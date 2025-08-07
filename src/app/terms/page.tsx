import { FileText, Scale, Shield, Users, AlertCircle, CheckCircle } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Irreplaceable - Platform Usage Terms & Conditions",
  description: "Read Irreplaceable's terms of service to understand your rights and responsibilities when using our AI-resistant career platform and job search services.",
  keywords: "terms of service, terms and conditions, user agreement, platform rules, legal terms, service agreement",
  authors: [{ name: "Irreplaceable" }],
  creator: "Irreplaceable",
  publisher: "Irreplaceable",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://irreplaceable.careers/terms",
    title: "Terms of Service | Irreplaceable",
    description: "Read our terms of service to understand your rights and responsibilities when using our platform.",
    siteName: "Irreplaceable",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | Irreplaceable",
    description: "Read our terms of service to understand your rights and responsibilities when using our platform.",
    creator: "@irreplaceable_careers",
  },
  alternates: {
    canonical: "https://irreplaceable.careers/terms",
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">
              Please read these terms carefully before using our platform.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Summary */}
        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Terms Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Be Respectful</h3>
              <p className="text-sm text-blue-700">Use our platform professionally and treat others with respect</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Your Data is Protected</h3>
              <p className="text-sm text-blue-700">We safeguard your information per our Privacy Policy</p>
            </div>
            <div className="text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Fair Use</h3>
              <p className="text-sm text-blue-700">Use our services as intended for career development</p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using Irreplaceable ("we," "our," or "us"), you agree to be bound by these Terms of Service 
              ("Terms"). If you disagree with any part of these terms, you may not access our service.
            </p>
            <p className="text-gray-700">
              These Terms apply to all visitors, users, and others who access or use our platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Irreplaceable is a career platform that helps users discover, apply for, and transition into AI-resistant careers. 
              Our services include:
            </p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• Career assessment and matching services</li>
              <li>• Job search and application tracking tools</li>
              <li>• Educational content and career guidance</li>
              <li>• Newsletter and career insights</li>
              <li>• Community features and networking opportunities</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Accounts and Registration</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Creation</h3>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• You must be at least 16 years old to create an account</li>
              <li>• You must provide accurate and complete information</li>
              <li>• You are responsible for maintaining the security of your account</li>
              <li>• You must notify us immediately of any unauthorized use</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Responsibilities</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Keep your login credentials secure and confidential</li>
              <li>• Update your information to keep it current and accurate</li>
              <li>• Use your account only for lawful purposes</li>
              <li>• Do not share your account with others</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. User Conduct and Prohibited Uses</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-900">Prohibited Activities</span>
              </div>
              <p className="text-red-800">You agree not to engage in any of the following prohibited activities:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Platform Misuse</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Violate any applicable laws or regulations</li>
                  <li>• Impersonate others or provide false information</li>
                  <li>• Spam, harass, or abuse other users</li>
                  <li>• Distribute malware or harmful content</li>
                  <li>• Attempt to gain unauthorized access to systems</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Content Violations</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Post discriminatory or offensive content</li>
                  <li>• Share copyrighted material without permission</li>
                  <li>• Engage in commercial activities without approval</li>
                  <li>• Submit false job applications or information</li>
                  <li>• Scrape or collect user data without permission</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Content and Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Content</h3>
            <p className="text-gray-700 mb-4">
              You retain ownership of content you submit to our platform. By posting content, you grant us 
              a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content 
              in connection with our services.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Content</h3>
            <p className="text-gray-700 mb-4">
              All content on our platform, including text, graphics, logos, and software, is owned by 
              Irreplaceable or our licensors and is protected by copyright and other intellectual property laws.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900">Content Standards</span>
              </div>
              <p className="text-green-800">All user content must be professional, respectful, and relevant to career development.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Our collection, use, and protection of your personal information 
              is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p className="text-gray-700">
              By using our service, you consent to the collection and use of information in accordance 
              with our Privacy Policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Service Availability and Modifications</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Service Availability</h3>
            <p className="text-gray-700 mb-4">
              We strive to provide continuous service but do not guarantee uninterrupted access. 
              We may temporarily suspend service for maintenance, updates, or unforeseen circumstances.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Modifications to Service</h3>
            <p className="text-gray-700">
              We reserve the right to modify or discontinue any aspect of our service at any time, 
              with or without notice. We will not be liable for any modification, suspension, or discontinuation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Disclaimers and Limitations of Liability</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-900">Important Disclaimers</span>
              </div>
              <p className="text-yellow-800">Please read these limitations carefully as they affect your legal rights.</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Service Disclaimers</h3>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• Our service is provided "as is" without warranties of any kind</li>
              <li>• We do not guarantee job placement or career success</li>
              <li>• Career assessments are for guidance purposes only</li>
              <li>• Job listings are provided by third parties and may not be accurate</li>
              <li>• We are not responsible for employer actions or decisions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Limitation of Liability</h3>
            <p className="text-gray-700">
              To the maximum extent permitted by law, Irreplaceable shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including loss of profits, data, or use.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Account Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Termination by You</h3>
            <p className="text-gray-700 mb-4">
              You may terminate your account at any time by contacting us or using account deletion 
              features in your profile settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Termination by Us</h3>
            <p className="text-gray-700 mb-4">
              We may suspend or terminate your account if you violate these Terms, engage in prohibited 
              activities, or for any other reason we deem necessary to protect our service or users.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Effect of Termination</h3>
            <p className="text-gray-700">
              Upon termination, your access to the service will cease immediately. We may retain certain 
              information as required by law or for legitimate business purposes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Governing Law and Disputes</h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of the State of Colorado, without regard to conflict 
              of law principles. Any disputes will be resolved in the courts of Colorado.
            </p>
            <p className="text-gray-700">
              We encourage users to contact us first to resolve any disputes informally before pursuing legal action.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We may update these Terms from time to time. When we make changes, we will:
            </p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• Post the updated Terms on this page</li>
              <li>• Update the "Last updated" date at the top</li>
              <li>• Notify users of material changes via email or platform notification</li>
              <li>• Provide reasonable notice before changes take effect</li>
            </ul>
            <p className="text-gray-700">
              Your continued use of our service after changes become effective constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Severability and Entire Agreement</h2>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is found to be unenforceable, the remaining provisions 
              will remain in full force and effect.
            </p>
            <p className="text-gray-700">
              These Terms, together with our Privacy Policy, constitute the entire agreement between 
              you and Irreplaceable regarding the use of our service.
            </p>
          </section>

          <section className="mb-12 bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">13. Contact Information</h2>
            <p className="text-blue-800 mb-6">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Email</h3>
                <p className="text-blue-800">legal@irreplaceable.careers</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Response Time</h3>
                <p className="text-blue-800">We respond within 5 business days</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-blue-200">
              <p className="text-sm text-blue-700">
                For general support questions, please visit our <a href="/contact" className="underline hover:no-underline">Contact page</a> 
                or email support@irreplaceable.careers
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}