'use client'

import { 
  GraduationCap, 
  Briefcase, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  MapPin, 
  Building2,
  Star,
  CheckCircle,
  Globe,
  Award,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components'
import { featuredCompanies } from '@/data/companies'
import { mockJobs } from '@/data/jobs'
import { FadeInUp, SlideInLeft, StaggerContainer, StaggerItem, ScaleIn } from '@/components/animations/PageTransition'
import { AnimatedButton, AnimatedCard } from '@/components/animations/InteractiveElements'
import { motion } from 'framer-motion'

function Home() {
  // Calculate platform statistics
  const totalJobs = mockJobs.filter(job => job.isActive).length
  const totalCompanies = featuredCompanies.length
  const totalCategories = [...new Set(mockJobs.map(job => job.category))].length

  return (
    <AppShell>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-cmu-red via-cmu-red-dark to-red-900 py-20 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <FadeInUp className="mb-6 flex items-center justify-center gap-3">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <GraduationCap className="h-16 w-16" />
                </motion.div>
                <div className="text-left">
                  <h1 className="text-5xl font-bold leading-tight">
                    JobPlat
                  </h1>
                  <p className="text-xl font-medium opacity-90">Job Board</p>
                </div>
              </FadeInUp>
              
              <FadeInUp delay={0.2}>
                <h2 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">
                  Launch Your Career in Africa's Most Dynamic Tech Ecosystem
                </h2>
              </FadeInUp>
              
              <FadeInUp delay={0.4}>
                <p className="mb-8 text-xl opacity-90 md:text-2xl">
                  Connect with leading companies across Rwanda and East Africa. 
                  From innovative startups to established enterprises, discover 
                  opportunities that match your ambitions.
                </p>
              </FadeInUp>
              
              <FadeInUp delay={0.6} className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/jobs" 
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-cmu-red transition-all hover:bg-gray-50 hover:shadow-lg"
                  >
                    Explore Jobs
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/auth/login" 
                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-cmu-red"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </FadeInUp>
            </div>
          </div>
        </section>

        {/* Platform Statistics */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <StaggerContainer className="grid gap-8 md:grid-cols-3">
              <StaggerItem className="text-center">
                <div className="mb-4 flex items-center justify-center">
                  <motion.div 
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-cmu-red text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Briefcase className="h-8 w-8" />
                  </motion.div>
                </div>
                <motion.h3 
                  className="mb-2 text-3xl font-bold text-cmu-gray"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {totalJobs}+
                </motion.h3>
                <p className="text-cmu-gray-light text-lg">Active Job Opportunities</p>
              </StaggerItem>
              
              <StaggerItem className="text-center">
                <div className="mb-4 flex items-center justify-center">
                  <motion.div 
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500 text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Building2 className="h-8 w-8" />
                  </motion.div>
                </div>
                <motion.h3 
                  className="mb-2 text-3xl font-bold text-cmu-gray"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {totalCompanies}+
                </motion.h3>
                <p className="text-cmu-gray-light text-lg">Partner Companies</p>
              </StaggerItem>
              
              <StaggerItem className="text-center">
                <div className="mb-4 flex items-center justify-center">
                  <motion.div 
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-success-500 text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Target className="h-8 w-8" />
                  </motion.div>
                </div>
                <motion.h3 
                  className="mb-2 text-3xl font-bold text-cmu-gray"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {totalCategories}+
                </motion.h3>
                <p className="text-cmu-gray-light text-lg">Career Categories</p>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Featured Companies */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-cmu-gray">
                Partner Companies
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-cmu-gray-light">
                Join a network of leading organizations driving innovation and growth across Rwanda and East Africa
              </p>
            </div>
            
            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCompanies.map((company) => (
                <StaggerItem key={company.id}>
                  <AnimatedCard className="group cursor-pointer p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                      <Building2 className="h-6 w-6 text-cmu-gray" />
                    </div>
                    <span className="rounded-full bg-success-100 px-3 py-1 text-sm font-medium text-success-700">
                      {company.industry}
                    </span>
                  </div>
                  
                  <h3 className="mb-2 text-xl font-semibold text-cmu-gray group-hover:text-cmu-red">
                    {company.name}
                  </h3>
                  
                  <p className="mb-4 text-cmu-gray-light line-clamp-3">
                    {company.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-cmu-gray-light">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {company.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {company.size}
                    </div>
                  </div>
                  </AnimatedCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <div className="mt-12 text-center">
              <Link 
                href="/jobs" 
                className="inline-flex items-center gap-2 rounded-lg bg-cmu-red px-6 py-3 font-semibold text-white transition-colors hover:bg-cmu-red-dark"
              >
                View All Opportunities
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-cmu-gray">
                Success Stories
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-cmu-gray-light">
                Hear from JobPlat alumni who have launched successful careers across the continent
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="card p-6">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="mb-4 text-cmu-gray-light">
                  "The JobPlat Job Board connected me with Zipline, where I now lead data science initiatives that are transforming healthcare delivery across Africa. The platform made it easy to find opportunities that matched my passion for using technology for social impact."
                </blockquote>
                
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cmu-red text-white font-semibold">
                    AM
                  </div>
                  <div>
                    <p className="font-semibold text-cmu-gray">Aline Mukamana</p>
                    <p className="text-sm text-cmu-gray-light">Data Scientist at Zipline</p>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="mb-4 text-cmu-gray-light">
                  "Through the job board, I discovered an incredible opportunity at MTN Rwanda. The detailed job descriptions and direct contact with hiring managers made the application process smooth and transparent. Now I'm building mobile solutions that serve millions of users."
                </blockquote>
                
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-white font-semibold">
                    JK
                  </div>
                  <div>
                    <p className="font-semibold text-cmu-gray">Jean Kalisa</p>
                    <p className="text-sm text-cmu-gray-light">Mobile Developer at MTN Rwanda</p>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="mb-4 text-cmu-gray-light">
                  "The platform helped me transition from student to professional seamlessly. I found my role at Andela through the job board, and the detailed application instructions helped me prepare a compelling application. Now I'm part of a global network of developers."
                </blockquote>
                
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-500 text-white font-semibold">
                    GN
                  </div>
                  <div>
                    <p className="font-semibold text-cmu-gray">Grace Niyonzima</p>
                    <p className="text-sm text-cmu-gray-light">Software Engineer at Andela</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-cmu-red to-cmu-red-dark py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-3xl font-bold">
                Ready to Launch Your Career?
              </h2>
              <p className="mb-8 text-xl opacity-90">
                Join hundreds of JobPlat students and alumni who have found their dream jobs through our platform. 
                Your next opportunity is just a click away.
              </p>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link 
                  href="/jobs" 
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-cmu-red transition-all hover:bg-gray-50"
                >
                  Browse Jobs
                  <Briefcase className="h-5 w-5" />
                </Link>
                <Link 
                  href="/profile" 
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-cmu-red"
                >
                  Create Profile
                  <Users className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
// Export as dynamic component to prevent SSR issues
import dynamic from 'next/dynamic'
export default dynamic(() => Promise.resolve(Home), {
  ssr: false
})