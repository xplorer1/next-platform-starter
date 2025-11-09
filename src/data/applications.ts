// Mock application data for demo purposes

import { Application } from '@/types'

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    userId: 'user-1',
    jobId: 'job-1',
    status: 'PENDING',
    coverLetter: 'I am excited to apply for the Software Engineer position at Equity Bank Rwanda. With my background in Information Systems from JobPlat and experience in full-stack development, I am confident I can contribute to your innovative financial technology solutions.',
    resume: 'alice-uwimana-resume.pdf',
    appliedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'app-2',
    userId: 'user-1',
    jobId: 'job-4',
    status: 'REVIEWED',
    coverLetter: 'I am writing to express my interest in the Mobile App Developer position at MTN Rwanda. My experience with React Native and passion for creating user-friendly mobile experiences make me an ideal candidate for this role.',
    resume: 'alice-uwimana-resume.pdf',
    appliedAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'app-3',
    userId: 'user-2',
    jobId: 'job-2',
    status: 'ACCEPTED',
    coverLetter: 'As a recent JobPlat graduate with a strong background in Electrical and Computer Engineering, I am thrilled to apply for the Data Scientist position at Zipline. The opportunity to use data science to transform healthcare delivery in Africa aligns perfectly with my career goals.',
    resume: 'jean-nzeyimana-resume.pdf',
    appliedAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-28')
  },
  {
    id: 'app-4',
    userId: 'user-2',
    jobId: 'job-5',
    status: 'PENDING',
    coverLetter: 'I am excited to apply for the DevOps Engineer position at Andela. My experience with cloud platforms and passion for building scalable infrastructure make me a strong candidate for this role.',
    resume: 'jean-nzeyimana-resume.pdf',
    appliedAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'app-5',
    userId: 'user-1',
    jobId: 'job-3',
    status: 'REJECTED',
    coverLetter: 'I am interested in the Research Assistant position in Computer Vision at JobPlat. My academic background and programming skills in Python and C++ make me well-suited for this research opportunity.',
    resume: 'alice-uwimana-resume.pdf',
    appliedAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-22')
  }
]

// Applications by user
export const applicationsByUser = mockApplications.reduce((acc, application) => {
  if (!acc[application.userId]) {
    acc[application.userId] = []
  }
  acc[application.userId]!.push(application)
  return acc
}, {} as Record<string, Application[]>)

// Applications by job
export const applicationsByJob = mockApplications.reduce((acc, application) => {
  if (!acc[application.jobId]) {
    acc[application.jobId] = []
  }
  acc[application.jobId]!.push(application)
  return acc
}, {} as Record<string, Application[]>)

// Applications by status
export const applicationsByStatus = mockApplications.reduce((acc, application) => {
  if (!acc[application.status]) {
    acc[application.status] = []
  }
  acc[application.status]!.push(application)
  return acc
}, {} as Record<string, Application[]>)

// Application statistics
export const applicationStats = {
  total: mockApplications.length,
  pending: mockApplications.filter(app => app.status === 'PENDING').length,
  reviewed: mockApplications.filter(app => app.status === 'REVIEWED').length,
  accepted: mockApplications.filter(app => app.status === 'ACCEPTED').length,
  rejected: mockApplications.filter(app => app.status === 'REJECTED').length
}