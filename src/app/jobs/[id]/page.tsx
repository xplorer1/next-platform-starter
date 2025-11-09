import { AppShell, JobDetail } from '@/components'

interface JobDetailPageProps {
  params: {
    id: string
  }
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <JobDetail jobId={params.id} />
      </div>
    </AppShell>
  )
}