import { User, MenuItem, ItemImage, Offer, Banner, Ingredient, ActivityLog, AnalyticsData, Review } from "../types";

const BASE_URL = "";

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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Auto set content-type to application/json unless it's a FormData upload
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.error || `HTTP error! status: ${response.status}`;
    throw new Error(errMsg);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // --- Auth ---
  login: async (username: string, password: string) => {
    const res = await request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setAuthToken(res.token);
    setLoggedInUser(res.user);
    return res;
  },

  logout: () => {
    setAuthToken(null);
    setLoggedInUser(null);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return request<{ success: boolean; message: string }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // --- Menu Items (with Server-side Pagination, Filters, Sorting) ---
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
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query.append(key, String(val));
      }
    });
    return request<{
      data: MenuItem[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>(`/api/menu?${query.toString()}`);
  },

  getMenuItem: async (id: string) => {
    return request<MenuItem & { images: ItemImage[] }>(`/api/menu/${id}`);
  },

  createMenuItem: async (itemData: Partial<MenuItem>) => {
    return request<MenuItem>("/api/menu", {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  },

  updateMenuItem: async (id: string, updates: Partial<MenuItem>) => {
    return request<MenuItem>(`/api/menu/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  deleteMenuItem: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/menu/${id}`, {
      method: "DELETE",
    });
  },

  // --- Multi-images Support & Upload ---
  getItemImages: async (itemId: string) => {
    return request<ItemImage[]>(`/api/menu/${itemId}/images`);
  },

  uploadItemImage: async (itemId: string, file: File, isPrimary: boolean) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("isPrimary", String(isPrimary));
    return request<ItemImage>(`/api/menu/${itemId}/images`, {
      method: "POST",
      body: formData,
    });
  },

  setPrimaryImage: async (itemId: string, imageId: string) => {
    return request<{ success: boolean; message: string }>(`/api/menu/${itemId}/images/${imageId}/primary`, {
      method: "PUT",
    });
  },

  deleteItemImage: async (itemId: string, imageId: string) => {
    return request<{ success: boolean; message: string }>(`/api/menu/${itemId}/images/${imageId}`, {
      method: "DELETE",
    });
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return request<{ imagePath: string }>("/api/upload", {
      method: "POST",
      body: formData,
    });
  },

  // --- Employees Management ---
  getEmployees: async (search?: string) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    return request<User[]>(`/api/employees${q}`);
  },

  createEmployee: async (empData: Partial<User> & { passwordPlain: string }) => {
    return request<User>("/api/employees", {
      method: "POST",
      body: JSON.stringify(empData),
    });
  },

  updateEmployee: async (id: string, updates: Partial<User> & { password?: string }) => {
    return request<User>(`/api/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  deleteEmployee: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/employees/${id}`, {
      method: "DELETE",
    });
  },

  // --- Offers ---
  getOffers: async () => {
    return request<Offer[]>("/api/offers");
  },

  createOffer: async (offer: Partial<Offer>) => {
    return request<Offer>("/api/offers", {
      method: "POST",
      body: JSON.stringify(offer),
    });
  },

  updateOffer: async (id: number, updates: Partial<Offer>) => {
    return request<Offer>(`/api/offers/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  deleteOffer: async (id: number) => {
    return request<{ success: boolean }>((`/api/offers/${id}`), {
      method: "DELETE",
    });
  },

  // --- Banners ---
  getBanners: async () => {
    return request<Banner[]>("/api/banners");
  },

  createBanner: async (banner: Partial<Banner>) => {
    return request<Banner>("/api/banners", {
      method: "POST",
      body: JSON.stringify(banner),
    });
  },

  updateBanner: async (id: number, updates: Partial<Banner>) => {
    return request<Banner>(`/api/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  deleteBanner: async (id: number) => {
    return request<{ success: boolean }>((`/api/banners/${id}`), {
      method: "DELETE",
    });
  },

  // --- Ingredients Inventory ---
  getIngredients: async () => {
    return request<Ingredient[]>("/api/ingredients");
  },

  createIngredient: async (ing: Partial<Ingredient>) => {
    return request<Ingredient>("/api/ingredients", {
      method: "POST",
      body: JSON.stringify(ing),
    });
  },

  restockIngredient: async (id: number, quantity: number) => {
    return request<Ingredient>(`/api/ingredients/${id}/restock`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  deleteIngredient: async (id: number) => {
    return request<{ success: boolean }>(`/api/ingredients/${id}`, {
      method: "DELETE",
    });
  },

  // --- Logs ---
  getLogs: async () => {
    return request<ActivityLog[]>("/api/logs");
  },

  // --- Analytics ---
  getAnalytics: async () => {
    return request<AnalyticsData>("/api/analytics");
  },

  // --- Reviews ---
  getReviews: async (itemId: string) => {
    return request<Review[]>(`/api/menu/${itemId}/reviews`);
  },

  submitReview: async (itemId: string, customerName: string, rating: number, comment: string) => {
    return request<Review>(`/api/menu/${itemId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ customerName, rating, comment }),
    });
  }
};
