// Realistic mock data for Rwanda/East Africa companies

import { Company } from '@/types'

export const mockCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'Equity Bank Rwanda',
    description: 'Leading financial services provider in Rwanda, offering innovative banking solutions and driving financial inclusion across East Africa.',
    website: 'https://equitybankgroup.com/rw',
    logo: '/logos/equity-bank.png',
    industry: 'Financial Services',
    size: '1000+ employees',
    location: 'Kigali, Rwanda',
    createdBy: 'career-1',
    isActive: true,
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'company-2',
    name: 'MTN Rwanda',
    description: 'Leading telecommunications company providing mobile, internet, and digital services across Rwanda with innovative technology solutions.',
    website: 'https://www.mtn.co.rw',
    logo: '/logos/mtn-rwanda.png',
    industry: 'Telecommunications',
    size: '500-1000 employees',
    location: 'Kigali, Rwanda',
    createdBy: 'career-1',
    isActive: true,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'company-3',
    name: 'Zipline',
    description: 'Revolutionary drone delivery company transforming healthcare logistics in Rwanda and expanding globally with cutting-edge technology.',
    website: 'https://www.zipline.com',
    logo: '/logos/zipline.png',
    industry: 'Healthcare Technology',
    size: '100-500 employees',
    location: 'Muhanga, Rwanda',
    createdBy: 'career-1',
    isActive: true,
    createdAt: new Date('2023-07-20'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: 'company-4',
    name: 'Carnegie Mellon University Africa',
    description: 'Premier research university offering world-class education in engineering, computer science, and information systems in the heart of Africa.',
    website: 'https://www.africa.cmu.edu',
    logo: '/logos/JobPlat.png',
    industry: 'Education & Research',
    size: '100-500 employees',
    location: 'Kigali, Rwanda',
    createdBy: 'career-1',
    isActive: true,
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'company-5',
    name: 'UNDP Rwanda',
    description: 'United Nations Development Programme supporting sustainable development, poverty reduction, and democratic governance in Rwanda.',
    website: 'https://www.undp.org/rwanda',
    logo: '/logos/undp-rwanda.png',
    industry: 'International Development',
    size: '50-100 employees',
    location: 'Kigali, Rwanda',
    createdBy: 'career-1',
    isActive: true,
    createdAt: new Date('2023-08-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'company-6',
    name: 'Kigali Innovation City',
    description: 'Rwanda\'s premier technology and innovation hub, fostering entrepreneurship and hosting leading tech companies and startups.',
    website: 'https://kigaliinnovationcity.com',
    logo: '/logos/kic.png',
    industry: 'Technology & Innovation',
    size: '200-500 employees',
    location: 'Kigali, Rwanda',
    createdBy: 'career-1',
    isActive: true,
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'company-7',
    name: 'Bank of Kigali',
    description: 'Rwanda\'s leading commercial bank providing comprehensive financial services and driving economic growth across the region.',
    website: 'https://www.bk.rw',
    logo: '/logos/bank-of-kigali.png',
    industry: 'Financial Services',
    size: '1000+ employees',
    location: 'Kigali, Rwanda',
    createdBy: 'career-1',
    isActive: true,
    createdAt: new Date('2023-07-30'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: 'company-8',
    name: 'Andela Rwanda',
    description: 'Global technology talent accelerator developing world-class software engineers and connecting them with leading companies worldwide.',
    website: 'https://andela.com',
    logo: '/logos/andela.png',
    industry: 'Technology Services',
    size: '100-500 employees',
    location: 'Kigali, Rwanda',
    createdBy: 'career-1',
    isActive: true,
    createdAt: new Date('2023-08-25'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'company-9',
    name: 'Rwanda Development Board',
    description: 'Government agency driving Rwanda\'s economic transformation through investment promotion, business development, and innovation.',
    website: 'https://rdb.rw',
    logo: '/logos/rdb.png',
    industry: 'Government & Public Policy',
    size: '200-500 employees',
    location: 'Kigali, Rwanda',
    createdBy: 'career-1',
    isActive: true,
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 'company-10',
    name: 'Mastercard Foundation',
    description: 'Leading foundation advancing financial inclusion and youth employment across Africa through innovative programs and partnerships.',
    website: 'https://mastercardfdn.org',
    logo: '/logos/mastercard-foundation.png',
    industry: 'Non-Profit & Development',
    size: '100-500 employees',
    location: 'Kigali, Rwanda',
    createdBy: 'career-1',
    isActive: true,
    createdAt: new Date('2023-09-10'),
    updatedAt: new Date('2024-01-16')
  }
]

// Featured companies for homepage showcase
export const featuredCompanies = mockCompanies.slice(0, 6)

// Companies by industry for filtering
export const companiesByIndustry = mockCompanies.reduce((acc, company) => {
  if (!acc[company.industry]) {
    acc[company.industry] = []
  }
  acc[company.industry]!.push(company)
  return acc
}, {} as Record<string, Company[]>)