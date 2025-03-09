import { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 1,
    title: 'DISQUIET',
    description: {
      en: 'Disquiet is a social networking service for people who love building softwares. Our mission is to instigate more creation of tasteful softwares by connecting them. We do this by creating a space where builders can express, inspire, meet, and build as a community.',
      ko: '디스콰이엇은 소프트웨어를 사랑하는 사람들을 위한 소셜 네트워크 서비스입니다. 우리의 미션은 메이커들을 연결함으로써 감각적인 소프트웨어가 더 많이 생겨나도록 만드는 것입니다. 이를 위해 메이커들이 자신을 표현하고, 영감을 주고받으며, 서로 만나며 성장할 수 있는 공간을 제공합니다.'
    },
    year: '2022',
    imageUrl: '/projects-image/disquiet-1.jpeg',
    projectUrl: 'https://disquiet.io/',
    category: 'startup'
  },
  {
    id: 2,
    title: 'We Are All Banksy',
    description: {
      en: 'We Are All Banksy',
      ko: 'We Are All Banksy'
    },
    year: '2024',
    imageUrl: '',
    projectUrl: 'https://chromewebstore.google.com/detail/we-are-all-banksy/dkmagekikpacoieehgabbombcellagmp',
    category: 'for fun'
  },
  {
    id: 3,
    title: 'Daisy (recommended on desktop)',
    description: {
      en: ' ',
      ko: ' '
    },
    year: '2025',
    imageUrl: '',
    projectUrl: 'https://daisy-teal.vercel.app/',
    category: 'design'
  },
  {
    id: 4,
    title: 'Grass',
    description: {
      en: ' ',
      ko: ' '
    },
    year: '2025',
    imageUrl: '',
    projectUrl: 'https://grass-doeon.vercel.app/',
    category: '3d'
  },
  {
    id: 5,
    title: 'Zen Friend',
    description: {
      en: ' ',
      ko: ' '
    },
    year: '2025',
    imageUrl: '',
    projectUrl: 'https://zen-friend.vercel.app/',
    category: 'ai talk'
  },
  {
    id: 6,
    title: "Verae (wasd kl;')",
    description: {
      en: ' ',
      ko: ' '
    },
    year: '2025',
    imageUrl: '',
    projectUrl: 'https://verae.vercel.app/',
    category: '3d'
  },
  {
    id: 7,
    title: 'Space Zero',
    description: {
      en: ' ',
      ko: ' '
    },
    year: '2025',
    imageUrl: '',
    projectUrl: 'https://0.space/',
    category: 'game'
  }
];
