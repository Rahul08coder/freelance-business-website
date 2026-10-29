import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Section from '../components/ui/Section.jsx'
import Input from '../components/ui/Input.jsx'
import Textarea from '../components/ui/Textarea.jsx'
import Select from '../components/ui/Select.jsx'

const projectOptions = [
  { value: 'business-website', label: 'Business website' },
  { value: 'landing-page', label: 'Landing page' },
  { value: 'mern-app', label: 'MERN full-stack app' },
]

// Temporary page: sirf components test karne ke liye. Day 11 mein hata denge.
function UiTest() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [projectType, setProjectType] = useState('')
  const [message, setMessage] = useState('')

  function handleLoadingDemo() {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  function handleValidate() {
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address.')
    } else {
      setEmailError('')
    }
  }

  return (
    <div>
      <Section title="Buttons" subtitle="Variants, sizes, loading and disabled states.">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
          <Button loading={loading} onClick={handleLoadingDemo}>
            {loading ? 'Sending...' : 'Click for loading'}
          </Button>
          <Button to="/about">
            Link button <ArrowRight size={16} />
          </Button>
        </div>
      </Section>

      <Section tone="surface" title="Cards" subtitle="Normal card aur hover wala card.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Normal card</h3>
            <p className="mt-2 text-sm text-muted">Isme hover effect nahi hai.</p>
          </Card>
          <Card hover>
            <h3 className="font-semibold">Hover card</h3>
            <p className="mt-2 text-sm text-muted">Mouse laoge toh thoda upar uthega.</p>
          </Card>
          <Card hover>
            <h3 className="font-semibold">Another card</h3>
            <p className="mt-2 text-sm text-muted">Screen chhoti karke grid change dekho.</p>
          </Card>
        </div>
      </Section>

      <Section title="Form fields" subtitle="Input, Select, Textarea with hint aur error.">
        <div className="max-w-md space-y-5">
          <Input
            label="Email address"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            hint="We will only use this to reply to you."
          />
          <Select
            label="Project type"
            required
            options={projectOptions}
            placeholder="Choose project type"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
          />
          <Textarea
            label="Project description"
            placeholder="Tell me about your project"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handleValidate}>Validate email</Button>
        </div>
      </Section>
    </div>
  )
}

export default UiTest