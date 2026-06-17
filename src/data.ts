import classicBurgerImg from "./assets/images/classic_burger_1781182765348_1781636246008.jpg";
import crispyFriesImg from "./assets/images/crispy_fries_1781182780672_1781636259851.jpg";
import wowMilkshakeImg from "./assets/images/wow_milkshake_1781182797313_1781636274397.jpg";
import chocolateBrownieImg from "./assets/images/chocolate_brownie_1781182811278_1781636290067.jpg";

export interface Review {
  id: string;
  itemId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number; // in ETB
  category: "burgers" | "sides" | "drinks" | "desserts";
  shortDescription: string;
  fullDescription: string;
  image: string;
  ingredients: string[];
  allergens: string[];
  dietaryBadges: ("Vegetarian" | "Gluten-Free" | "Nut-Free" | "Dairy-Free" | "Spicy")[];
  calories: number;
  rating: number;
  isAvailable: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  reviewsCount: number;
}

export interface Category {
  id: "burgers" | "sides" | "drinks" | "desserts";
  title: string;
  icon: string;
  description: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: "Super Admin" | "Admin" | "Menu Manager" | "Viewer";
  avatar: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "burgers",
    title: "Burgers",
    icon: "🍔",
    description: "Premium flame-grilled gourmet beef & plant burgers",
  },
  {
    id: "sides",
    title: "Sides",
    icon: "🍟",
    description: "Golden crispy sides & loaded snacks",
  },
  {
    id: "drinks",
    title: "Drinks",
    icon: "🥤",
    description: "Artisanal shakes, sodas, and cold brews",
  },
  {
    id: "desserts",
    title: "Desserts",
    icon: "🍰",
    description: "Warm bakes & decadent sweet endings",
  },
];

