// Realistic mock job data for JobPlat context

import { Job } from '@/types'

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Software Engineer - Full Stack',
    description: 'Join our dynamic engineering team to build innovative financial technology solutions that serve millions of customers across East Africa. You will work on modern web applications, mobile platforms, and backend systems using cutting-edge technologies.',
    requirements: 'Bachelor\'s degree in Computer Science, Software Engineering, or related field. 2+ years experience with React, Node.js, and database systems. Experience with cloud platforms (AWS/Azure) preferred. Strong problem-solving skills and ability to work in agile environments.',
    location: 'Kigali, Rwanda',
    type: 'FULL_TIME',
    category: 'Software Engineering',
    salaryRange: '$25,000 - $35,000 USD',
    contactPersonName: 'Grace Mukamana',
    contactPersonEmail: 'careers@equitybankgroup.com',
    contactPersonPhone: '+250 788 123 456',
    applicationInstructions: 'Please submit your resume, cover letter, and a portfolio of your recent projects. Include links to your GitHub profile and any deployed applications. Applications should be sent via email with the subject line "Software Engineer Application - [Your Name]".',
    applicationDeadline: new Date('2024-03-15'),
    isActive: true,
    companyId: 'company-1',
    createdBy: 'career-1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'job-2',
    title: 'Data Scientist - Healthcare Analytics',
    description: 'Revolutionary opportunity to use data science and machine learning to transform healthcare delivery in Africa. Work with our team to analyze flight patterns, optimize delivery routes, and improve health outcomes through data-driven insights.',
    requirements: 'Master\'s degree in Data Science, Statistics, Computer Science, or related field. 3+ years experience with Python, R, SQL, and machine learning frameworks (TensorFlow, PyTorch). Experience with healthcare data and geospatial analysis preferred. Strong communication skills for presenting insights to stakeholders.',
    location: 'Muhanga, Rwanda',
    type: 'FULL_TIME',
    category: 'Data Science',
    salaryRange: '$30,000 - $45,000 USD',
    contactPersonName: 'Dr. James Mutabazi',
    contactPersonEmail: 'careers@zipline.com',
    contactPersonPhone: '+250 788 234 567',
    applicationInstructions: 'Submit your resume, cover letter, and a data science portfolio showcasing your best work. Include a brief case study (2-3 pages) demonstrating your approach to a healthcare analytics problem. Send applications to the email above with subject "Data Scientist - Healthcare Analytics".',
    applicationDeadline: new Date('2024-02-28'),
    isActive: true,
    companyId: 'company-3',
    createdBy: 'career-1',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: 'job-3',
    title: 'Research Assistant - Computer Vision',
    description: 'Join our cutting-edge research team working on computer vision and artificial intelligence projects with real-world applications. Collaborate with faculty and graduate students on publications and contribute to groundbreaking research in AI.',
    requirements: 'Bachelor\'s degree in Computer Science, Electrical Engineering, or related field. Strong programming skills in Python and C++. Experience with computer vision libraries (OpenCV, PIL) and deep learning frameworks. Research experience and publications preferred but not required.',
    location: 'Kigali, Rwanda',
    type: 'PART_TIME',
    category: 'Research',
    salaryRange: '$15,000 - $20,000 USD',
    contactPersonName: 'Prof. Maria Santos',
    contactPersonEmail: 'research@africa.cmu.edu',
    contactPersonPhone: '+250 788 345 678',
    applicationInstructions: 'Please submit your resume, academic transcripts, a statement of research interests (1-2 pages), and contact information for two references. Applications should be submitted via email with the subject line "Research Assistant Application - Computer Vision".',
    applicationDeadline: new Date('2024-03-01'),
    isActive: true,
    companyId: 'company-4',
    createdBy: 'career-1',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'job-4',
    title: 'Mobile App Developer - Android/iOS',
    description: 'Lead the development of innovative mobile applications that connect millions of users across Rwanda and East Africa. Work on consumer-facing apps, mobile payment solutions, and cutting-edge telecommunications services.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years experience in mobile app development with native Android (Kotlin/Java) and iOS (Swift) or cross-platform frameworks (React Native, Flutter). Experience with mobile payment systems and telecommunications APIs preferred.',
    location: 'Kigali, Rwanda',
    type: 'FULL_TIME',
    category: 'Mobile Development',
    salaryRange: '$28,000 - $40,000 USD',
    contactPersonName: 'Eric Nshimiyimana',
    contactPersonEmail: 'careers@mtn.co.rw',
    contactPersonPhone: '+250 788 456 789',
    applicationInstructions: 'Submit your resume, cover letter, and links to mobile applications you have developed (App Store/Google Play links preferred). Include a brief technical write-up about your most challenging mobile development project. Email applications with subject "Mobile Developer Application".',
    applicationDeadline: new Date('2024-03-20'),
    isActive: true,
    companyId: 'company-2',
    createdBy: 'career-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'job-5',
    title: 'DevOps Engineer - Cloud Infrastructure',
    description: 'Build and maintain scalable cloud infrastructure supporting our global technology talent platform. Work with modern DevOps tools and practices to ensure reliable, secure, and efficient systems that serve developers worldwide.',
    requirements: 'Bachelor\'s degree in Computer Science, Information Systems, or related field. 2+ years experience with cloud platforms (AWS, Azure, GCP), containerization (Docker, Kubernetes), and CI/CD pipelines. Experience with Infrastructure as Code (Terraform, CloudFormation) and monitoring tools.',
    location: 'Kigali, Rwanda',
    type: 'FULL_TIME',
    category: 'DevOps',
    salaryRange: '$32,000 - $48,000 USD',
    contactPersonName: 'Sarah Uwimana',
    contactPersonEmail: 'careers@andela.com',
    contactPersonPhone: '+250 788 567 890',
    applicationInstructions: 'Please submit your resume, cover letter, and a portfolio demonstrating your DevOps experience. Include examples of infrastructure you have built or maintained, and describe your approach to system reliability and security. Send to the email above with subject "DevOps Engineer Application".',
    applicationDeadline: new Date('2024-03-10'),
    isActive: true,
    companyId: 'company-8',
    createdBy: 'career-1',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'job-6',
    title: 'Business Analyst - Digital Transformation',
    description: 'Drive digital transformation initiatives across Rwanda\'s leading commercial bank. Analyze business processes, identify improvement opportunities, and work with technology teams to implement innovative solutions that enhance customer experience.',
    requirements: 'Bachelor\'s degree in Business Administration, Information Systems, or related field. 2+ years experience in business analysis, process improvement, or consulting. Strong analytical skills and experience with data analysis tools. Knowledge of banking operations and financial services preferred.',
    location: 'Kigali, Rwanda',
    type: 'FULL_TIME',
    category: 'Business Analysis',
    salaryRange: '$22,000 - $32,000 USD',
    contactPersonName: 'Jean Claude Habimana',
    contactPersonEmail: 'careers@bk.rw',
    contactPersonPhone: '+250 788 678 901',
    applicationInstructions: 'Submit your resume, cover letter, and a case study demonstrating your analytical skills. The case study should outline a business problem you have solved, your methodology, and the impact of your solution. Email with subject "Business Analyst Application".',
    applicationDeadline: new Date('2024-02-25'),
    isActive: true,
    companyId: 'company-7',
    createdBy: 'career-1',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'job-7',
    title: 'Program Manager - Youth Employment',
    description: 'Lead innovative programs that advance financial inclusion and youth employment across Africa. Work with partners, governments, and communities to design and implement impactful initiatives that create opportunities for young people.',
    requirements: 'Master\'s degree in International Development, Public Policy, Business Administration, or related field. 3+ years experience in program management, preferably in development or non-profit sector. Strong project management skills and experience working in multicultural environments. Fluency in English and French preferred.',
    location: 'Kigali, Rwanda',
    type: 'FULL_TIME',
    category: 'Program Management',
    salaryRange: '$35,000 - $50,000 USD',
    contactPersonName: 'Dr. Aisha Nyong',
    contactPersonEmail: 'careers@mastercardfdn.org',
    contactPersonPhone: '+250 788 789 012',
    applicationInstructions: 'Please submit your resume, cover letter, and a program proposal (3-5 pages) for a youth employment initiative you would design for Rwanda. Include your approach to stakeholder engagement, impact measurement, and sustainability. Email with subject "Program Manager - Youth Employment".',
    applicationDeadline: new Date('2024-03-05'),
    isActive: true,
    companyId: 'company-10',
    createdBy: 'career-1',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'job-8',
    title: 'Investment Analyst - Startup Ecosystem',
    description: 'Join Rwanda\'s premier innovation hub to analyze and support promising startups and technology companies. Conduct due diligence, financial analysis, and market research to identify high-potential investment opportunities in the African tech ecosystem.',
    requirements: 'Bachelor\'s degree in Finance, Economics, Business, or related field. 1-3 years experience in investment analysis, venture capital, or startup ecosystem. Strong financial modeling skills and understanding of technology markets. Experience with African markets and startup ecosystem preferred.',
    location: 'Kigali, Rwanda',
    type: 'FULL_TIME',
    category: 'Finance',
    salaryRange: '$26,000 - $38,000 USD',
    contactPersonName: 'Patrick Buchana',
    contactPersonEmail: 'careers@kigaliinnovationcity.com',
    contactPersonPhone: '+250 788 890 123',
    applicationInstructions: 'Submit your resume, cover letter, and a market analysis (2-3 pages) of a technology sector or startup opportunity in Rwanda/East Africa. Include your investment thesis and risk assessment. Email with subject "Investment Analyst Application".',
    applicationDeadline: new Date('2024-03-12'),
    isActive: true,
    companyId: 'company-6',
    createdBy: 'career-1',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'job-9',
    title: 'Policy Research Intern',
    description: 'Support Rwanda\'s economic development through research and analysis of investment policies, business regulations, and economic trends. Contribute to policy recommendations that drive Rwanda\'s transformation into a knowledge-based economy.',
    requirements: 'Currently enrolled in or recent graduate of Master\'s program in Economics, Public Policy, International Development, or related field. Strong research and analytical skills. Experience with statistical analysis software (R, STATA, SPSS). Excellent written and verbal communication skills in English.',
    location: 'Kigali, Rwanda',
    type: 'INTERNSHIP',
    category: 'Research',
    salaryRange: '$800 - $1,200 USD/month',
    contactPersonName: 'Dr. Diane Karusisi',
    contactPersonEmail: 'internships@rdb.rw',
    contactPersonPhone: '+250 788 901 234',
    applicationInstructions: 'Please submit your resume, cover letter, academic transcripts, and a writing sample (research paper or policy brief, 5-10 pages). Include a brief statement (1 page) on why you are interested in Rwanda\'s economic development. Email with subject "Policy Research Intern Application".',
    applicationDeadline: new Date('2024-02-20'),
    isActive: true,
    companyId: 'company-9',
    createdBy: 'career-1',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
  },
  {
    id: 'job-10',
    title: 'Project Coordinator - Sustainable Development',
    description: 'Coordinate sustainable development projects across Rwanda, working with government partners, civil society, and international organizations. Support project implementation, monitoring, and evaluation to achieve meaningful development outcomes.',
    requirements: 'Bachelor\'s degree in International Development, Project Management, Social Sciences, or related field. 2+ years experience in project coordination or development work. Strong organizational and communication skills. Experience working with government and NGO partners. Knowledge of sustainable development goals (SDGs) preferred.',
    location: 'Kigali, Rwanda',
    type: 'FULL_TIME',
    category: 'Project Management',
    salaryRange: '$20,000 - $28,000 USD',
    contactPersonName: 'Marie Claire Uwimana',
    contactPersonEmail: 'careers@undp.org',
    contactPersonPhone: '+250 788 012 345',
    applicationInstructions: 'Submit your resume, cover letter, and a project proposal (2-3 pages) for a sustainable development initiative you would implement in Rwanda. Focus on one specific SDG and describe your approach to stakeholder engagement and impact measurement. Email with subject "Project Coordinator Application".',
    applicationDeadline: new Date('2024-03-08'),
    isActive: true,
    companyId: 'company-5',
    createdBy: 'career-1',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30')
  }
]

// Job categories for filtering
export const jobCategories = [
  'Software Engineering',
  'Data Science',
  'Mobile Development',
  'DevOps',
  'Research',
  'Business Analysis',
  'Program Management',
  'Finance',
  'Project Management'
]

// Job types for filtering
export const jobTypes = [
  'FULL_TIME',
  'PART_TIME',
  'INTERNSHIP',
  'CONTRACT'
]

// Job locations for filtering
export const jobLocations = [
  'Kigali, Rwanda',
  'Muhanga, Rwanda'
]

// Active jobs only
export const activeJobs = mockJobs.filter(job => job.isActive)

// Jobs by category
export const jobsByCategory = mockJobs.reduce((acc, job) => {
  if (!acc[job.category]) {
    acc[job.category] = []
  }
  acc[job.category]!.push(job)
  return acc
}, {} as Record<string, Job[]>)

// Jobs by company
export const jobsByCompany = mockJobs.reduce((acc, job) => {
  if (!acc[job.companyId]) {
    acc[job.companyId] = []
  }
  acc[job.companyId]!.push(job)
  return acc
}, {} as Record<string, Job[]>)