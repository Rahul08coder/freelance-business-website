import { usePageTitle } from '../hooks/usePageTitle.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import Section from '../components/ui/Section.jsx'
import Card from '../components/ui/Card.jsx'
import InquiryForm from '../components/forms/InquiryForm.jsx'

function StartProject() {
  usePageTitle('Start a Project')

  return (
    <>
      <PageHeader
        title="Start a project"
        subtitle="Tell me about your idea. The more detail you share, the better I can reply."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <InquiryForm />
          </div>

          <aside>
            <Card>
              <h2 className="text-base font-semibold">What happens next</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-muted">
                <li>I read your request and the details you shared.</li>
                <li>I reply by email with questions or a quote.</li>
                <li>We agree on scope, timeline and cost before any work starts.</li>
              </ol>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  )
}

export default StartProject