// Demo utilities for testing the mock data and services

import { MockAuthService } from './auth'
import { MockJobService, MockCompanyService, MockApplicationService } from './services'

// Demo function to test all services
export async function runDemo() {
  console.log('🚀 JobPlat Job Board Demo')
  console.log('================================')
  
  // Test authentication
  console.log('\n📝 Testing Authentication...')
  const user = MockAuthService.login('student')
  console.log('Logged in as:', user.name, `(${user.role})`)
  
  // Test job service
  console.log('\n💼 Testing Job Service...')
  const jobsResponse = await MockJobService.getJobs()
  if (jobsResponse.success && jobsResponse.data) {
    console.log(`Found ${jobsResponse.data.length} active jobs`)
    console.log('Sample job:', jobsResponse.data[0]?.title)
  }
  
  // Test company service
  console.log('\n🏢 Testing Company Service...')
  const companiesResponse = await MockCompanyService.getCompanies()
  if (companiesResponse.success && companiesResponse.data) {
    console.log(`Found ${companiesResponse.data.length} companies`)
    console.log('Sample company:', companiesResponse.data[0]?.name)
  }
  
  // Test application service
  console.log('\n📋 Testing Application Service...')
  const applicationsResponse = await MockApplicationService.getApplicationsByUser(user.id)
  if (applicationsResponse.success && applicationsResponse.data) {
    console.log(`Found ${applicationsResponse.data.length} applications for user`)
  }
  
  // Test job filtering
  console.log('\n🔍 Testing Job Filtering...')
  const filteredJobsResponse = await MockJobService.getJobs({
    category: 'Software Engineering',
    location: 'Kigali'
  })
  if (filteredJobsResponse.success && filteredJobsResponse.data) {
    console.log(`Found ${filteredJobsResponse.data.length} software engineering jobs in Kigali`)
  }
  
  console.log('\n✅ Demo completed successfully!')
}

// Export demo data counts for verification
export const demoStats = {
  totalJobs: 10,
  totalCompanies: 10,
  totalApplications: 5,
  totalUsers: 4,
  jobCategories: 9,
  industries: 9
}