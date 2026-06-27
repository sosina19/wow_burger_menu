import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "db.json");

export interface UserDB {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  passwordHash: string;
  role: "Super Admin" | "Manager" | "Employee";
  status: "Active" | "Inactive";
  avatar: string;
}

export interface MenuItemDB {
  id: string;
  name: string;
  price: number;
  category: "burgers" | "sides" | "drinks" | "desserts";
  shortDescription: string;
  fullDescription: string;
  image: string; // primary image path or URL
  ingredients: string[];
  allergens: string[];
  dietaryBadges: string[];
  calories: number;
  rating: number;
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  reviewsCount: number;
  viewCount: number;
  dateAdded: string;
}

export interface ItemImageDB {
  id: string;
  itemId: string;
  imagePath: string;
  isPrimary: boolean;
}

export interface OfferDB {
  id: number;
  title: string;
  subtitle: string;
  promoCode: string;
  discountPercent: number;
  validity: string;
  isActive: boolean;
}

export interface BannerDB {
  id: number;
  title: string;
  kicker: string;
  imageUrl: string;
  ctaText: string;
  isLive: boolean;
}

export interface IngredientStockDB {
  id: number;
  name: string;
  quantity: number;
  minStock: number;
  unit: string;
  supplier: string;
  status: "Good" | "Low Stock" | "Out of Stock";
}

export interface ActivityLogDB {
  id: string;
  username: string;
  timestamp: string;
  ip: string;
  action: string;
  status: string;
}