// High-fidelity Unsplash images for secondary items to ensure NO blank placeholders and maintain Behance-grade food photography
export const fallbackImages = {
  truffleBurger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  baconBurger: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80",
  gardenBurger: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=600&q=80",
  onionRings: "https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=600&q=80",
  loadedWedges: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
  chocolateShake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
  mintLemonade: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
  fountainSoda: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
  applePie: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80",
};

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: "classic-wow",
    name: "The Classic Wow",
    price: 495,
    category: "burgers",
    shortDescription: "Our signature double flame-grilled beef patty with Colby Jack and Wow-Sauce.",
    fullDescription: "Designed for burger absolute purists. Two juicy 100% grass-fed Angus beef patties, melted Colby Jack cheese, fresh organic leaf lettuce, vine-ripened tomatoes, thinly sliced red onion, and our house-secret roasted garlic Wow-Sauce, piled high on a perfectly toasted golden brioche bun.",
    image: classicBurgerImg,
    ingredients: ["Beef Patty", "Cheddar Cheese", "Lettuce", "Tomato", "Pickles", "WOW Sauce", "Sesame Bun"],
    allergens: ["Wheat (Gluten)", "Dairy", "Egg"],
    dietaryBadges: [],
    calories: 780,
    rating: 4.9,
    reviewsCount: 3,
    isAvailable: true,
    isPopular: true,
  },
  {
    id: "bacon-bbq-inferno",
    name: "Bacon BBQ Inferno",
    price: 595,
    category: "burgers",
    shortDescription: "Double beef, crisp bacon, onion rings, hot cheddar, and smoky-spicy craft BBQ.",
    fullDescription: "A glorious smoky masterpiece. Two custom-blend beef patties flame-grilled to sizzling perfection, crispy Applewood smoked bacon, dynamic golden craft onion rings, sharp orange cheddar, and drizzled with our signature slow-simmered smoky-spicy chipotle BBQ sauce.",
    image: fallbackImages.baconBurger,
    ingredients: ["Beef Patty", "Bacon", "Cheddar Cheese", "Onion Rings", "BBQ Sauce", "Tomatoes", "Sesame Bun"],
    allergens: ["Wheat (Gluten)", "Dairy", "Egg"],
    dietaryBadges: ["Spicy"],
    calories: 920,
    rating: 4.8,
    reviewsCount: 2,
    isAvailable: true,
    isPopular: true,
  },
  {
    id: "truffle-forest",
    name: "The Truffle Forest",
    price: 625,
    category: "burgers",
    shortDescription: "Grass-fed beef, melted Swiss, wild mushrooms, and luxurious black truffle aioli.",
    fullDescription: "Earthy, rich, and unforgettable. Single custom-blend beef patty topped with dynamic melted Swiss cheese, folded with slow-caramelized wild forest cremini mushrooms, and painted with an exquisite black summer truffle oil garlic aioli. Served on a artisanal hot pretzel bun.",
    image: fallbackImages.truffleBurger,
    ingredients: ["Beef Patty", "Swiss Cheese", "Mushrooms", "Truffle Aioli", "Sesame Bun"],
    allergens: ["Wheat (Gluten)", "Dairy", "Egg"],
    dietaryBadges: [],
    calories: 840,
    rating: 4.7,
    reviewsCount: 1,
    isAvailable: true,
    isNew: true,
  },
  {
    id: "avocado-garden",
    name: "Avocado Garden Burger",
    price: 450,
    category: "burgers",
    shortDescription: "100% plant-based patty, smashed avocado, fresh sprouts, and vegan herb mayo.",
    fullDescription: "A vibrant, refreshing plant-powered burger. Ground organic vegetable and pea protein patty grilled key, loaded with fresh hand-mashed Hass avocados, mountain alfalfa sprouts, sliced heirloom tomatoes, crisp cucumber ribbons, and a light drenching of organic vegan garden-herb mayonnaise on a whole-wheat toast bun.",
    image: fallbackImages.gardenBurger,
    ingredients: ["Plant Patty", "Avocado", "Lettuce", "Tomato", "Vegan Mayo", "Gluten-Free Bun"],
    allergens: ["Wheat (Gluten)"],
    dietaryBadges: ["Vegetarian", "Gluten-Free"],
    calories: 590,
    rating: 4.6,
    reviewsCount: 1,
    isAvailable: true,
  },
  {
    id: "wow-fries",
    name: "Signature Wow Fries",
    price: 195,
    category: "sides",
    shortDescription: "Skin-on French fries seasoned with smoked paprika, sea salt, with garlic emulsion.",
    fullDescription: "The absolute crowd-favorite. Premium russet potato fries thick-cut skin-on, double fried in sunflower oil for the ultimate outer crunch and fluffy inside. Strown with a proprietary seasoning blend of smoked sweet paprika, marine sea salt, and fresh parsley. Accompanied by a ramekin of fresh-emulsified garlic herb confit sauce.",
    image: crispyFriesImg,
    ingredients: ["Russet Potatoes", "Paprika", "Sea Salt", "Wow Seasoning", "Garlic Dip"],
    allergens: ["Egg"],
    dietaryBadges: ["Vegetarian", "Gluten-Free", "Dairy-Free"],
    calories: 410,
    rating: 4.9,
    reviewsCount: 2,
    isAvailable: true,
    isPopular: true,
  },
  {
    id: "onion-rings",
    name: "Onion Ring Tower",
    price: 215,
    category: "sides",
    shortDescription: "Jumbo craft beer-battered sweet Spanish onions served with Honey BBQ dip.",
    fullDescription: "Towering, extra-crunchy rings cut from select sweet Spanish onions. Hand-dipped in a local amber craft beer batter, rolled in Japanese panko breadcrumbs, and flash-fried to a perfect golden sunlit glow. Served with a tangy, slow-crafted honey-infused smokehouse BBQ dipping cup.",
    image: fallbackImages.onionRings,
    ingredients: ["Onions", "Beer Batter", "Panko", "Honey BBQ Sauce"],
    allergens: ["Wheat (Gluten)"],
    dietaryBadges: ["Vegetarian", "Dairy-Free"],
    calories: 360,
    rating: 4.5,
    reviewsCount: 1,
    isAvailable: true,
  },
  {
    id: "loaded-wedges",
    name: "Loaded Cheese Wedges",
    price: 245,
    category: "sides",
    shortDescription: "Thick potato wedges smothered in warm cheddar cheese sauce, bacon, and chives.",
    fullDescription: "Hearty and unapologetically decadent. Generous batch of crispy skin-on potato wedges soaked in bubbling hot real sharp cheddar cheese sauce, crumbled crispy hardwood-smoked bacon bits, and dynamic garden-fresh green chives on top.",
    image: fallbackImages.loadedWedges,
    ingredients: ["Potato Wedges", "Cheddar Sauce", "Bacon Bits", "Chives"],
    allergens: ["Dairy"],
    dietaryBadges: [],
    calories: 540,
    rating: 4.8,
    reviewsCount: 1,
    isAvailable: true,
    isNew: true,
  },
  {
    id: "retro-strawberry",
    name: "Strawberry Shaker",
    price: 220,
    category: "drinks",
    shortDescription: "Thick luxury classic shake whipped with fresh organic strawberries and sweet vanilla.",
    fullDescription: "A nostalgic diner callback. Premium slow-churned Madagascar vanilla ice cream blended with fresh, sun-ripened organic strawberries. Topped with a heavy cloud of hand-whipped sweetened double cream and finished with an organic Italian cherry.",
    image: wowMilkshakeImg,
    ingredients: ["Strawberries", "Vanilla Ice Cream", "Whipped Cream", "Milk"],
    allergens: ["Dairy"],
    dietaryBadges: ["Vegetarian", "Gluten-Free"],
    calories: 510,
    rating: 4.9,
    reviewsCount: 2,
    isAvailable: true,
    isPopular: true,
  },
  {
    id: "chocolate-chunk-shake",
    name: "Chocolate Chunk Shaker",
    price: 240,
    category: "drinks",
    shortDescription: "Blended Belgian cocoa shake packed with dark chocolate chips and dark chocolate drizzle.",
    fullDescription: "An intense, premium treat for chocolate zealots. Organic Belgian chocolate gelato blended with thick whole cream, loaded with miniature dark chocolate chunks, painted with dynamic hot fudge ribbons, and crowned with chocolate-shaving-infused whip.",
    image: fallbackImages.chocolateShake,
    ingredients: ["Belgian Cocoa", "Chocolate Gelato", "Chocolate Chips", "Whipped Cream"],
    allergens: ["Dairy", "Soy"],
    dietaryBadges: ["Vegetarian", "Gluten-Free"],
    calories: 580,
    rating: 4.7,
    reviewsCount: 1,
    isAvailable: true,
  },
  {
    id: "craft-lemonade",
    name: "Craft Mint Lemonade",
    price: 150,
    category: "drinks",
    shortDescription: "House cold-pressed lemonade infused with fresh peppermint leaves and pure cane sugar.",
    fullDescription: "The physical definition of pure refreshment. Made daily in-house using cold-pressed, organic Eureka lemons, filtered spring water, hand-bruised wild garden peppermint leaves, and sweetened lightly with raw organic cane sugar syrup. Served on crushed ice.",
    image: fallbackImages.mintLemonade,
    ingredients: ["Fresh Lemons", "Mint Leaves", "Cane Sugar", "Spring Water"],
    allergens: [],
    dietaryBadges: ["Vegetarian", "Gluten-Free", "Nut-Free", "Dairy-Free"],
    calories: 120,
    rating: 4.6,
    reviewsCount: 2,
    isAvailable: true,
    isNew: true,
  },
  {
    id: "fountain-soda",
    name: "Chilled Fountain Soda",
    price: 95,
    category: "drinks",
    shortDescription: "Classic refreshing soda poured extra-cold over premium crushed ice.",
    fullDescription: "State-of-the-art highly carbonated fountain pour. Choose from Coca-Cola, Diet Coke, Dr. Pepper, or Sprite. Served in a bio-compostable diner cup over signature crystal crushed ice.",
    image: fallbackImages.fountainSoda,
    ingredients: ["Soda Fountain Syrup", "Carbonated Water", "Crushed Ice"],
    allergens: [],
    dietaryBadges: ["Vegetarian", "Gluten-Free", "Nut-Free", "Dairy-Free"],
    calories: 140,
    rating: 4.4,
    reviewsCount: 0,
    isAvailable: true,
  },
  {
    id: "fudge-lava",
    name: "Fudge-Lava brownie",
    price: 295,
    category: "desserts",
    shortDescription: "Warm decadent flourless brownie topped with Madagascar vanilla ice cream and hot fudge.",
    fullDescription: "A show-stopping dessert of hot and cold contrasts. A rich, heavy, flourless dark chocolate fudge brownie warmed until the center is lava-soft. Crowned of a premium scoop of slow-churned Madagascar vanilla bean gelato, and finished with a molten hand-drizzle of hot dark chocolate fudge syrup.",
    image: chocolateBrownieImg,
    ingredients: ["Flourless Brownie", "Vanilla Ice Cream", "Hot Fudge Syrup"],
    allergens: ["Dairy", "Egg", "Soy"],
    dietaryBadges: ["Vegetarian", "Gluten-Free", "Nut-Free"],
    calories: 640,
    rating: 4.9,
    reviewsCount: 2,
    isAvailable: true,
    isPopular: true,
  },
  {
    id: "caramel-apple-pie",
    name: "Caramel Apple Pie Bar",
    price: 265,
    category: "desserts",
    shortDescription: "Flaky butter pastry baked with spiced Granny Smith apples and warm sea-salt caramel.",
    fullDescription: "Traditional warm comfort with a modern twist. An individual flaky golden butter crust bar packed with caramelized Granny Smith apple slices spiced with Saigon cinnamon and nutmeg. Finished with a dynamic drizzling of house-made buttery sea-salt caramel sauce.",
    image: fallbackImages.applePie,
    ingredients: ["Butter Pastry", "Granny Smith Apples", "Saigon Cinnamon", "Caramel Sauce"],
    allergens: ["Wheat (Gluten)", "Dairy"],
    dietaryBadges: ["Vegetarian", "Nut-Free"],
    calories: 480,
    rating: 4.5,
    reviewsCount: 1,
    isAvailable: true,
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    itemId: "classic-wow",
    customerName: "Sileshi Kebede",
    rating: 5,
    comment: "This is hands-down the best burger in Addis! The Colby Jack cheese melts perfectly, and that signature WOW sauce is purely magical. Double patty is incredibly juicy.",
    date: "2026-06-14",
  },
  {
    id: "rev-2",
    itemId: "classic-wow",
    customerName: "Helena Yoseph",
    rating: 5,
    comment: "Excellent high-welfare beef quality and the lettuce is super crunchy. Loved fast mobile browsing via the table QR code. Recommended!",
    date: "2026-06-15",
  },
  {
    id: "rev-3",
    itemId: "bacon-bbq-inferno",
    customerName: "Mulugeta Alula",
    rating: 4,
    comment: "Super rich smoky-spicy flavor! The onion rings inside give a perfect crunch. A little messy to eat, but absolutely worth it.",
    date: "2026-06-12",
  },
  {
    id: "rev-4",
    itemId: "wow-fries",
    customerName: "Betelhem Tariku",
    rating: 5,
    comment: "Crispy on the outside, fluffy inside, and seasoned to perfection with smoked paprika and sea salt. Best fries in town!",
    date: "2026-06-16",
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: "usr-1",
    username: "superadmin",
    fullName: "Dawit Wolde",
    role: "Super Admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "usr-2",
    username: "burgeradmin",
    fullName: "Helen Samuel",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "usr-3",
    username: "menumanager",
    fullName: "Kidus Daniel",
    role: "Menu Manager",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "usr-4",
    username: "viewer",
    fullName: "Eskinder Yohannes",
    role: "Viewer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
];
