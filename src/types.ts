export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  role: "Super Admin" | "Manager" | "Employee";
  status: "Active" | "Inactive";
  avatar: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: "burgers" | "sides" | "drinks" | "desserts";
  shortDescription: string;
  fullDescription: string;
  image: string;
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

export interface ItemImage {
  id: string;
  itemId: string;
  imagePath: string;
  isPrimary: boolean;
}

export interface Category {
  id: "burgers" | "sides" | "drinks" | "desserts";
  title: string;
  icon: string;
  description: string;
}

export interface Review {
  id: string;
  itemId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Offer {
  id: number;
  title: string;
  subtitle: string;
  promoCode: string;
  discountPercent: number;
  validity: string;
  isActive: boolean;
}

export interface Banner {
  id: number;
  title: string;
  kicker: string;
  imageUrl: string;
  ctaText: string;
  isLive: boolean;
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  minStock: number;
  unit: string;
  supplier: string;
  status: "Good" | "Low Stock" | "Out of Stock";
}

export interface ActivityLog {
  id: string;
  username: string;
  timestamp: string;
  ip: string;
  action: string;
  status: string;
}

export interface AnalyticsData {
  summary: {
    totalMenuItems: number;
    categoriesCount: number;
    totalEmployees: number;
    activeOffersCount: number;
    totalViews: number;
  };
  charts: {
    dailyViews: { name: string; views: number }[];
    monthlyViews: { name: string; views: number }[];
    categoryDistribution: { name: string; value: number }[];
    mostPopularItems: { name: string; views: number }[];
  };
  lists: {
    mostViewed: Partial<MenuItem>[];
    leastViewed: Partial<MenuItem>[];
    topPopular: Partial<MenuItem>[];
    recentActivity: ActivityLog[];
  };
}