export interface ReviewDB {
  id: string;
  itemId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface OrderItemDB {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  itemName?: string;
}

export interface OrderDB {
  id: string;
  customerName: string;
  phone: string;
  tableNumber: string;
  totalPrice: number;
  status: "Pending" | "Accepted" | "Preparing" | "Ready" | "Completed" | "Cancelled";
  notes?: string;
  createdAt: string;
  items: OrderItemDB[];
}

interface DBStructure {
  users: UserDB[];
  menuItems: MenuItemDB[];
  itemImages: ItemImageDB[];
  offers: OfferDB[];
  banners: BannerDB[];
  ingredients: IngredientStockDB[];
  activityLogs: ActivityLogDB[];
  reviews: ReviewDB[];
  orders: OrderDB[];
}

// Initial default data seed helper
function getInitialDB(): DBStructure {
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync("admin123", salt);

  return {
    users: [
      {
        id: "usr-1",
        firstName: "Dawit",
        lastName: "Wolde",
        email: "dawit@wowburger.com",
        phone: "+251911000001",
        username: "superadmin",
        passwordHash: defaultPasswordHash,
        role: "Super Admin",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      },
      {
        id: "usr-2",
        firstName: "Helen",
        lastName: "Samuel",
        email: "helen@wowburger.com",
        phone: "+251911000002",
        username: "helen",
        passwordHash: defaultPasswordHash,
        role: "Manager",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      },
      {
        id: "usr-3",
        firstName: "Kidus",
        lastName: "Daniel",
        email: "kidus@wowburger.com",
        phone: "+251911000003",
        username: "menumanager",
        passwordHash: defaultPasswordHash,
        role: "Manager",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      },
      {
        id: "usr-4",
        firstName: "Eskinder",
        lastName: "Yohannes",
        email: "eskinder@wowburger.com",
        phone: "+251911000004",
        username: "employee",
        passwordHash: defaultPasswordHash,
        role: "Employee",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      }
    ],
    menuItems: [
      {
        id: "classic-wow",
        name: "The Classic Wow",
        price: 495,
        category: "burgers",
        shortDescription: "Our signature double flame-grilled beef patty with Colby Jack and Wow-Sauce.",
        fullDescription: "Designed for burger absolute purists. Two juicy 100% grass-fed Angus beef patties, melted Colby Jack cheese, fresh organic leaf lettuce, vine-ripened tomatoes, thinly sliced red onion, and our house-secret roasted garlic Wow-Sauce, piled high on a perfectly toasted golden brioche bun.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Beef Patty", "Cheddar Cheese", "Lettuce", "Tomato", "Pickles", "WOW Sauce", "Sesame Bun"],
        allergens: ["Wheat (Gluten)", "Dairy", "Egg"],
        dietaryBadges: [],
        calories: 780,
        rating: 4.9,
        reviewsCount: 3,
        viewCount: 145,
        isAvailable: true,
        isPopular: true,
        isNew: false,
        dateAdded: "2026-06-01T12:00:00.000Z"
      },
      {
        id: "bacon-bbq-inferno",
        name: "Bacon BBQ Inferno",
        price: 595,
        category: "burgers",
        shortDescription: "Double beef, crisp bacon, onion rings, hot cheddar, and smoky-spicy craft BBQ.",
        fullDescription: "A glorious smoky masterpiece. Two custom-blend beef patties flame-grilled to sizzling perfection, crispy Applewood smoked bacon, dynamic golden craft onion rings, sharp orange cheddar, and drizzled with our signature slow-simmered smoky-spicy chipotle BBQ sauce.",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Beef Patty", "Bacon", "Cheddar Cheese", "Onion Rings", "BBQ Sauce", "Tomatoes", "Sesame Bun"],
        allergens: ["Wheat (Gluten)", "Dairy", "Egg"],
        dietaryBadges: ["Spicy"],
        calories: 920,
        rating: 4.8,
        reviewsCount: 2,
        viewCount: 112,
        isAvailable: true,
        isPopular: true,
        isNew: false,
        dateAdded: "2026-06-05T14:30:00.000Z"
      },
      {
        id: "truffle-forest",
        name: "The Truffle Forest",
        price: 625,
        category: "burgers",
        shortDescription: "Grass-fed beef, melted Swiss, wild mushrooms, and luxurious black truffle aioli.",
        fullDescription: "Earthy, rich, and unforgettable. Single custom-blend beef patty topped with dynamic melted Swiss cheese, folded with slow-caramelized wild forest cremini mushrooms, and painted with an exquisite black summer truffle oil garlic aioli. Served on a artisanal hot pretzel bun.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Beef Patty", "Swiss Cheese", "Mushrooms", "Truffle Aioli", "Sesame Bun"],
        allergens: ["Wheat (Gluten)", "Dairy", "Egg"],
        dietaryBadges: [],
        calories: 840,
        rating: 4.7,
        reviewsCount: 1,
        viewCount: 89,
        isAvailable: true,
        isPopular: false,
        isNew: true,
        dateAdded: "2026-06-10T11:15:00.000Z"
      },
      {
        id: "avocado-garden",
        name: "Avocado Garden Burger",
        price: 450,
        category: "burgers",
        shortDescription: "100% plant-based patty, smashed avocado, fresh sprouts, and vegan herb mayo.",
        fullDescription: "A vibrant, refreshing plant-powered burger. Ground organic vegetable and pea protein patty grilled key, loaded with fresh hand-mashed Hass avocados, mountain alfalfa sprouts, sliced heirloom tomatoes, crisp cucumber ribbons, and a light drenching of organic vegan garden-herb mayonnaise on a whole-wheat toast bun.",
        image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Plant Patty", "Avocado", "Lettuce", "Tomato", "Vegan Mayo", "Gluten-Free Bun"],
        allergens: ["Wheat (Gluten)"],
        dietaryBadges: ["Vegetarian", "Gluten-Free"],
        calories: 590,
        rating: 4.6,
        reviewsCount: 1,
        viewCount: 64,
        isAvailable: true,
        isPopular: false,
        isNew: false,
        dateAdded: "2026-06-12T09:00:00.000Z"
      },
      {
        id: "wow-fries",
        name: "Signature Wow Fries",
        price: 195,
        category: "sides",
        shortDescription: "Skin-on French fries seasoned with smoked paprika, sea salt, with garlic emulsion.",
        fullDescription: "The absolute crowd-favorite. Premium russet potato fries thick-cut skin-on, double fried in sunflower oil for the ultimate outer crunch and fluffy inside. Strown with a proprietary seasoning blend of smoked sweet paprika, marine sea salt, and fresh parsley. Accompanied by a ramekin of fresh-emulsified garlic herb confit sauce.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Russet Potatoes", "Paprika", "Sea Salt", "Wow Seasoning", "Garlic Dip"],
        allergens: ["Egg"],
        dietaryBadges: ["Vegetarian", "Gluten-Free", "Dairy-Free"],
        calories: 410,
        rating: 4.9,
        reviewsCount: 2,
        viewCount: 195,
        isAvailable: true,
        isPopular: true,
        isNew: false,
        dateAdded: "2026-06-02T10:00:00.000Z"
      },
      {
        id: "onion-rings",
        name: "Onion Ring Tower",
        price: 215,
        category: "sides",
        shortDescription: "Jumbo craft beer-battered sweet Spanish onions served with Honey BBQ dip.",
        fullDescription: "Towering, extra-crunchy rings cut from select sweet Spanish onions. Hand-dipped in a local amber craft beer batter, rolled in Japanese panko breadcrumbs, and flash-fried to a perfect golden sunlit glow. Served with a tangy, slow-crafted honey-infused smokehouse BBQ dipping cup.",
        image: "https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Onions", "Beer Batter", "Panko", "Honey BBQ Sauce"],
        allergens: ["Wheat (Gluten)"],
        dietaryBadges: ["Vegetarian", "Dairy-Free"],
        calories: 360,
        rating: 4.5,
        reviewsCount: 1,
        viewCount: 42,
        isAvailable: true,
        isPopular: false,
        isNew: false,
        dateAdded: "2026-06-04T15:00:00.000Z"
      },
      {
        id: "loaded-wedges",
        name: "Loaded Cheese Wedges",
        price: 245,
        category: "sides",
        shortDescription: "Thick potato wedges smothered in warm cheddar cheese sauce, bacon, and chives.",
        fullDescription: "Hearty and unapologetically decadent. Generous batch of crispy skin-on potato wedges soaked in bubbling hot real sharp cheddar cheese sauce, crumbled crispy hardwood-smoked bacon bits, and dynamic garden-fresh green chives on top.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Potato Wedges", "Cheddar Sauce", "Bacon Bits", "Chives"],
        allergens: ["Dairy"],
        dietaryBadges: [],
        calories: 540,
        rating: 4.8,
        reviewsCount: 1,
        viewCount: 78,
        isAvailable: true,
        isPopular: false,
        isNew: true,
        dateAdded: "2026-06-15T16:20:00.000Z"
      },
      {
        id: "retro-strawberry",
        name: "Strawberry Shaker",
        price: 220,
        category: "drinks",
        shortDescription: "Thick luxury classic shake whipped with fresh organic strawberries and sweet vanilla.",
        fullDescription: "A nostalgic diner callback. Premium slow-churned Madagascar vanilla ice cream blended with fresh, sun-ripened organic strawberries. Topped with a heavy cloud of hand-whipped sweetened double cream and finished with an organic Italian cherry.",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Strawberries", "Vanilla Ice Cream", "Whipped Cream", "Milk"],
        allergens: ["Dairy"],
        dietaryBadges: ["Vegetarian", "Gluten-Free"],
        calories: 510,
        rating: 4.9,
        reviewsCount: 2,
        viewCount: 130,
        isAvailable: true,
        isPopular: true,
        isNew: false,
        dateAdded: "2026-06-03T11:45:00.000Z"
      },
      {
        id: "chocolate-chunk-shake",
        name: "Chocolate Chunk Shaker",
        price: 240,
        category: "drinks",
        shortDescription: "Blended Belgian cocoa shake packed with dark chocolate chips and dark chocolate drizzle.",
        fullDescription: "An intense, premium treat for chocolate zealots. Organic Belgian chocolate gelato blended with thick whole cream, loaded with miniature dark chocolate chunks, painted with dynamic hot fudge ribbons, and crowned with chocolate-shaving-infused whip.",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Belgian Cocoa", "Chocolate Gelato", "Chocolate Chips", "Whipped Cream"],
        allergens: ["Dairy", "Soy"],
        dietaryBadges: ["Vegetarian", "Gluten-Free"],
        calories: 580,
        rating: 4.7,
        reviewsCount: 1,
        viewCount: 95,
        isAvailable: true,
        isPopular: false,
        isNew: false,
        dateAdded: "2026-06-08T13:10:00.000Z"
      },
      {
        id: "craft-lemonade",
        name: "Craft Mint Lemonade",
        price: 150,
        category: "drinks",
        shortDescription: "House cold-pressed lemonade infused with fresh peppermint leaves and pure cane sugar.",
        fullDescription: "The physical definition of pure refreshment. Made daily in-house using cold-pressed, organic Eureka lemons, filtered spring water, hand-bruised wild garden peppermint leaves, and sweetened lightly with raw organic cane sugar syrup. Served on crushed ice.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Fresh Lemons", "Mint Leaves", "Cane Sugar", "Spring Water"],
        allergens: [],
        dietaryBadges: ["Vegetarian", "Gluten-Free", "Nut-Free", "Dairy-Free"],
        calories: 120,
        rating: 4.6,
        reviewsCount: 2,
        viewCount: 81,
        isAvailable: true,
        isPopular: false,
        isNew: true,
        dateAdded: "2026-06-11T15:40:00.000Z"
      },
      {
        id: "fountain-soda",
        name: "Chilled Fountain Soda",
        price: 95,
        category: "drinks",
        shortDescription: "Classic refreshing soda poured extra-cold over premium crushed ice.",
        fullDescription: "State-of-the-art highly carbonated fountain pour. Choose from Coca-Cola, Diet Coke, Dr. Pepper, or Sprite. Served in a bio-compostable diner cup over signature crystal crushed ice.",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Soda Fountain Syrup", "Carbonated Water", "Crushed Ice"],
        allergens: [],
        dietaryBadges: ["Vegetarian", "Gluten-Free", "Nut-Free", "Dairy-Free"],
        calories: 140,
        rating: 4.4,
        reviewsCount: 0,
        viewCount: 50,
        isAvailable: true,
        isPopular: false,
        isNew: false,
        dateAdded: "2026-06-05T08:30:00.000Z"
      },
      {
        id: "fudge-lava",
        name: "Fudge-Lava brownie",
        price: 295,
        category: "desserts",
        shortDescription: "Warm decadent flourless brownie topped with Madagascar vanilla ice cream and hot fudge.",
        fullDescription: "A show-stopping dessert of hot and cold contrasts. A rich, heavy, flourless dark chocolate fudge brownie warmed until the center is lava-soft. Crowned of a premium scoop of slow-churned Madagascar vanilla bean gelato, and finished with a molten hand-drizzle of hot dark chocolate fudge syrup.",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Flourless Brownie", "Vanilla Ice Cream", "Hot Fudge Syrup"],
        allergens: ["Dairy", "Egg", "Soy"],
        dietaryBadges: ["Vegetarian", "Gluten-Free", "Nut-Free"],
        calories: 640,
        rating: 4.9,
        reviewsCount: 2,
        viewCount: 162,
        isAvailable: true,
        isPopular: true,
        isNew: false,
        dateAdded: "2026-06-02T16:00:00.000Z"
      },
      {
        id: "caramel-apple-pie",
        name: "Caramel Apple Pie Bar",
        price: 265,
        category: "desserts",
        shortDescription: "Flaky butter pastry baked with spiced Granny Smith apples and warm sea-salt caramel.",
        fullDescription: "Traditional warm comfort with a modern twist. An individual flaky golden butter crust bar packed with caramelized Granny Smith apple slices spiced with Saigon cinnamon and nutmeg. Finished with a dynamic drizzling of house-made buttery sea-salt caramel sauce.",
        image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80",
        ingredients: ["Butter Pastry", "Granny Smith Apples", "Saigon Cinnamon", "Caramel Sauce"],
        allergens: ["Wheat (Gluten)", "Dairy"],
        dietaryBadges: ["Vegetarian", "Nut-Free"],
        calories: 480,
        rating: 4.5,
        reviewsCount: 1,
        viewCount: 39,
        isAvailable: true,
        isPopular: false,
        isNew: false,
        dateAdded: "2026-06-09T14:50:00.000Z"
      }
    ],
    itemImages: [
      {
        id: "img-classic-1",
        itemId: "classic-wow",
        imagePath: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-bacon-1",
        itemId: "bacon-bbq-inferno",
        imagePath: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-truffle-1",
        itemId: "truffle-forest",
        imagePath: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-garden-1",
        itemId: "avocado-garden",
        imagePath: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-fries-1",
        itemId: "wow-fries",
        imagePath: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-rings-1",
        itemId: "onion-rings",
        imagePath: "https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-wedges-1",
        itemId: "loaded-wedges",
        imagePath: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-straw-1",
        itemId: "retro-strawberry",
        imagePath: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-choc-1",
        itemId: "chocolate-chunk-shake",
        imagePath: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-lem-1",
        itemId: "craft-lemonade",
        imagePath: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-soda-1",
        itemId: "fountain-soda",
        imagePath: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-fudge-1",
        itemId: "fudge-lava",
        imagePath: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      },
      {
        id: "img-pie-1",
        itemId: "caramel-apple-pie",
        imagePath: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80",
        isPrimary: true
      }
    ],
    offers: [
      {
        id: 1,
        title: "Gourmet Weekday Special",
        subtitle: "Valid on all craft double burger orders.",
        promoCode: "WOWWEEKDAY15",
        discountPercent: 15,
        validity: "Mon to Fri, 2 PM - 6 PM",
        isActive: true
      },
      {
        id: 2,
        title: "Late Night Craving Saver",
        subtitle: "Save big on golden sides and refreshing drinks.",
        promoCode: "LATEWOW25",
        discountPercent: 25,
        validity: "Daily after 10 PM",
        isActive: true
      }
    ],
    banners: [
      {
        id: 1,
        title: "Double the Wow, Double the Crunch!",
        kicker: "LIMITED TIME SEASONAL LAUNCH",
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
        ctaText: "Order Bacon BBQ Now",
        isLive: true
      },
      {
        id: 2,
        title: "Decadent Sweet Endings For Summer",
        kicker: "WOW DESSERT GALLERY",
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=80",
        ctaText: "Indulge in Lava Fudge",
        isLive: true
      }
    ],
    ingredients: [
      {
        id: 1,
        name: "Prime Aged Angus Beef Patties",
        quantity: 120,
        minStock: 40,
        unit: "pcs",
        supplier: "Ethio Premium Meats Co.",
        status: "Good"
      },
      {
        id: 2,
        name: "Artisanal Brioche Buns",
        quantity: 140,
        minStock: 35,
        unit: "pcs",
        supplier: "Addis Sweet & Bakes",
        status: "Good"
      },
      {
        id: 3,
        name: "Colby Jack Cheese Wedges",
        quantity: 18,
        minStock: 25,
        unit: "kg",
        supplier: "Chamber Dairy Products",
        status: "Low Stock"
      },
      {
        id: 4,
        name: "Organic Vine-Ripened Tomatoes",
        quantity: 45,
        minStock: 15,
        unit: "kg",
        supplier: "Zemen Organic Farms",
        status: "Good"
      },
      {
        id: 5,
        name: "Signature Secret WOW-Sauce",
        quantity: 8,
        minStock: 10,
        unit: "liters",
        supplier: "Wow Craft Kitchens",
        status: "Low Stock"
      }
    ],
    activityLogs: [
      {
        id: "log-1",
        username: "superadmin",
        timestamp: "2026-06-26T21:45:00.000Z",
        ip: "127.0.0.1",
        action: "User Login",
        status: "Success"
      }
    ],
    reviews: [
      {
        id: "rev-1",
        itemId: "classic-wow",
        customerName: "Sileshi Kebede",
        rating: 5,
        comment: "This is hands-down the best burger in Addis! The Colby Jack cheese melts perfectly, and that signature WOW sauce is purely magical. Double patty is incredibly juicy.",
        date: "2026-06-14"
      },
      {
        id: "rev-2",
        itemId: "classic-wow",
        customerName: "Helena Yoseph",
        rating: 5,
        comment: "Excellent high-welfare beef quality and the lettuce is super crunchy. Loved fast mobile browsing via the table QR code. Recommended!",
        date: "2026-06-15"
      },
      {
        id: "rev-3",
        itemId: "bacon-bbq-inferno",
        customerName: "Mulugeta Alula",
        rating: 4,
        comment: "Super rich smoky-spicy flavor! The onion rings inside give a perfect crunch. A little messy to eat, but absolutely worth it.",
        date: "2026-06-12"
      },
      {
        id: "rev-4",
        itemId: "wow-fries",
        customerName: "Betelhem Tariku",
        rating: 5,
        comment: "Crispy on the outside, fluffy inside, and seasoned to perfection with smoked paprika and sea salt. Best fries in town!",
        date: "2026-06-16"
      }
    ],
    orders: []
  };
}

