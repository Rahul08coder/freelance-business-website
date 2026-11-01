// Pehli baar database mein jaane wala data. Ye wahi hai jo abhi frontend ki files mein hai.
// Seed script is data ko sirf tab daalti hai jab uska slug database mein na ho.

export const seedServices = [
  {
    slug: 'business-website',
    title: 'Business Website Development',
    description: 'A professional website that presents your business clearly and builds trust.',
    icon: 'Globe',
  },
  {
    slug: 'landing-page',
    title: 'Landing Page Development',
    description: 'Focused single pages designed to turn visitors into enquiries.',
    icon: 'LayoutTemplate',
  },
  {
    slug: 'react-frontend',
    title: 'React Frontend Development',
    description: 'Fast, responsive user interfaces built with React.',
    icon: 'Code',
  },
  {
    slug: 'mern-fullstack',
    title: 'MERN Full-Stack Applications',
    description: 'Complete web apps with React, Node.js, Express and MongoDB.',
    icon: 'Layers',
  },
  {
    slug: 'bug-fixing',
    title: 'Website Bug Fixing',
    description: 'Find and fix issues in your existing website or web app.',
    icon: 'Bug',
  },
  {
    slug: 'responsive-design',
    title: 'Responsive Design Improvements',
    description: 'Make your site look and work well on mobile, tablet and desktop.',
    icon: 'Smartphone',
  },
  {
    slug: 'api-integration',
    title: 'REST API Integration',
    description: 'Connect your frontend with third-party or custom REST APIs.',
    icon: 'Plug',
  },
  {
    slug: 'backend-database',
    title: 'Backend and Database Development',
    description: 'Secure APIs and MongoDB databases for your application.',
    icon: 'Database',
  },
]

export const seedProjects = [
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
    liveUrl: '',
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