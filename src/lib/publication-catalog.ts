export type PublicationCategory = "books" | "games";
export type ProductFilter = "all" | "games" | "books" | "wisdom";

export interface PublicationProduct {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  category: PublicationCategory;
  subCategory: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  targetAge: string;
  badges: string[];
  features: string[];
  cover: string;
  chapters?: { title: string; excerpt: string }[];
  featured?: boolean;
}

export const PUBLICATIONS: PublicationProduct[] = [
  {
    id: "game-english",
    slug: "eyecue-iq-developer-english",
    title: "EyeCue (IQ Developer): English Edition",
    category: "games",
    subCategory: "cognitive-development",
    tagline: "A quick-fire card game for sharper pattern recognition and screen-free focus.",
    description:
      "EyeCue is a lively matching game made to bring friends and families together around pattern recognition, quick reactions, and cognitive play—without another screen.",
    price: 350,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 142,
    targetAge: "Age 10–99",
    badges: ["Bestseller", "Screen-Free"],
    features: ["55 dual-sided visual cards", "15-minute rounds", "For 2–6 players"],
    cover: "cover-game",
    featured: true,
  },
  {
    id: "game-hindi",
    slug: "eyecue-iq-developer-hindi",
    title: "EyeCue (IQ Developer): Hindi Edition",
    category: "games",
    subCategory: "cognitive-development",
    tagline: "Language, visual memory, and fast thinking meet in a family-friendly game.",
    description:
      "Bring Hindi characters, familiar idioms, and quick-reflex challenges to game night. A screen-free format for practicing recall together.",
    price: 350,
    originalPrice: 499,
    rating: 4.8,
    reviewsCount: 88,
    targetAge: "Age 10–99",
    badges: ["Language Play", "Family Game"],
    features: ["Pictorial visual cues", "Quick-reflex gameplay", "Made for family game nights"],
    cover: "cover-hindi",
    featured: true,
  },
  {
    id: "game-celebrities",
    slug: "eyecue-iq-developer-celebrities",
    title: "EyeCue: Iconic Figures & Celebrities",
    category: "games",
    subCategory: "cognitive-development",
    tagline: "A quick visual recall game featuring personalities and pop culture.",
    description:
      "Put facial recognition, speed recall, and general knowledge to the test with a quick, social matching game.",
    price: 350,
    originalPrice: 499,
    rating: 4.7,
    reviewsCount: 64,
    targetAge: "Age 12–40",
    badges: ["Party Game", "Fast Recall"],
    features: ["50+ iconic personalities", "Quick quiz mechanics", "Play as a group"],
    cover: "cover-celebrity",
  },
  {
    id: "game-elements",
    slug: "eyecue-iq-developer-elements",
    title: "EyeCue: Science & Elements",
    category: "games",
    subCategory: "cognitive-development",
    tagline: "Make periodic patterns a spirited matching challenge.",
    description:
      "Turn science and elemental concepts into a lively matching game built around visual cues and quick thinking.",
    price: 350,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 53,
    targetAge: "Age 12–25",
    badges: ["Science & Play", "Study Break"],
    features: ["Element matching", "Visual pattern challenges", "Quick group rounds"],
    cover: "cover-elements",
  },
  {
    id: "game-animals",
    slug: "eyecue-iq-developer-animals",
    title: "EyeCue: Wildlife & Nature",
    category: "games",
    subCategory: "cognitive-development",
    tagline: "A playful biodiversity and attention-to-detail challenge.",
    description:
      "Spot visual patterns, notice nature, and bring screen-free play to the table or on the go.",
    price: 350,
    originalPrice: 499,
    rating: 4.8,
    reviewsCount: 79,
    targetAge: "Age 8–40",
    badges: ["Family Favorite", "Nature"],
    features: ["Biodiversity themes", "Visual spotting rounds", "Pocket-friendly play"],
    cover: "cover-nature",
  },
  {
    id: "book-consciousness",
    slug: "science-of-consciousness",
    title: "Science of Consciousness",
    originalTitle: "Science of Consciousness",
    category: "books",
    subCategory: "mind-consciousness",
    tagline: "Explore the observer through the meeting of modern thought and Vedantic ideas.",
    description:
      "An approachable introduction to subjective perception, neurobiology, and classical Indian models of consciousness for curious modern readers.",
    price: 99,
    originalPrice: 150,
    rating: 4.9,
    reviewsCount: 215,
    targetAge: "Age 16–40",
    badges: ["Bestseller", "Mind & Thought"],
    features: ["120-page quick-read format", "Diagrams of the mind", "Practical reflection prompts"],
    cover: "cover-consciousness",
    chapters: [
      {
        title: "Chapter 1 · The Observer Problem",
        excerpt:
          "When modern physics began asking what observation means, old philosophical traditions offered a rich vocabulary for asking the same human question: what is it that knows an experience?",
      },
      {
        title: "Chapter 3 · The Architecture of Thought",
        excerpt:
          "How do memory, identity, and discernment shape the way we meet a moment? Begin with the everyday experience, then look more closely at its moving parts.",
      },
    ],
    featured: true,
  },
  {
    id: "book-samkhya",
    slug: "samkhyakarika",
    title: "Samkhyakarika: The Code of Pure Logic",
    originalTitle: "सांख्यकारिका",
    category: "books",
    subCategory: "ancient-logic",
    tagline: "A classical work of Indian philosophy, presented for today’s critical reader.",
    description:
      "Ishvarakrishna’s 72 verses meet clear commentary on inquiry, suffering, and discernment between the material world and consciousness.",
    price: 300,
    originalPrice: 450,
    rating: 4.8,
    reviewsCount: 112,
    targetAge: "Age 18–40",
    badges: ["Foundational Philosophy", "Critical Thinking"],
    features: ["Sanskrit verses with commentary", "Hindi and English explanation", "Analytical logic tables"],
    cover: "cover-logic",
    chapters: [
      {
        title: "Verse 1 · The Threefold Distress",
        excerpt:
          "Because of the onslaught of three kinds of pain, there arises the quest to discover their remedy. A rigorous opening to the work’s central inquiry.",
      },
    ],
    featured: true,
  },
  {
    id: "book-anyachcha",
    slug: "anyachcha",
    title: "Anyachcha: Contemporary Perspectives",
    originalTitle: "अन्यच्च",
    category: "books",
    subCategory: "wisdom-tales",
    tagline: "Essays on society, ethics, and the questions shaping modern life.",
    description:
      "A collection of philosophical essays reflecting on information overload, digital disconnection, and the search for purpose.",
    price: 300,
    originalPrice: 400,
    rating: 4.7,
    reviewsCount: 78,
    targetAge: "Age 16–40",
    badges: ["Modern Essays", "Society & Ethics"],
    features: ["Concise standalone chapters", "Essays on modern dilemmas", "Engaging contemporary prose"],
    cover: "cover-essay",
  },
  {
    id: "book-kathashatavallari",
    slug: "kathashatavallari",
    title: "Katha Shata Vallari: 100 Life-Transforming Tales",
    originalTitle: "कथाशतवल्लरी",
    category: "books",
    subCategory: "wisdom-tales",
    tagline: "Bite-sized stories about courage, empathy, leadership, and resilience.",
    description:
      "One hundred short tales that invite reflection on strategic patience, leadership, empathy, and moral courage.",
    price: 300,
    originalPrice: 450,
    rating: 4.9,
    reviewsCount: 189,
    targetAge: "Age 12–40",
    badges: ["100 Stories", "Bite-Sized Reads"],
    features: ["100 short stories", "Around three minutes per chapter", "A story for everyday reflection"],
    cover: "cover-stories",
    featured: true,
  },
  {
    id: "book-tyagamurti",
    slug: "tyagamurti-ahalya",
    title: "Tyagamurti Ahalya: Resurrecting Dignity",
    originalTitle: "त्यागमूर्तिरहल्या",
    category: "books",
    subCategory: "wisdom-tales",
    tagline: "A poetic narrative about grace, dignity, and resilience.",
    description:
      "A narrative reinterpretation of Queen Ahalya’s life, exploring resilience in the face of judgement and spiritual fortitude.",
    price: 150,
    originalPrice: 200,
    rating: 4.6,
    reviewsCount: 65,
    targetAge: "Age 14–40",
    badges: ["Literary Classic", "Resilience"],
    features: ["Poetic storytelling", "Historical context", "A story of resilience"],
    cover: "cover-ahalya",
  },
  {
    id: "book-manuj-puran",
    slug: "manuj-purana",
    title: "Manuj Purana: The Epic of Human Evolution",
    originalTitle: "मनुज पुराण",
    category: "books",
    subCategory: "ancient-logic",
    tagline: "A reflection on human potential, morality, and cosmic cycles.",
    description:
      "A contemporary reading of human destiny, cultural epics, and the questions that shape an uncertain future.",
    price: 300,
    originalPrice: 420,
    rating: 4.7,
    reviewsCount: 84,
    targetAge: "Age 18–40",
    badges: ["Philosophy", "Epic Perspective"],
    features: ["Comparative mythology", "Chronological perspectives", "Cultural epics reframed"],
    cover: "cover-epic",
  },
  {
    id: "book-vishnu-sahasranama",
    slug: "shri-vishnu-sahasranamastotram",
    title: "Shri Vishnu Sahasranamastotram: The Science of Sound & Attributes",
    originalTitle: "श्रीविष्णुसहस्रनामस्तोत्रम्",
    category: "books",
    subCategory: "mind-consciousness",
    tagline: "Sanskrit, sound, and concentration in a pocket-sized edition.",
    description:
      "A Sanskrit text with phonetic transliteration and commentary on the thousand names, approached as a practice in attention and meaning.",
    price: 50,
    originalPrice: 100,
    rating: 4.9,
    reviewsCount: 310,
    targetAge: "Age 12–99",
    badges: ["Daily Practice", "Pocket Edition"],
    features: ["Devanagari text", "English meaning", "Compact pocket edition"],
    cover: "cover-sound",
  },
];

export function getPublication(slug: string) {
  return PUBLICATIONS.find((publication) => publication.slug === slug);
}

export function formatRupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}