export class Database {
  private static data: DBStructure | null = null;

  private static load() {
    if (this.data) return;
    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        this.data = JSON.parse(raw);
      } catch (e) {
        console.error("Error reading database file, resetting to initial", e);
        this.data = getInitialDB();
        this.save();
      }
    } else {
      this.data = getInitialDB();
      this.save();
    }
  }

  private static save() {
    if (!this.data) return;
    fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), "utf-8");
  }

  // --- Users API ---
  static getUsers(): UserDB[] {
    this.load();
    return this.data!.users;
  }

  static getUserById(id: string): UserDB | undefined {
    this.load();
    return this.data!.users.find((u) => u.id === id);
  }

  static getUserByUsername(username: string): UserDB | undefined {
    this.load();
    return this.data!.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  static createUser(user: Omit<UserDB, "id" | "passwordHash"> & { passwordPlain: string }): UserDB {
    this.load();
    const id = `usr-${Date.now()}`;
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(user.passwordPlain, salt);
    
    const newUser: UserDB = {
      id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      passwordHash,
      role: user.role,
      status: user.status,
      avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    };
    this.data!.users.push(newUser);
    this.save();
    return newUser;
  }

  static updateUser(id: string, updates: Partial<Omit<UserDB, "id" | "passwordHash">> & { passwordPlain?: string }): UserDB | null {
    this.load();
    const idx = this.data!.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    const user = this.data!.users[idx];
    const passwordHash = updates.passwordPlain 
      ? bcrypt.hashSync(updates.passwordPlain, bcrypt.genSaltSync(10))
      : user.passwordHash;

    const updatedUser: UserDB = {
      ...user,
      ...updates,
      passwordHash
    };
    
    this.data!.users[idx] = updatedUser;
    this.save();
    return updatedUser;
  }

  static deleteUser(id: string): boolean {
    this.load();
    const lengthBefore = this.data!.users.length;
    this.data!.users = this.data!.users.filter((u) => u.id !== id);
    const success = this.data!.users.length < lengthBefore;
    if (success) {
      this.save();
    }
    return success;
  }

  // --- Menu Items API ---
  static getMenuItems(): MenuItemDB[] {
    this.load();
    return this.data!.menuItems;
  }

  static getMenuItemById(id: string): MenuItemDB | undefined {
    this.load();
    return this.data!.menuItems.find((m) => m.id === id);
  }

  static createMenuItem(item: Omit<MenuItemDB, "id" | "viewCount" | "dateAdded" | "reviewsCount" | "rating">): MenuItemDB {
    this.load();
    const id = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const newItem: MenuItemDB = {
      ...item,
      id,
      rating: 5.0,
      reviewsCount: 0,
      viewCount: 0,
      dateAdded: new Date().toISOString()
    };
    this.data!.menuItems.push(newItem);
    
    // Seed an initial image in itemImages
    this.data!.itemImages.push({
      id: `img-${Date.now()}`,
      itemId: id,
      imagePath: item.image,
      isPrimary: true
    });

    this.save();
    return newItem;
  }

  static updateMenuItem(id: string, updates: Partial<MenuItemDB>): MenuItemDB | null {
    this.load();
    const idx = this.data!.menuItems.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    const item = this.data!.menuItems[idx];
    const updated = {
      ...item,
      ...updates
    };
    this.data!.menuItems[idx] = updated;
    this.save();
    return updated;
  }

  static deleteMenuItem(id: string): boolean {
    this.load();
    const lengthBefore = this.data!.menuItems.length;
    this.data!.menuItems = this.data!.menuItems.filter((m) => m.id !== id);
    const success = this.data!.menuItems.length < lengthBefore;
    if (success) {
      // Cascading delete for item images and reviews
      this.data!.itemImages = this.data!.itemImages.filter((img) => img.itemId !== id);
      this.data!.reviews = this.data!.reviews.filter((rev) => rev.itemId !== id);
      this.save();
    }
    return success;
  }

  static incrementViewCount(id: string): void {
    this.load();
    const idx = this.data!.menuItems.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.data!.menuItems[idx].viewCount += 1;
      this.save();
    }
  }

  // --- Item Images API ---
  static getItemImages(itemId: string): ItemImageDB[] {
    this.load();
    return this.data!.itemImages.filter((img) => img.itemId === itemId);
  }

  static addImageToItem(itemId: string, imagePath: string, isPrimary = false): ItemImageDB {
    this.load();
    const id = `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    if (isPrimary) {
      // Set others to not primary
      this.data!.itemImages.forEach((img) => {
        if (img.itemId === itemId) {
          img.isPrimary = false;
        }
      });
      // Update primary image on MenuItem itself
      const itemIdx = this.data!.menuItems.findIndex(m => m.id === itemId);
      if (itemIdx !== -1) {
        this.data!.menuItems[itemIdx].image = imagePath;
      }
    }

    const newImg: ItemImageDB = { id, itemId, imagePath, isPrimary };
    this.data!.itemImages.push(newImg);
    this.save();
    return newImg;
  }

  static setPrimaryImage(itemId: string, imageId: string): boolean {
    this.load();
    const target = this.data!.itemImages.find((img) => img.id === imageId && img.itemId === itemId);
    if (!target) return false;

    this.data!.itemImages.forEach((img) => {
      if (img.itemId === itemId) {
        img.isPrimary = img.id === imageId;
      }
    });

    const itemIdx = this.data!.menuItems.findIndex(m => m.id === itemId);
    if (itemIdx !== -1) {
      this.data!.menuItems[itemIdx].image = target.imagePath;
    }

    this.save();
    return true;
  }

  static deleteItemImage(itemId: string, imageId: string): boolean {
    this.load();
    const idx = this.data!.itemImages.findIndex((img) => img.id === imageId && img.itemId === itemId);
    if (idx === -1) return false;

    const imgToDelete = this.data!.itemImages[idx];
    this.data!.itemImages.splice(idx, 1);

    // If we deleted the primary image, pick another one as primary
    if (imgToDelete.isPrimary) {
      const remaining = this.data!.itemImages.filter((img) => img.itemId === itemId);
      if (remaining.length > 0) {
        remaining[0].isPrimary = true;
        const itemIdx = this.data!.menuItems.findIndex(m => m.id === itemId);
        if (itemIdx !== -1) {
          this.data!.menuItems[itemIdx].image = remaining[0].imagePath;
        }
      }
    }

    this.save();
    return true;
  }

  // --- Offers API ---
  static getOffers(): OfferDB[] {
    this.load();
    return this.data!.offers;
  }

  static createOffer(offer: Omit<OfferDB, "id">): OfferDB {
    this.load();
    const id = this.data!.offers.length > 0 ? Math.max(...this.data!.offers.map((o) => o.id)) + 1 : 1;
    const newOffer = { ...offer, id };
    this.data!.offers.push(newOffer);
    this.save();
    return newOffer;
  }

  static updateOffer(id: number, updates: Partial<OfferDB>): OfferDB | null {
    this.load();
    const idx = this.data!.offers.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    this.data!.offers[idx] = { ...this.data!.offers[idx], ...updates };
    this.save();
    return this.data!.offers[idx];
  }

  static deleteOffer(id: number): boolean {
    this.load();
    const len = this.data!.offers.length;
    this.data!.offers = this.data!.offers.filter((o) => o.id !== id);
    if (this.data!.offers.length < len) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Banners API ---
  static getBanners(): BannerDB[] {
    this.load();
    return this.data!.banners;
  }

  static createBanner(banner: Omit<BannerDB, "id">): BannerDB {
    this.load();
    const id = this.data!.banners.length > 0 ? Math.max(...this.data!.banners.map((b) => b.id)) + 1 : 1;
    const newBanner = { ...banner, id };
    this.data!.banners.push(newBanner);
    this.save();
    return newBanner;
  }

  static updateBanner(id: number, updates: Partial<BannerDB>): BannerDB | null {
    this.load();
    const idx = this.data!.banners.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.data!.banners[idx] = { ...this.data!.banners[idx], ...updates };
    this.save();
    return this.data!.banners[idx];
  }

  static deleteBanner(id: number): boolean {
    this.load();
    const len = this.data!.banners.length;
    this.data!.banners = this.data!.banners.filter((b) => b.id !== id);
    if (this.data!.banners.length < len) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Ingredients API ---
  static getIngredients(): IngredientStockDB[] {
    this.load();
    return this.data!.ingredients;
  }

  static createIngredient(ing: Omit<IngredientStockDB, "id" | "status">): IngredientStockDB {
    this.load();
    const id = this.data!.ingredients.length > 0 ? Math.max(...this.data!.ingredients.map((i) => i.id)) + 1 : 1;
    const status: "Good" | "Low Stock" | "Out of Stock" = ing.quantity <= 0 ? "Out of Stock" : ing.quantity <= ing.minStock ? "Low Stock" : "Good";
    const newIng: IngredientStockDB = { ...ing, id, status };
    this.data!.ingredients.push(newIng);
    this.save();
    return newIng;
  }

  static updateIngredient(id: number, quantity: number): IngredientStockDB | null {
    this.load();
    const idx = this.data!.ingredients.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const ing = this.data!.ingredients[idx];
    const newQty = ing.quantity + quantity;
    const status: "Good" | "Low Stock" | "Out of Stock" = newQty <= 0 ? "Out of Stock" : newQty <= ing.minStock ? "Low Stock" : "Good";
    this.data!.ingredients[idx] = { ...ing, quantity: newQty, status };
    this.save();
    return this.data!.ingredients[idx];
  }

  static deleteIngredient(id: number): boolean {
    this.load();
    const len = this.data!.ingredients.length;
    this.data!.ingredients = this.data!.ingredients.filter((i) => i.id !== id);
    if (this.data!.ingredients.length < len) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Activity Logs API ---
  static getActivityLogs(): ActivityLogDB[] {
    this.load();
    return this.data!.activityLogs;
  }

  static addActivityLog(username: string, ip: string, action: string, status: string): ActivityLogDB {
    this.load();
    const id = `log-${Date.now()}`;
    const newLog: ActivityLogDB = {
      id,
      username,
      timestamp: new Date().toISOString(),
      ip,
      action,
      status
    };
    this.data!.activityLogs.push(newLog);
    // Keep a maximum of 50 logs in memory/disk to save space
    if (this.data!.activityLogs.length > 50) {
      this.data!.activityLogs.shift();
    }
    this.save();
    return newLog;
  }

  // --- Reviews API ---
  static getReviews(itemId: string): ReviewDB[] {
    this.load();
    return this.data!.reviews.filter((r) => r.itemId === itemId);
  }

  static createReview(itemId: string, reviewer: string, rating: number, comment: string): ReviewDB {
    this.load();
    const id = `rev-${Date.now()}`;
    const newReview = {
      id,
      itemId,
      customerName: reviewer,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0]
    };
    this.data!.reviews.push(newReview);

    // Update rating and reviewCount in menuItems
    const idx = this.data!.menuItems.findIndex((m) => m.id === itemId);
    if (idx !== -1) {
      const item = this.data!.menuItems[idx];
      const itemReviews = this.data!.reviews.filter((r) => r.itemId === itemId);
      const totalRating = itemReviews.reduce((sum, r) => sum + r.rating, 0);
      item.reviewsCount = itemReviews.length;
      item.rating = parseFloat((totalRating / itemReviews.length).toFixed(1));
    }

    this.save();
    return newReview;
  }

  // --- Orders API ---
  static getOrders(): OrderDB[] {
    this.load();
    if (!this.data!.orders) {
      this.data!.orders = [];
    }
    return this.data!.orders;
  }

  static createOrder(order: Omit<OrderDB, "id" | "createdAt" | "status" | "items"> & { items: Omit<OrderItemDB, "id" | "orderId">[] }): OrderDB {
    this.load();
    if (!this.data!.orders) {
      this.data!.orders = [];
    }
    const orderId = `ord-${Date.now()}`;
    const formattedItems: OrderItemDB[] = order.items.map((item, idx) => {
      const menuItem = this.data!.menuItems.find(m => m.id === item.menuItemId);
      return {
        id: `orditm-${orderId}-${idx}`,
        orderId,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price,
        itemName: menuItem ? menuItem.name : "Unknown Item"
      };
    });

    const newOrder: OrderDB = {
      id: orderId,
      customerName: order.customerName,
      phone: order.phone,
      tableNumber: order.tableNumber || "Takeaway",
      totalPrice: order.totalPrice,
      status: "Pending",
      notes: order.notes || "",
      createdAt: new Date().toISOString(),
      items: formattedItems
    };

    this.data!.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  static updateOrderStatus(id: string, status: OrderDB["status"]): OrderDB | null {
    this.load();
    if (!this.data!.orders) {
      this.data!.orders = [];
    }
    const idx = this.data!.orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    this.data!.orders[idx].status = status;
    this.save();
    return this.data!.orders[idx];
  }
}
