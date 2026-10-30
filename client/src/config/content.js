// Home page ka content (projects, process, skills, FAQ) yahan hai.
// Kuch badalna ho toh sirf yeh file edit karo.
//
// Projects: githubUrl ya liveUrl khaali ('') rakhoge toh woh button card par dikhega hi nahi.
// Jab project deploy ho jaye, liveUrl mein URL daal dena.
// Day 16 ke baad projects database se aayenge, tab yeh array hata denge.

export const projects = [
  {
    slug: 'taskflow',
    title: 'Taskflow',
    description:
      'Task management app with user accounts, notifications, search and sort algorithms, and an AI quick-add and chatbot.',
    tech: ['FastAPI', 'SQLAlchemy', 'PostgreSQL', 'JavaScript'],
    githubUrl: 'https://github.com/Rahul08coder/Taskflow',
    liveUrl: '', // Login wale issues fix hone ke baad URL yahan daalna
    featured: true,
  },
  {
    slug: 'amazon-homepage-clone',
    title: 'Amazon.in Homepage Clone',
    description:
      'Responsive homepage clone with a hero slider, JavaScript-rendered products, search and a working cart.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
  {
    slug: 'developer-portfolio',
    title: 'Developer Portfolio',
    description:
      'Personal portfolio website with sections for skills, featured projects and contact details.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
]

// Yeh ek real sequence hai, isliye numbered steps use hue hain.
export const processSteps = [
  {
    title: 'Discuss',
    text: 'You share your idea and requirements through the Start a Project form. We clarify the goals, scope and budget.',
  },
  {
    title: 'Plan',
    text: 'I suggest the pages, features and technology, along with a realistic timeline.',
  },
  {
    title: 'Build',
    text: 'I build in stages and share progress, so you can give feedback early.',
  },
  {
    title: 'Deliver',
    text: 'I test, deploy and hand over the project. I am available for fixes after delivery.',
  },
]

// Sirf wahi skills jo tum sach mein use karte ho. Percentage jaanbujhkar nahi diya.
export const skillGroups = [
  {
    title: 'Frontend',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express.js', 'REST APIs', 'Python'],
  },
  {
    title: 'Databases',
    items: ['MongoDB', 'PostgreSQL'],
  },
  {
    title: 'Tools',
    items: ['Git', 'GitHub'],
  },
]

export const faqs = [
  {
    question: 'What kind of projects do you take?',
    answer:
      'Business websites, landing pages, React frontends, MERN full-stack applications, bug fixes, responsive design improvements, REST API integration and backend and database work.',
  },
  {
    question: 'How much does a project cost?',
    answer:
      'It depends on the scope and features. Send your requirements through the Start a Project form and I will reply with a quote.',
  },
  {
    question: 'How long will my project take?',
    answer:
      'It depends on the size of the project. After I review your requirements, I will share a realistic timeline before we begin.',
  },
  {
    question: 'Can you fix or improve my existing website?',
    answer:
      'Yes. I can fix bugs, improve how the site looks on mobile and tablet, and connect it with APIs. Share the website link in the project form.',
  },
  {
    question: 'How will we stay in touch during the project?',
    answer:
      'By email. I will share progress updates while I build, so you can review the work and give feedback along the way.',
  },
  {
    question: 'Do you offer support after delivery?',
    answer:
      'Yes. I help with fixes after delivery. We will agree on the support terms before the project starts.',
  },
]