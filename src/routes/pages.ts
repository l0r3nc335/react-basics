export type PageMeta = {
  path: string
  title: string
  description: string
}

export const pages: PageMeta[] = [
  {
    path: '/home',
    title: 'Home',
    description: 'Vite + React starter with the counter component.',
  },
  {
    path: '/about',
    title: 'About',
    description: 'Your first custom page — duplicate this folder to add more.',
  },
  {
    path: '/use-state',
    title: 'Use State',
    description: 'Learn and practice React useState.',
  },
]
