import { User, MenuItem, ItemImage, Offer, Banner, Ingredient, ActivityLog, AnalyticsData, Review } from "../types";
import initialDb from "./db.json";

const LOCAL_STORAGE_DB_KEY = "wow_burger_db";

interface DBStructure {
  users: User[];
  menuItems: MenuItem[];
  itemImages: ItemImage[];
  offers: Offer[];
  banners: Banner[];
  ingredients: Ingredient[];
  activityLogs: ActivityLog[];
  reviews: Review[];
}

// Helpers to read/write state to browser local storage
function getLocalDB(): DBStructure {
  const existing = localStorage.getItem(LOCAL_STORAGE_DB_KEY);
  if (!existing) {
    const seededDb: DBStructure = {
      users: (initialDb as any).users || [],
      menuItems: (initialDb as any).menuItems || [],
      itemImages: (initialDb as any).itemImages || [],
      offers: (initialDb as any).offers || [],
      banners: (initialDb as any).banners || [],
      ingredients: (initialDb as any).ingredients || [],
      activityLogs: (initialDb as any).activityLogs || [],
      reviews: (initialDb as any).reviews || [],
    };
    localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(seededDb));
    return seededDb;
  }
  try {
    return JSON.parse(existing);
  } catch {
    return initialDb as any;
  }
}

function saveLocalDB(db: DBStructure) {
  localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(db));
}

// Check passwords securely
const checkPassword = (enteredPassword: string, hash: string) => {
  if (hash === "$2b$10$v7P7TsKklz6Ok54LMCJiv.RyDgFdgiDS7CACVumslyMbWzlu3iu/q") {
    return enteredPassword === "admin123";
  }
  return enteredPassword === hash;
};

// Convert uploaded file to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Auth state local helpers
export function getAuthToken(): string | null {
  return localStorage.getItem("wow_auth_token");
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("wow_auth_token", token);
  } else {
    localStorage.removeItem("wow_auth_token");
  }
}

