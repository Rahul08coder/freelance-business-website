// Home page ka content (projects, process, skills, FAQ) yahan hai.
// Kuch badalna ho toh sirf yeh file edit karo.
//
// Projects: githubUrl ya liveUrl khaali ('') rakhoge toh woh button card par dikhega hi nahi.
// Jab project deploy ho jaye, liveUrl mein URL daal dena.
// category: Portfolio page ke filter mein use hota hai.
// Day 16 ke baad projects database se aayenge, tab yeh array hata denge.

export const projects = [
  {
    slug: 'taskflow',
    title: 'Taskflow',
    category: 'Full-stack',
    description:
      'Task management app with user accounts, notifications, search and sort algorithms, and an AI quick-add and chatbot.',
    overview:
      'Taskflow is a task management app I built to practise a complete backend and frontend workflow. Users can register, log in and manage their own projects and tasks. It also includes search and sorting built with my own algorithm implementations, a notification system, a quick-add feature and a chatbot assistant.',
    features: [
      'User registration and login, with each user seeing only their own data',
      'Projects and tasks with create, read, update and delete',
      'Search and sorting using insertion sort, binary search and linear search',
      'Notifications with a bell icon and dropdown',
      'Quick-add that turns a typed sentence into a task',
      'AI chatbot assistant',
      'Light and dark theme',
    ],
    tech: ['FastAPI', 'SQLAlchemy', 'PostgreSQL', 'JavaScript'],
    githubUrl: 'https://github.com/Rahul08coder/Taskflow',
    liveUrl: '', // Login wale issues fix hone ke baad URL yahan daalna
    featured: true,
  },
  {
    slug: 'amazon-homepage-clone',
    title: 'Amazon.in Homepage Clone',
    category: 'Frontend',
    description:
      'Responsive homepage clone with a hero slider, JavaScript-rendered products, search and a working cart.',
    overview:
      'A clone of the Amazon.in homepage built with plain HTML, CSS and JavaScript. I made it to practise page layout, responsive design and working with the DOM, without using any framework.',
    features: [
      'Responsive layout for different screen sizes',
      'Hero image slider',
      'Products rendered with JavaScript',
      'Product search',
      'Cart counter',
      'Footer section',
    ],
    tech: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
  {
    slug: 'developer-portfolio',
    title: 'Developer Portfolio',
    category: 'Frontend',
    description:
      'Personal portfolio website with sections for skills, featured projects and contact details.',
    overview:
      'My personal developer portfolio, built with plain HTML, CSS and JavaScript in a dark theme. It introduces me, shows my skills and projects, and gives visitors a way to contact me.',
    features: [
      'Navigation bar and hero section',
      'About section',
      'Skills section with technology logos',
      'Featured projects section',
      'Contact section and footer',
    ],
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