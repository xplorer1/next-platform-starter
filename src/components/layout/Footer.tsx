import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* JobPlat Info */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center" aria-hidden="true">
                <span className="text-white font-bold text-sm">CMU</span>
              </div>
              <div>
                <span className="text-xl font-bold">JobPlat</span>
                <span className="text-gray-400 ml-2">Job Board</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md leading-relaxed">
              Connecting Carnegie Mellon University Africa graduates and students 
              with exceptional career opportunities across Rwanda and East Africa.
            </p>
            <address className="text-sm text-gray-400 not-italic">
              <p>Carnegie Mellon University Africa</p>
              <p>Kigali Innovation City</p>
              <p>Kigali, Rwanda</p>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav aria-label="Quick links">
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link 
                    href="/jobs" 
                    className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors duration-200 inline-block py-1"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/companies" 
                    className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors duration-200 inline-block py-1"
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors duration-200 inline-block py-1"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors duration-200 inline-block py-1"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <nav aria-label="Resources">
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link 
                    href="/career-services" 
                    className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors duration-200 inline-block py-1"
                  >
                    Career Services
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/alumni-network" 
                    className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors duration-200 inline-block py-1"
                  >
                    Alumni Network
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/help" 
                    className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors duration-200 inline-block py-1"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://www.cmu.edu/africa/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors duration-200 inline-block py-1"
                    aria-label="JobPlat Website (opens in new tab)"
                  >
                    JobPlat Website
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm text-center sm:text-left">
            © {currentYear} Carnegie Mellon University Africa. All rights reserved.
          </div>
          
          <nav aria-label="Legal links" className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-sm text-gray-400">
            <Link 
              href="/privacy" 
              className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors duration-200 py-1"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors duration-200 py-1"
            >
              Terms of Service
            </Link>
            <Link 
              href="/accessibility" 
              className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors duration-200 py-1"
            >
              Accessibility
            </Link>
          </nav>
        </div>

        {/* University affiliation */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-xs text-gray-500">
            Carnegie Mellon University Africa is a degree-granting campus of Carnegie Mellon University
          </p>
        </div>
      </div>
    </footer>
  )
}