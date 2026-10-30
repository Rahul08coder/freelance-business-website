// Poori website ka business data yahan hai.
// Kuch badalna ho (brand name, email, links), toh sirf yeh file edit karo.

export const siteConfig = {
  brandName: 'DevLance',
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

  // Header navigation. Privacy Policy Footer mein hai
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

  // Home page hero section
  hero: {
    badge: 'Your development partner',
    headline: 'Ideas to Websites.',
    headlineAccent: 'Problems to Solutions.',
    text: "I build modern websites, web applications and fix technical problems. Let's turn your ideas into real, working products.",
    chips: [
      { label: 'Web Development', icon: 'Globe' },
      { label: 'MERN Stack', icon: 'Layers' },
      { label: 'Bug Fixing', icon: 'Bug' },
      { label: 'API Integration', icon: 'Plug' },
    ],
    secondaryCta: { label: 'View My Work', path: '/portfolio' },
  },

  // Hero ke neeche ki strip. Yeh promises hain, statistics nahi.
  // Jab tak tumhare paas real numbers na ho, fake stats mat daalna.
  highlights: [
    { title: 'Clear Communication', text: 'Quick and honest replies', icon: 'MessageSquare' },
    { title: 'Clean Code', text: 'Modern and maintainable', icon: 'Code' },
    { title: 'Realistic Timelines', text: 'Your time matters', icon: 'Clock' },
    { title: 'Long-term Support', text: 'Help after delivery', icon: 'LifeBuoy' },
  ],
};

// Services list.
// enabled: false kar do un services ke liye jo tum abhi deliver nahi kar sakte.
// Sirf enabled: true wali services website par dikhti hain.
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