// Poori website ka business data yahan hai.
// Kuch badalna ho (brand name, email, links), toh sirf yeh file edit karo.

export const siteConfig = {
  brandName: 'DevLence',
  tagline: 'Websites and web apps built for your business',
  description:
    'Freelance web developer building business websites, landing pages and MERN stack applications.',

  // Contact details
  email: 'Rahulsinghsnd12345@gmail.com',
  location: 'India',

  // Khaali string '' rakhoge toh Footer/Contact mein woh link dikhega hi nahi
  socials: {
    github: 'https://github.com/Rahul08coder',
    linkedin: '',
    twitter: '',
  },

  // Header navigation. Privacy Policy Footer mein jayegi (Day 5)
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Contact', path: '/contact' },
  ],

  // Main call-to-action button
  cta: { label: 'Start a Project', path: '/start-project' },

  footerLinks: [{ label: 'Privacy Policy', path: '/privacy-policy' }],
};

// Services list.
// enabled: false kar do un services ke liye jo tum abhi deliver nahi kar sakte.
// Sirf enabled: true wali services website par dikhengi (Day 6 se).
// Price abhi jaanbujhkar nahi diya hai. Jab tum decide karo tab add karenge.
export const services = [
  {
    id: 'business-website',
    title: 'Business Website Development',
    description: 'A professional website that presents your business clearly and builds trust.',
    icon: 'Globe',
    enabled: true,
  },
  {
    id: 'landing-page',
    title: 'Landing Page Development',
    description: 'Focused single pages designed to turn visitors into enquiries.',
    icon: 'LayoutTemplate',
    enabled: true,
  },
  {
    id: 'react-frontend',
    title: 'React Frontend Development',
    description: 'Fast, responsive user interfaces built with React.',
    icon: 'Code',
    enabled: true,
  },
  {
    id: 'mern-fullstack',
    title: 'MERN Full-Stack Applications',
    description: 'Complete web apps with React, Node.js, Express and MongoDB.',
    icon: 'Layers',
    enabled: true,
  },
  {
    id: 'bug-fixing',
    title: 'Website Bug Fixing',
    description: 'Find and fix issues in your existing website or web app.',
    icon: 'Bug',
    enabled: true,
  },
  {
    id: 'responsive-design',
    title: 'Responsive Design Improvements',
    description: 'Make your site look and work well on mobile, tablet and desktop.',
    icon: 'Smartphone',
    enabled: true,
  },
  {
    id: 'api-integration',
    title: 'REST API Integration',
    description: 'Connect your frontend with third-party or custom REST APIs.',
    icon: 'Plug',
    enabled: true,
  },
  {
    id: 'backend-database',
    title: 'Backend and Database Development',
    description: 'Secure APIs and MongoDB databases for your application.',
    icon: 'Database',
    enabled: true,
  },
];