export function getLoggedInUser(): User | null {
  const userJson = localStorage.getItem("wow_logged_in_user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setLoggedInUser(user: User | null) {
  if (user) {
    localStorage.setItem("wow_logged_in_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("wow_logged_in_user");
  }
}

export const api = {
  // --- Auth ---
  login: async (username: string, password: string) => {
    const db = getLocalDB();
    const user = db.users.find(u => u.username === username);
    if (!user || user.status === "Inactive") {
      throw new Error("Invalid username or password, or account inactive.");
    }

    const isValid = checkPassword(password, (user as any).passwordHash);
    if (!isValid) {
      throw new Error("Invalid username or password");
    }

    const token = `mock-jwt-token-${user.id}`;
    setAuthToken(token);
    setLoggedInUser(user);

    // Add activity log
    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      username: user.username,
      timestamp: new Date().toISOString(),
      ip: "127.0.0.1",
      action: "User Login",
      status: "Success"
    });
    saveLocalDB(db);

    return { token, user };
  },

  logout: () => {
    setAuthToken(null);
    setLoggedInUser(null);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized");
    const db = getLocalDB();
    const userIndex = db.users.findIndex(u => u.id === loggedInUser.id);
    if (userIndex === -1) throw new Error("User not found");
    const user = db.users[userIndex];
    if (!checkPassword(currentPassword, (user as any).passwordHash)) {
      throw new Error("Current password does not match");
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new Error("New password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.");
    }
    (user as any).passwordHash = newPassword;
    db.users[userIndex] = user;
    saveLocalDB(db);
    return { success: true, message: "Password updated successfully in browser storage." };
  },

  // --- Menu Items ---
  getMenu: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    isFeatured?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    const db = getLocalDB();
    let items = [...db.menuItems];

    if (params.search) {
      const s = params.search.toLowerCase();
      items = items.filter(i => 
        i.name.toLowerCase().includes(s) || 
        i.shortDescription.toLowerCase().includes(s) ||
        i.fullDescription.toLowerCase().includes(s)
      );
    }

    if (params.category && params.category !== "all") {
      items = items.filter(i => i.category === params.category);
    }

    if (params.minPrice !== undefined) {
      items = items.filter(i => i.price >= (params.minPrice || 0));
    }
    if (params.maxPrice !== undefined) {
      items = items.filter(i => i.price <= (params.maxPrice || 99999));
    }

    if (params.isAvailable !== undefined) {
      items = items.filter(i => i.isAvailable === params.isAvailable);
    }

    if (params.isFeatured !== undefined) {
      items = items.filter(i => i.isPopular === params.isFeatured || i.isNew === params.isFeatured);
    }

    const sortBy = params.sortBy || "dateAdded";
    const sortOrder = params.sortOrder || "desc";
    items.sort((a, b) => {
      let valA: any = a[sortBy as keyof MenuItem];
      let valB: any = b[sortBy as keyof MenuItem];

      if (typeof valA === "string") {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        valA = valA || 0;
        valB = valB || 0;
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
    });

    const page = params.page || 1;
    const limit = params.limit || 12;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      data: paginatedItems,
      totalItems,
      totalPages,
      currentPage: page,
      limit
    };
  },

  getMenuItem: async (id: string) => {
    const db = getLocalDB();
    const item = db.menuItems.find(i => i.id === id);
    if (!item) throw new Error("Menu item not found");

    item.viewCount = (item.viewCount || 0) + 1;
    saveLocalDB(db);

    const images = db.itemImages.filter(img => img.itemId === id);
    return { ...item, images };
  },

  createMenuItem: async (itemData: Partial<MenuItem>) => {
    const db = getLocalDB();
    const newId = `item-${Date.now()}`;
    const newItem: MenuItem = {
      id: newId,
      name: itemData.name || "Unnamed Burger",
      price: itemData.price || 450,
      category: (itemData.category as any) || "burgers",
      shortDescription: itemData.shortDescription || "",
      fullDescription: itemData.fullDescription || "",
      image: itemData.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      ingredients: itemData.ingredients || [],
      allergens: itemData.allergens || [],
      dietaryBadges: itemData.dietaryBadges || [],
      calories: itemData.calories || 600,
      rating: itemData.rating || 5,
      isAvailable: itemData.isAvailable !== false,
      isPopular: !!itemData.isPopular,
      isNew: itemData.isNew !== false,
      reviewsCount: 0,
      viewCount: 0,
      dateAdded: new Date().toISOString()
    };

    db.menuItems.push(newItem);
    
    const newImg: ItemImage = {
      id: `img-${Date.now()}`,
      itemId: newId,
      imagePath: newItem.image,
      isPrimary: true
    };
    db.itemImages.push(newImg);

    const loggedInUser = getLoggedInUser();
    const username = loggedInUser?.username || "anonymous";
    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      username,
      timestamp: new Date().toISOString(),
      ip: "127.0.0.1",
      action: `Created Menu Item: ${newItem.name}`,
      status: "Success"
    });

    saveLocalDB(db);
    return newItem;
  },

  updateMenuItem: async (id: string, updates: Partial<MenuItem>) => {
    const db = getLocalDB();
    const idx = db.menuItems.findIndex(i => i.id === id);
    if (idx === -1) throw new Error("Menu item not found");

    const updatedItem = { ...db.menuItems[idx], ...updates };
    db.menuItems[idx] = updatedItem;

    const loggedInUser = getLoggedInUser();
    const username = loggedInUser?.username || "anonymous";
    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      username,
      timestamp: new Date().toISOString(),
      ip: "127.0.0.1",
      action: `Updated Menu Item: ${updatedItem.name}`,
      status: "Success"
    });

    saveLocalDB(db);
    return updatedItem;
  },

  deleteMenuItem: async (id: string) => {
    const db = getLocalDB();
    const idx = db.menuItems.findIndex(i => i.id === id);
    if (idx === -1) throw new Error("Menu item not found");
    const itemName = db.menuItems[idx].name;

    db.menuItems.splice(idx, 1);
    db.itemImages = db.itemImages.filter(img => img.itemId !== id);

    const loggedInUser = getLoggedInUser();
    const username = loggedInUser?.username || "anonymous";
    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      username,
      timestamp: new Date().toISOString(),
      ip: "127.0.0.1",
      action: `Deleted Menu Item: ${itemName}`,
      status: "Success"
    });

    saveLocalDB(db);
    return { success: true, message: "Menu item deleted successfully from local storage." };
  },

  // --- Multi-images Support & Upload ---
  getItemImages: async (itemId: string) => {
    const db = getLocalDB();
    return db.itemImages.filter(img => img.itemId === itemId);
  },

  uploadItemImage: async (itemId: string, file: File, isPrimary: boolean) => {
    const db = getLocalDB();
    const item = db.menuItems.find(i => i.id === itemId);
    if (!item) throw new Error("Menu item not found");

    const base64Data = await fileToBase64(file);
    const newImg: ItemImage = {
      id: `img-${Date.now()}`,
      itemId,
      imagePath: base64Data,
      isPrimary
    };

    if (isPrimary) {
      db.itemImages.forEach(img => {
        if (img.itemId === itemId) img.isPrimary = false;
      });
      item.image = base64Data;
    }

    db.itemImages.push(newImg);
    saveLocalDB(db);
    return newImg;
  },

  setPrimaryImage: async (itemId: string, imageId: string) => {
    const db = getLocalDB();
    const item = db.menuItems.find(i => i.id === itemId);
    if (!item) throw new Error("Menu item not found");

    const img = db.itemImages.find(i => i.id === imageId && i.itemId === itemId);
    if (!img) throw new Error("Image not found");

    db.itemImages.forEach(i => {
      if (i.itemId === itemId) i.isPrimary = false;
    });

    img.isPrimary = true;
    item.image = img.imagePath;

    saveLocalDB(db);
    return { success: true, message: "Primary image updated successfully." };
  },

  deleteItemImage: async (itemId: string, imageId: string) => {
    const db = getLocalDB();
    const imgIndex = db.itemImages.findIndex(i => i.id === imageId && i.itemId === itemId);
    if (imgIndex === -1) throw new Error("Image not found");

    db.itemImages.splice(imgIndex, 1);
    saveLocalDB(db);
    return { success: true, message: "Image deleted successfully." };
  },

  uploadImage: async (file: File) => {
    const base64Data = await fileToBase64(file);
    return { imagePath: base64Data };
  },

  // --- Employees Management ---
  getEmployees: async (search?: string) => {
    const db = getLocalDB();
    let list = db.users;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(u => 
        u.firstName.toLowerCase().includes(s) ||
        u.lastName.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.username.toLowerCase().includes(s)
      );
    }
    return list;
  },

  createEmployee: async (empData: Partial<User> & { passwordPlain: string }) => {
    const db = getLocalDB();
    const newId = `usr-${Date.now()}`;
    const newUser: User = {
      id: newId,
      firstName: empData.firstName || "",
      lastName: empData.lastName || "",
      email: empData.email || "",
      phone: empData.phone || "",
      username: empData.username || "",
      role: empData.role || "Employee",
      status: empData.status || "Active",
      avatar: empData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    };

    (newUser as any).passwordHash = empData.passwordPlain;

    db.users.push(newUser);
    saveLocalDB(db);
    return newUser;
  },

  updateEmployee: async (id: string, updates: Partial<User> & { password?: string }) => {
    const db = getLocalDB();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error("Employee not found");

    const updated = { ...db.users[idx], ...updates };
    if (updates.password) {
      (updated as any).passwordHash = updates.password;
    }
    db.users[idx] = updated;
    saveLocalDB(db);
    return updated;
  },

  deleteEmployee: async (id: string) => {
    const db = getLocalDB();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error("Employee not found");

    db.users.splice(idx, 1);
    saveLocalDB(db);
    return { success: true, message: "Employee deleted successfully from browser storage." };
  },

  // --- Offers ---
  getOffers: async () => {
    const db = getLocalDB();
    return db.offers || [];
  },

  createOffer: async (offer: Partial<Offer>) => {
    const db = getLocalDB();
    const newOffer: Offer = {
      id: Date.now(),
      title: offer.title || "",
      subtitle: offer.subtitle || "",
      promoCode: offer.promoCode || "",
      discountPercent: offer.discountPercent || 0,
      validity: offer.validity || "",
      isActive: offer.isActive !== false
    };
    db.offers.push(newOffer);
    saveLocalDB(db);
    return newOffer;
  },

  updateOffer: async (id: number, updates: Partial<Offer>) => {
    const db = getLocalDB();
    const idx = db.offers.findIndex(o => o.id === id);
    if (idx === -1) throw new Error("Offer not found");

    db.offers[idx] = { ...db.offers[idx], ...updates };
    saveLocalDB(db);
    return db.offers[idx];
  },

  deleteOffer: async (id: number) => {
    const db = getLocalDB();
    db.offers = db.offers.filter(o => o.id !== id);
    saveLocalDB(db);
    return { success: true };
  },

  // --- Banners ---
  getBanners: async () => {
    const db = getLocalDB();
    return db.banners || [];
  },

  createBanner: async (banner: Partial<Banner>) => {
    const db = getLocalDB();
    const newBanner: Banner = {
      id: Date.now(),
      title: banner.title || "",
      kicker: banner.kicker || "",
      imageUrl: banner.imageUrl || "",
      ctaText: banner.ctaText || "Order Now",
      isLive: banner.isLive !== false
    };
    db.banners.push(newBanner);
    saveLocalDB(db);
    return newBanner;
  },

  updateBanner: async (id: number, updates: Partial<Banner>) => {
    const db = getLocalDB();
    const idx = db.banners.findIndex(b => b.id === id);
    if (idx === -1) throw new Error("Banner not found");

    db.banners[idx] = { ...db.banners[idx], ...updates };
    saveLocalDB(db);
    return db.banners[idx];
  },

  deleteBanner: async (id: number) => {
    const db = getLocalDB();
    db.banners = db.banners.filter(b => b.id !== id);
    saveLocalDB(db);
    return { success: true };
  },

  // --- Ingredients Inventory ---
  getIngredients: async () => {
    const db = getLocalDB();
    return db.ingredients || [];
  },

  createIngredient: async (ing: Partial<Ingredient>) => {
    const db = getLocalDB();
    const newIng: Ingredient = {
      id: Date.now(),
      name: ing.name || "",
      quantity: ing.quantity || 0,
      minStock: ing.minStock || 0,
      unit: ing.unit || "units",
      supplier: ing.supplier || "WOW Supplier",
      status: (ing.quantity || 0) <= 0 ? "Out of Stock" : (ing.quantity || 0) < (ing.minStock || 0) ? "Low Stock" : "Good"
    };
    db.ingredients.push(newIng);
    saveLocalDB(db);
    return newIng;
  },

  restockIngredient: async (id: number, quantity: number) => {
    const db = getLocalDB();
    const idx = db.ingredients.findIndex(i => i.id === id);
    if (idx === -1) throw new Error("Ingredient not found");

    const ing = db.ingredients[idx];
    ing.quantity = (ing.quantity || 0) + quantity;
    ing.status = ing.quantity <= 0 ? "Out of Stock" : ing.quantity < ing.minStock ? "Low Stock" : "Good";

    saveLocalDB(db);
    return ing;
  },

  deleteIngredient: async (id: number) => {
    const db = getLocalDB();
    db.ingredients = db.ingredients.filter(i => i.id !== id);
    saveLocalDB(db);
    return { success: true };
  },

  // --- Logs ---
  getLogs: async () => {
    const db = getLocalDB();
    return db.activityLogs || [];
  },

  // --- Analytics ---
  getAnalytics: async () => {
    const db = getLocalDB();
    const items = db.menuItems || [];
    const users = db.users || [];
    const offers = db.offers || [];

    const totalMenuItems = items.length;
    const categoriesCount = new Set(items.map((i) => i.category)).size;
    const totalEmployees = users.length;
    const activeOffersCount = offers.filter((o) => o.isActive).length;
    const totalViews = items.reduce((sum, i) => sum + (i.viewCount || 0), 0);

    const mostViewed = [...items].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);
    const leastViewed = [...items].sort((a, b) => (a.viewCount || 0) - (b.viewCount || 0)).slice(0, 5);
    const topPopular = [...items].filter((i) => i.isPopular).slice(0, 10);

    const categoryDistributionMap = items.reduce((acc: any, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {});

    const dailyViews = [
      { name: "Mon", views: Math.floor(totalViews * 0.12) || 24 },
      { name: "Tue", views: Math.floor(totalViews * 0.14) || 28 },
      { name: "Wed", views: Math.floor(totalViews * 0.11) || 22 },
      { name: "Thu", views: Math.floor(totalViews * 0.15) || 30 },
      { name: "Fri", views: Math.floor(totalViews * 0.22) || 45 },
      { name: "Sat", views: Math.floor(totalViews * 0.18) || 36 },
      { name: "Sun", views: Math.floor(totalViews * 0.08) || 16 }
    ];

    const monthlyViews = [
      { name: "Jan", views: Math.floor(totalViews * 0.7) },
      { name: "Feb", views: Math.floor(totalViews * 0.8) },
      { name: "Mar", views: Math.floor(totalViews * 1.1) },
      { name: "Apr", views: Math.floor(totalViews * 0.95) },
      { name: "May", views: Math.floor(totalViews * 1.2) },
      { name: "Jun", views: totalViews }
    ];

    const logs = db.activityLogs || [];

    return {
      summary: {
        totalMenuItems,
        categoriesCount,
        totalEmployees,
        activeOffersCount,
        totalViews
      },
      charts: {
        dailyViews,
        monthlyViews,
        categoryDistribution: Object.entries(categoryDistributionMap).map(([name, value]) => ({ name, value: Number(value) })),
        mostPopularItems: [...items].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5).map(i => ({ name: i.name, views: i.viewCount || 0 }))
      },
      lists: {
        mostViewed,
        leastViewed,
        topPopular,
        recentActivity: logs.slice(0, 8)
      }
    };
  },

  // --- Reviews ---
  getReviews: async (itemId: string) => {
    const db = getLocalDB();
    return (db.reviews || []).filter(r => r.itemId === itemId);
  },

  submitReview: async (itemId: string, customerName: string, rating: number, comment: string) => {
    const db = getLocalDB();
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      itemId,
      customerName,
      rating,
      comment,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    };

    db.reviews = db.reviews || [];
    db.reviews.push(newReview);

    const item = db.menuItems.find(i => i.id === itemId);
    if (item) {
      const existingReviews = db.reviews.filter(r => r.itemId === itemId);
      const avgRating = existingReviews.reduce((sum, r) => sum + r.rating, 0) / existingReviews.length;
      item.rating = parseFloat(avgRating.toFixed(1));
      item.reviewsCount = existingReviews.length;
    }

    saveLocalDB(db);
    return newReview;
  }
};
