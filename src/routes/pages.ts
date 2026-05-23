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
    description: 'Keep and remember a value even when the page updates.',
  },
  {
    path: '/use-effect',
    title: 'Use Effect',
    description: 'Run a code in an arrow function when something changes or after rendering.',
  },
  {
    path: '/use-memo',
    title: 'Use Memo',
    description: 'Remember a computed value so you dont recalculate it unnecessarily.',
  },
  {
    path: '/use-callback',
    title: 'Use Callback',
    description: 'Keeps a fucntion and reuse it unless something important changes.',
  },
  {
    path: '/use-context',
    title: 'Use Context',
    description: 'Access shared data from a parent component without props drilling.',
  },
]
