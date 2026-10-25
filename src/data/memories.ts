export interface Photo {
  id: string;
  filename: string;
  path: string;
  alt: string;
  caption?: string;
  section: string;
  order: number;
  primary?: boolean;
}

export interface KonkaniPhrase {
  id: string;
  phrase: string; // Konkani text
  translation?: string; // English translation
  section?: string; // Which section to display in
  audioFile?: string; // filename in public/audio/
  title?: string; // Accessible title for the recording
}

export interface Memory {
  id: string;
  title: string;
  content: string[];
  photos: string[]; // photo IDs
}

export const photos: Photo[] = [
  {
    id: 'best-photo',
    filename: 'Me and Mom best photo.png',
    path: '/images/Me and Mom best photo.png',
    alt: 'Me and Mom our best photo together',
    caption: 'Me and Mom our best photo',
    section: 'featured',
    order: 1,
    primary: true,
  },
  {
    id: 'mummy-young',
    filename: 'Mummy Young.jpg',
    path: '/images/Mummy Young.jpg',
    alt: "Mummy's college trip with friends",
    caption: "Mummy's college days",
    section: 'her-journey',
    order: 1,
  },
  {
    id: 'mummy-munj',
    filename: 'Mummy Munj.jpg',
    path: '/images/Mummy Munj.jpg',
    alt: 'Mummy candid solo photo',
    caption: 'A candid moment with Mummy',
    section: 'her-journey',
    order: 2,
  },
  {
    id: 'mummy-phula',
    filename: 'Mummy Phula.jpg',
    path: '/images/Mummy Phula.jpg',
    alt: 'Mummy pregnant with me',
    caption: 'Before I could remember',
    section: 'before-remember',
    order: 1,
    primary: true,
  },
  {
    id: 'mummy-my-birthday',
    filename: 'Mummy My Birthday.jpg',
    path: '/images/Mummy My Birthday.jpg',
    alt: 'Me and Mummy on my birthday',
    caption: 'Me and Mummy on my birthday',
    section: 'third-birthday',
    order: 1,
    primary: true,
  },
  {
    id: 'full-family-munj',
    filename: 'Full Family Munj.jpg',
    path: '/images/Full Family Munj.jpg',
    alt: 'Our whole family together',
    caption: 'Our whole family Full Family Munj',
    section: 'family',
    order: 1,
    primary: true,
  },
  {
    id: 'mummy-and-aai',
    filename: 'Mummy and Aai.jpg',
    path: '/images/Mummy and Aai.jpg',
    alt: 'Mummy with her mom Aai',
    caption: 'Mummy and Aai',
    section: 'collage',
    order: 1,
  },
  {
    id: 'me-and-mummy-munj-final',
    filename: 'Me and Mummy Munj Final.jpg',
    path: '/images/Me and Mummy Munj Final.jpg',
    alt: 'Me and Mummy',
    caption: 'Me and Mummy',
    section: 'collage',
    order: 2,
  },
  {
    id: 'me-and-mummy-munj-final-1',
    filename: 'Me and Mummy Munj FInal 1.jpg',
    path: '/images/Me and Mummy Munj FInal 1.jpg',
    alt: 'Me and Mummy',
    caption: 'Another moment with Mummy',
    section: 'collage',
    order: 3,
  },
];

export const konkaniPhrases: KonkaniPhrase[] = [
  {
    id: 'mummy-love',
    phrase: 'Mummy, tu mhaka mhanta ki tuji bashen avai parat malna zalyar puro… punn sadda hau hech magta devakade ki tu avai mhan meltale zalyar uch jeevan zai nazalyar naka. ❤️',
    section: 'konkani-voice',
    title: 'A phrase from the heart',
  },
];

export const getPhotosBySection = (section: string): Photo[] => {
  return photos
    .filter(photo => photo.section === section)
    .sort((a, b) => a.order - b.order);
};

export const getPhotoById = (id: string): Photo | undefined => {
  return photos.find(photo => photo.id === id);
};
