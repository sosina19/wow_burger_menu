/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Flame,
  Sparkles,
  Check,
  ChevronRight,
  X,
  Clock,
  UtensilsCrossed,
  Heart,
  Star,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  LayoutDashboard,
  Menu as MenuIcon,
  MessageSquare,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit3,
  Unlock,
  LogOut,
  Moon,
  Sun,
  Laptop,
  CheckCircle,
  Eye,
  MenuSquare,
  Sparkle,
  Lock,
  Mail,
  EyeOff,
  User as UserIcon,
  Image as ImageIcon,
  Percent,
  Tags,
  Terminal,
  Hamburger,
  CupSoda
} from "lucide-react";
import { CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_REVIEWS, INITIAL_USERS, MenuItem, Category, Review, User } from "./data";

export default function App() {
  // --- Persistent & Local Database States ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem("wow_menu_items");
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("wow_categories");
    return saved ? JSON.parse(saved) : CATEGORIES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("wow_reviews");
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("wow_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("wow_favorites");
    return saved ? JSON.parse(saved) : ["classic-wow", "retro-strawberry"];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("wow_dark_mode");
    return saved ? JSON.parse(saved) : false;
  });

  // Sync to localStorage on any write
  useEffect(() => {
    localStorage.setItem("wow_menu_items", JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem("wow_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("wow_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("wow_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("wow_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("wow_dark_mode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // --- Aesthetic Navigation Tabs ---
  // "home" displays the full interactive digital catalog.
  // "food" filters grid specifically to Burgers & Sides.
  // "drinks" filters grid specifically to Drinks.
  // "favorites" filters specifically to selected items.
  const [activeTab, setActiveTab] = useState<"home" | "food" | "drinks" | "favorites">("home");

  // --- Dynamic Filters for Customer Site ---
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(700);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // --- Active Detailed Item Panel ---
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // --- Review Submission Form State ---
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>("");
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>("");
  const [reviewSubmitMessage, setReviewSubmitMessage] = useState<string>("");

  // --- Admin Mode States ---
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  
  const [adminsList, setAdminsList] = useState<any[]>(() => {
    const saved = localStorage.getItem("wow_admins");
    if (saved) return JSON.parse(saved);
    const initialAdmins = [
      {
        "id": 1,
        "username": "admin",
        "email": "admin@wowburger.com",
        "password": "admin123",
        "role": "Super Admin"
      }
    ];
    localStorage.setItem("wow_admins", JSON.stringify(initialAdmins));
    return initialAdmins;
  });

  const [loggedInAdmin, setLoggedInAdmin] = useState<any | null>(() => {
    const saved = localStorage.getItem("wow_logged_in_admin");
    return saved ? JSON.parse(saved) : null;
  });

  const [adminUser, setAdminUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("wow_logged_in_admin");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        id: `usr-${parsed.id}`,
        username: parsed.username,
        fullName: parsed.role,
        role: parsed.role as any,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
      };
    }
    return null;
  });

  const [loginLogs, setLoginLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem("wow_login_logs");
    if (saved) return JSON.parse(saved);
    const initialLogs = [
      { id: 1, username: "admin", timestamp: "2026-06-17 03:00:22", status: "Success", ip: "192.168.1.45" },
      { id: 2, username: "system-automated", timestamp: "2026-06-17 01:15:00", status: "Success", ip: "127.0.0.1" }
    ];
    localStorage.setItem("wow_login_logs", JSON.stringify(initialLogs));
    return initialLogs;
  });

  const [offers, setOffers] = useState<any[]>(() => {
    const saved = localStorage.getItem("wow_offers");
    if (saved) return JSON.parse(saved);
    const initialOffers = [
      { id: "off-1", title: "Buy 1 Get 1 Wow Classic", couponCode: "WOWBOGO", discount: "50% Off Second", status: "Active" },
      { id: "off-2", title: "Free Strawberry Shaker with Bacon BBQ Inferno", couponCode: "SHAKEIT", discount: "Free Shake", status: "Active" }
    ];
    localStorage.setItem("wow_offers", JSON.stringify(initialOffers));
    return initialOffers;
  });

  const [banners, setBanners] = useState<any[]>(() => {
    const saved = localStorage.getItem("wow_banners");
    if (saved) return JSON.parse(saved);
    const initialBanners = [
      { id: "ban-1", title: "Unrivaled Beef & Shakes Combo", subtitle: "Get our classic double patty with shake for only 650 ETB!", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", status: "Published" }
    ];
    localStorage.setItem("wow_banners", JSON.stringify(initialBanners));
    return initialBanners;
  });

  const [mediaImages, setMediaImages] = useState<any[]>(() => {
    const saved = localStorage.getItem("wow_media_images");
    if (saved) return JSON.parse(saved);
    const initialImages = [
      { id: "img-1", title: "Classic Gourmet Burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", resolution: "1200x800", size: "340 KB" },
      { id: "img-2", title: "Crispy Sizzling Bacon Patty", url: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80", resolution: "1200x800", size: "290 KB" },
      { id: "img-3", title: "Fresh Garden Harvest Greens", url: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=600&q=80", resolution: "1000x667", size: "185 KB" },
      { id: "img-4", title: "Golden Handcut Chips Tower", url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80", resolution: "1200x800", size: "410 KB" },
      { id: "img-5", title: "Aesthetic Strawberry Shaker", url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", resolution: "1200x800", size: "260 KB" },
      { id: "img-6", title: "Rich Chocolate Fondant Cake", url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80", resolution: "1200x800", size: "380 KB" }
    ];
    localStorage.setItem("wow_media_images", JSON.stringify(initialImages));
    return initialImages;
  });

  const [ingredients, setIngredients] = useState<any[]>(() => {
    const saved = localStorage.getItem("wow_ingredients");
    if (saved) return JSON.parse(saved);
    const initialIngredients = [
      { id: "ingr-1", name: "Premium Angus Beef Patty", quantity: 240, minAmount: 50, unit: "pcs", supplier: "Addis Livestock Direct", status: "In Stock" },
      { id: "ingr-2", name: "Spiced Cheddar Cheese Slices", quantity: 450, minAmount: 100, unit: "slices", supplier: "Dairy Farms", status: "In Stock" },
      { id: "ingr-3", name: "Artisanal Brioche Buns", quantity: 38, minAmount: 40, unit: "pcs", supplier: "Local Sourdough Bakery", status: "Low Stock" },
      { id: "ingr-4", name: "Applewood Smoked Bacon", quantity: 180, minAmount: 30, unit: "slices", supplier: "Addis Livestock Direct", status: "In Stock" },
      { id: "ingr-5", name: "Organic Ripe Strawberries", quantity: 15, minAmount: 10, unit: "kg", supplier: "Shola Organic Groceries", status: "In Stock" },
      { id: "ingr-6", name: "Belgian Sweet Dark Chocolate", quantity: 2, minAmount: 5, unit: "kg", supplier: "Fine Importers LLC", status: "Out of Stock" }
    ];
    localStorage.setItem("wow_ingredients", JSON.stringify(initialIngredients));
    return initialIngredients;
  });

  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<"Super Admin" | "Admin" | "Menu Manager" | "Viewer">("Super Admin");
  const [adminActiveSection, setAdminActiveSection] = useState<
    | "dashboard"
    | "categories"
    | "items"
    | "ingredients"
    | "images"
    | "offers"
    | "banners"
    | "reviews"
    | "settings"
    | "users"
    | "logs"
    | "logout"
  >("dashboard");
  const [adminSearch, setAdminSearch] = useState<string>("");

  // --- Login Form State Parameters ---
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState("");

  // Form states for custom sections
  const [offerFormTitle, setOfferFormTitle] = useState("");
  const [offerFormCoupon, setOfferFormCoupon] = useState("");
  const [offerFormDiscount, setOfferFormDiscount] = useState("");
  const [offerFormStatus, setOfferFormStatus] = useState("Active");

  const [bannerFormTitle, setBannerFormTitle] = useState("");
  const [bannerFormSubtitle, setBannerFormSubtitle] = useState("");
  const [bannerFormImage, setBannerFormImage] = useState("");
  const [bannerFormStatus, setBannerFormStatus] = useState("Published");

  const [imageFormTitle, setImageFormTitle] = useState("");
  const [imageFormUrl, setImageFormUrl] = useState("");

  const [ingFormName, setIngFormName] = useState("");
  const [ingFormQty, setIngFormQty] = useState<number>(100);
  const [ingFormMin, setIngFormMin] = useState<number>(30);
  const [ingFormUnit, setIngFormUnit] = useState("pcs");
  const [ingFormSupplier, setIngFormSupplier] = useState("");

  useEffect(() => {
    if (loggedInAdmin) {
      localStorage.setItem("wow_logged_in_admin", JSON.stringify(loggedInAdmin));
    } else {
      localStorage.removeItem("wow_logged_in_admin");
    }
  }, [loggedInAdmin]);

  useEffect(() => {
    localStorage.setItem("wow_admins", JSON.stringify(adminsList));
  }, [adminsList]);

  useEffect(() => {
    localStorage.setItem("wow_login_logs", JSON.stringify(loginLogs));
  }, [loginLogs]);

  useEffect(() => {
    localStorage.setItem("wow_offers", JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem("wow_banners", JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem("wow_media_images", JSON.stringify(mediaImages));
  }, [mediaImages]);

  useEffect(() => {
    localStorage.setItem("wow_ingredients", JSON.stringify(ingredients));
  }, [ingredients]);

  // --- Admin CRUD Form states ---
  // Category Form
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catFormId, setCatFormId] = useState("");
  const [catFormTitle, setCatFormTitle] = useState("");
  const [catFormIcon, setCatFormIcon] = useState("🍔");
  const [catFormDesc, setCatFormDesc] = useState("");

  // Menu Item Form
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemFormId, setItemFormId] = useState("");
  const [itemFormName, setItemFormName] = useState("");
  const [itemFormPrice, setItemFormPrice] = useState<number>(350);
  const [itemFormCategory, setItemFormCategory] = useState<"burgers" | "sides" | "drinks" | "desserts">("burgers");
  const [itemFormShortDesc, setItemFormShortDesc] = useState("");
  const [itemFormFullDesc, setItemFormFullDesc] = useState("");
  const [itemFormImage, setItemFormImage] = useState("");
  const [itemFormIngredients, setItemFormIngredients] = useState<string>("Beef Patty, Cheddar Cheese, Tomato, Pickles, WOW Sauce");
  const [itemFormCalories, setItemFormCalories] = useState<number>(650);
  const [itemFormIsAvailable, setItemFormIsAvailable] = useState<boolean>(true);
  const [itemFormIsPopular, setItemFormIsPopular] = useState<boolean>(false);
  const [itemFormIsNew, setItemFormIsNew] = useState<boolean>(false);

  // Review Form (Quick addition / simulation)
  const [reviewFormItem, setReviewFormItem] = useState<string>("");
  const [reviewFormAuthor, setReviewFormAuthor] = useState<string>("");
  const [reviewFormComment, setReviewFormComment] = useState<string>("");
  const [reviewFormRating, setReviewFormRating] = useState<number>(5);

  // User Form
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormUsername, setUserFormUsername] = useState("");
  const [userFormFullname, setUserFormFullname] = useState("");
  const [userFormRole, setUserFormRole] = useState<"Super Admin" | "Admin" | "Menu Manager" | "Viewer">("Admin");
  const [userFormAvatar, setUserFormAvatar] = useState("");

  const [toastMessage, setToastMessage] = useState<string>("");

  // Helper trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Switch Bottom Navigation Tabs & Preset Sub-Category Filters
  const handleTabChange = (tab: "home" | "food" | "drinks" | "favorites") => {
    setActiveTab(tab);
    if (tab === "food") {
      // Immediately display either "burgers" or let subcategories hold relevant sides
      setSelectedSubCategory("burgers");
    } else if (tab === "drinks") {
      setSelectedSubCategory("drinks");
    } else {
      setSelectedSubCategory("all");
    }
  };

  // --- Computed Client Filter Logic ---
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Bottom Navigation filter
      if (activeTab === "food" && item.category !== "burgers" && item.category !== "sides") {
        return false;
      }
      if (activeTab === "drinks" && item.category !== "drinks") {
        return false;
      }
      if (activeTab === "favorites" && !favorites.includes(item.id)) {
        return false;
      }

      // 2. Subcategory Pills
      if (selectedSubCategory !== "all" && item.category !== selectedSubCategory) {
        return false;
      }

      // 3. Search Query (Name, Ingredient list, or Description match)
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.shortDescription.toLowerCase().includes(query) || item.fullDescription.toLowerCase().includes(query);
        const matchesIngredients = item.ingredients.some(ing => ing.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesIngredients) {
          return false;
        }
      }

      // 4. Price Slider Range
      if (item.price > maxPrice) {
        return false;
      }

      // 5. Star Rating Filter
      if (selectedRating !== "all" && Math.round(item.rating) < selectedRating) {
        return false;
      }

      // 6. Availability Filter
      if (onlyAvailable && !item.isAvailable) {
        return false;
      }

      return true;
    });
  }, [menuItems, activeTab, selectedSubCategory, searchQuery, maxPrice, selectedRating, onlyAvailable, favorites]);

  // Compute stats for current item reviews
  const activeDetailedItem = useMemo(() => {
    return menuItems.find((item) => item.id === selectedItemId) || null;
  }, [selectedItemId, menuItems]);

  const activeReviews = useMemo(() => {
    if (!selectedItemId) return [];
    return reviews.filter(rev => rev.itemId === selectedItemId);
  }, [reviews, selectedItemId]);

  const activeAverageRating = useMemo(() => {
    if (activeReviews.length === 0) return activeDetailedItem?.rating || 4.5;
    const sum = activeReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return parseFloat((sum / activeReviews.length).toFixed(1));
  }, [activeReviews, activeDetailedItem]);

  // Toggle favorite list state
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(item => item !== id));
      showToast("Removed from favorites");
    } else {
      setFavorites(prev => [...prev, id]);
      showToast("Added to favorites ❤️");
    }
  };

  // Handle client-side review submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      setReviewSubmitMessage("Please supply your name and a heartfelt comment!");
      return;
    }

    const newRev: Review = {
      id: `custom-rev-${Date.now()}`,
      itemId: selectedItemId || "",
      customerName: newReviewAuthor,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split("T")[0]
    };

    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);

    // Recalculate menu rating average for this specific item in menuItems state
    const siblingReviews = updatedReviews.filter(r => r.itemId === selectedItemId);
    const sum = siblingReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const newAvg = parseFloat((sum / siblingReviews.length).toFixed(1));

    setMenuItems(prev => prev.map(m => {
      if (m.id === selectedItemId) {
        return {
          ...m,
          rating: newAvg,
          reviewsCount: siblingReviews.length
        };
      }
      return m;
    }));

    setNewReviewAuthor("");
    setNewReviewComment("");
    setReviewSubmitMessage("Review posted successfully! Thank you so much.");
    showToast("Review submitted! ⭐");
    setTimeout(() => setReviewSubmitMessage(""), 3500);
  };

  // --- Admin Login Verify action ---
  const handleAdminVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccessMsg("");

    if (!loginUsername.trim()) {
      setLoginError("Username is required");
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError("Password is required");
      return;
    }

    // Lookup credentials
    const foundAdmin = adminsList.find(
      (a) =>
        (a.username.toLowerCase() === loginUsername.trim().toLowerCase() ||
          a.email?.toLowerCase() === loginUsername.trim().toLowerCase()) &&
        a.password === loginPassword.trim()
    );

    if (!foundAdmin) {
      setLoginError("Invalid username or password");
      return;
    }

    setIsLoggingIn(true);
    
    // Simulate successful login sequence
    setTimeout(() => {
      setIsLoggingIn(false);
      setLoginSuccessMsg("Access Granted! Fetching workspace secure tokens...");
      
      setLoggedInAdmin(foundAdmin);
      setAdminUser({
        id: `usr-${foundAdmin.id}`,
        username: foundAdmin.username,
        fullName: foundAdmin.role,
        role: foundAdmin.role as any,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
      });

      // Append code to login logs
      const nextLogId = loginLogs.length > 0 ? Math.max(...loginLogs.map(l => l.id)) + 1 : 1;
      const newLog = {
        id: nextLogId,
        username: foundAdmin.username,
        timestamp: new Date().toLocaleString(),
        status: "Success",
        ip: "192.168.1.100"
      };
      setLoginLogs(prev => [newLog, ...prev]);

      showToast("Welcome back! Login Successful 🍔");

      // Reset fields
      setLoginUsername("");
      setLoginPassword("");
    }, 1500);
  };

  // --- Admin Login Verification ---
  const handleAdminLogin = (role: "Super Admin" | "Admin" | "Menu Manager" | "Viewer") => {
    let matched = adminsList.find((a) => a.role === role);
    if (!matched) {
      const newAdmin = {
        id: adminsList.length + 1,
        username: role.toLowerCase().replace(/\s+/g, ""),
        email: `${role.toLowerCase().replace(/\s+/g, "")}@wowburger.com`,
        password: "admin123",
        role: role
      };
      setAdminsList((prev) => [...prev, newAdmin]);
      matched = newAdmin;
    }
    setLoggedInAdmin(matched);
    setAdminUser({
      id: `usr-${matched.id}`,
      username: matched.username,
      fullName: matched.username.toUpperCase(),
      role: matched.role as any,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    });
    showToast(`Session shifted: now logged in as ${matched.username} (${matched.role})`);
  };

  // --- Admin Dashboard Statistics ---
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const totalMenuItems = menuItems.length;
    const availableItems = menuItems.filter(item => item.isAvailable).length;
    const activeOffers = offers.length;
    const totalReviews = reviews.length;

    return {
      totalCategories,
      totalMenuItems,
      availableItems,
      activeOffers,
      totalReviews
    };
  }, [menuItems, categories, reviews, offers]);

  // --- Admin Permission Check Helper ---
  // Real authorization levels to showcase enterprise-grade security logic
  const hasWritePermission = () => {
    if (!adminUser) return false;
    // Viewer role has read-only/simulated access
    if (adminUser.role === "Viewer") return false;
    return true; // Super Admin, Admin, and Menu Manager can execute writes
  };

  const checkPermissionAndAction = (action: () => void) => {
    if (hasWritePermission()) {
      action();
    } else {
      showToast("❌ Permission Denied: Viewers have read-only access.");
    }
  };

  // --- Admin CRUD logic: Categories ---
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    checkPermissionAndAction(() => {
      if (!catFormId.trim() || !catFormTitle.trim()) {
        showToast("Please fill all required fields");
        return;
      }
      if (editingCategory) {
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, title: catFormTitle, icon: catFormIcon, description: catFormDesc } : c));
        showToast("Category updated successfully!");
      } else {
        const idLower = catFormId.toLowerCase().trim().replace(/\s+/g, "-");
        if (categories.some(c => c.id === idLower)) {
          showToast("Category code ID already exists!");
          return;
        }
        setCategories(prev => [...prev, { id: idLower as any, title: catFormTitle, icon: catFormIcon, description: catFormDesc }]);
        showToast("New category created successfully!");
      }
      resetCategoryForm();
    });
  };

  const handleDeleteCategory = (catId: string) => {
    checkPermissionAndAction(() => {
      setCategories(prev => prev.filter(c => c.id !== catId));
      showToast("Category deleted permanently");
    });
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCatFormId("");
    setCatFormTitle("");
    setCatFormIcon("🍔");
    setCatFormDesc("");
  };

  // --- Admin CRUD logic: Menu Items ---
  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    checkPermissionAndAction(() => {
      if (!itemFormName.trim() || !itemFormShortDesc.trim() || !itemFormImage.trim()) {
        showToast("Please fill Name, Short Description, and Image URL");
        return;
      }

      const ingList = itemFormIngredients.split(",").map(i => i.trim()).filter(Boolean);

      if (editingItem) {
        setMenuItems(prev => prev.map(item => {
          if (item.id === editingItem.id) {
            return {
              ...item,
              name: itemFormName,
              price: Number(itemFormPrice),
              category: itemFormCategory,
              shortDescription: itemFormShortDesc,
              fullDescription: itemFormFullDesc || itemFormShortDesc,
              image: itemFormImage,
              ingredients: ingList,
              calories: Number(itemFormCalories),
              isAvailable: itemFormIsAvailable,
              isPopular: itemFormIsPopular,
              isNew: itemFormIsNew
            };
          }
          return item;
        }));
        showToast("Menu Item updated successfully!");
      } else {
        const newId = itemFormId.trim().toLowerCase().replace(/\s+/g, "-") || `item-${Date.now()}`;
        if (menuItems.some(i => i.id === newId)) {
          showToast("Item code identifier already exists!");
          return;
        }
        const createdItem: MenuItem = {
          id: newId,
          name: itemFormName,
          price: Number(itemFormPrice),
          category: itemFormCategory,
          shortDescription: itemFormShortDesc,
          fullDescription: itemFormFullDesc || itemFormShortDesc,
          image: itemFormImage,
          ingredients: ingList,
          allergens: ["Wheat (Gluten)"],
          dietaryBadges: itemFormCategory === "burgers" ? [] : ["Vegetarian"],
          calories: Number(itemFormCalories),
          rating: 5.0,
          reviewsCount: 0,
          isAvailable: itemFormIsAvailable,
          isPopular: itemFormIsPopular,
          isNew: itemFormIsNew
        };
        setMenuItems(prev => [createdItem, ...prev]);
        showToast("New menu item created!");
      }
      resetItemForm();
    });
  };

  const handleDeleteItem = (itemId: string) => {
    checkPermissionAndAction(() => {
      setMenuItems(prev => prev.filter(i => i.id !== itemId));
      showToast("Menu item removed");
    });
  };

  const startEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemFormId(item.id);
    setItemFormName(item.name);
    setItemFormPrice(item.price);
    setItemFormCategory(item.category);
    setItemFormShortDesc(item.shortDescription);
    setItemFormFullDesc(item.fullDescription);
    setItemFormImage(item.image);
    setItemFormIngredients(item.ingredients.join(", "));
    setItemFormCalories(item.calories);
    setItemFormIsAvailable(item.isAvailable);
    setItemFormIsPopular(!!item.isPopular);
    setItemFormIsNew(!!item.isNew);
  };

  const resetItemForm = () => {
    setEditingItem(null);
    setItemFormId("");
    setItemFormName("");
    setItemFormPrice(350);
    setItemFormCategory("burgers");
    setItemFormShortDesc("");
    setItemFormFullDesc("");
    setItemFormImage("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80");
    setItemFormIngredients("Beef Patty, Cheddar Cheese, Tomato, Pickles, WOW Sauce");
    setItemFormCalories(650);
    setItemFormIsAvailable(true);
    setItemFormIsPopular(false);
    setItemFormIsNew(false);
  };

  // --- Admin CRUD logic: Reviews ---
  const handleDeleteReview = (revId: string) => {
    checkPermissionAndAction(() => {
      setReviews(prev => prev.filter(r => r.id !== revId));
      showToast("Review deleted successfully");
    });
  };

  const handleSimulateReview = (e: React.FormEvent) => {
    e.preventDefault();
    checkPermissionAndAction(() => {
      if (!reviewFormItem || !reviewFormAuthor.trim() || !reviewFormComment.trim()) {
        showToast("Please fill all review generation fields");
        return;
      }
      const newRev: Review = {
        id: `rev-${Date.now()}`,
        itemId: reviewFormItem,
        customerName: reviewFormAuthor,
        rating: reviewFormRating,
        comment: reviewFormComment,
        date: new Date().toISOString().split("T")[0]
      };
      setReviews(prev => [newRev, ...prev]);
      showToast("Review simulated!");
      setReviewFormAuthor("");
      setReviewFormComment("");
    });
  };

  // --- Admin CRUD logic: Users ---
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    checkPermissionAndAction(() => {
      if (!userFormUsername.trim() || !userFormFullname.trim()) {
        showToast("Please enter both username and full name");
        return;
      }
      if (editingUser) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, username: userFormUsername, fullName: userFormFullname, role: userFormRole, avatar: userFormAvatar || u.avatar } : u));
        showToast("User account revised!");
      } else {
        const newUser: User = {
          id: `usr-${Date.now()}`,
          username: userFormUsername.toLowerCase().trim(),
          fullName: userFormFullname,
          role: userFormRole,
          avatar: userFormAvatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`
        };
        setUsers(prev => [...prev, newUser]);
        showToast("New administrator role provisioned");
      }
      resetUserForm();
    });
  };

  const handleDeleteUser = (usrId: string) => {
    checkPermissionAndAction(() => {
      if (usrId === adminUser?.id) {
        showToast("❌ Unable to delete yourself.");
        return;
      }
      setUsers(prev => prev.filter(u => u.id !== usrId));
      showToast("User authority terminated");
    });
  };

  const resetUserForm = () => {
    setEditingUser(null);
    setUserFormUsername("");
    setUserFormFullname("");
    setUserFormRole("Admin");
    setUserFormAvatar("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-neutral-900 font-sans flex flex-col antialiased selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden" id="wow-app-container">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#121212] text-white px-5 py-3 rounded-2xl shadow-xl border border-neutral-800 flex items-center gap-3 text-sm font-medium"
            id="global-toast"
          >
            <div className="w-2 h-2 rounded-full bg-[#FFC107] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PREMIUM BRAND HEADER --- */}
      <header className="bg-[#121212] text-white sticky top-0 z-40 border-b border-neutral-800 shadow-md px-4" id="wow-main-header">
        <div className="max-w-7xl mx-auto py-3.5 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setIsAdminPortalOpen(false); handleTabChange("home"); }} id="hdr-logo">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#E53935] to-[#FFC107] rounded-2xl flex items-center justify-center text-[#121212] font-black text-2xl shadow-lg shadow-amber-500/20">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-xl tracking-tight uppercase leading-none">
                  WOW <span className="text-[#FFC107]">Burger</span>
                </h1>
                <span className="bg-red-600/20 text-[#E53935] text-[9px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded-full border border-red-500/30">
                  Dine & Dash
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold leading-none mt-1">
                Aesthetic Digital Experience
              </p>
            </div>
          </div>

          {/* Desktop Filter Indicators or Action buttons */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              className="px-3.5 py-2 rounded-xl text-[#FFC107] border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition-all flex items-center gap-2 text-xs font-bold shadow-md cursor-pointer"
              id="theme-toggle-btn"
              title={isDarkMode ? "Toggle Light Mode" : "Toggle Dark Mode"}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline-block select-none">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#FFC107]" />
                  <span className="hidden sm:inline-block select-none">Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsAdminPortalOpen(!isAdminPortalOpen)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-2 border ${
                isAdminPortalOpen
                  ? "bg-[#FFC107] text-[#121212] border-[#FFC107] shadow-lg shadow-amber-500/20"
                  : "bg-neutral-900 text-[#FFC107] border-neutral-800 hover:bg-neutral-800"
              }`}
              id="btn-portal-switch"
            >
              {isAdminPortalOpen ? (
                <>
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Customer View</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </>
              )}
            </button>
            <div className="hidden md:flex items-center gap-2">
              <span className="bg-neutral-900 border border-neutral-800 text-[#FFC107] text-xs font-mono px-3 py-1.5 rounded-xl">
                📍 Table #08
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* --- PRIMARY LAYOUT WRAPPER --- */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row relative">

        {/* ==================================================================== */}
        {/*                       1. CUSTOMER WEBSITE VIEW                       */}
        {/* ==================================================================== */}
        <AnimatePresence mode="wait">
          {!isAdminPortalOpen ? (
            <motion.div
              key="customer-website-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col"
              id="customer-view-root"
            >
              
              {/* Premium Hero Promo banner on tablet & desktop */}
              <div className="bg-[#121212] text-white p-6 md:p-10 rounded-b-[2rem] md:rounded-3xl shadow-xl mx-0 md:mx-4 md:mt-4 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 border-b border-neutral-800" id="gourmet-hero">
                <div className="absolute right-[-20px] top-[-30px] w-72 h-72 bg-[#FFC107]/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute left-[-20px] bottom-[-20px] w-60 h-60 bg-[#E53935]/15 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="relative z-10 flex-1 space-y-3.5 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#FFC107]/10 text-[#FFC107] text-[11px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full border border-[#FFC107]/20">
                    <Flame className="w-3 h-3 fill-amber-500 text-[#FFC107]" /> Custom Flame Grill
                  </div>
                  <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight leading-none text-white">
                    Unrivaled <span className="text-[#FFC107]">Beef</span> & Delicious Shakes
                  </h2>
                  <p className="text-[#FAF9F6]/80 text-xs md:text-sm font-light max-w-xl leading-relaxed">
                    Voted Addis Ababa's most dynamic artisanal burger joint. Real cheddar-saturated double beef patties, custom sourdough buns baked fresh, and signature cold milkshakes. Select any item to view premium allergen filters.
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-neutral-400 pt-2 border-t border-neutral-800">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#FFC107]" /> 11:00 AM - 11:30 PM
                    </span>
                    <span className="flex items-center gap-1.5">
                      ⭐ Average 4.8 Rating
                    </span>
                  </div>
                </div>

                {/* Side banner image featured */}
                <div className="relative w-36 h-36 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-neutral-800 rotate-1 flex-shrink-0">
                  <img
                    alt="WOW Burger Signature"
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
                    className="w-full h-full object-cover scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-[#E53935] text-white font-mono text-[9px] font-black px-2 py-0.5 rounded">
                    HOT #1
                  </div>
                </div>
              </div>

              {/* SEARCH & FILTER SECTION (IMMEDIATE AT THE TOP) */}
              <section className="px-4 py-6 space-y-4 max-w-7xl w-full mx-auto" id="search-filter-section">
                
                {/* Search input + Advanced Filters Toggle button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search signature dishes, hand-cut sides, ingredients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white text-neutral-900 text-sm placeholder-neutral-400 pl-11 pr-10 py-3 rounded-2xl border border-neutral-200 outline-none focus:ring-2 focus:ring-[#FFC107]/30 focus:border-[#FFC107] transition-all font-sans"
                      id="search-input-field"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold border transition-all ${
                      showAdvancedFilters 
                        ? "bg-[#121212] text-[#FFC107] border-neutral-800" 
                        : "bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200"
                    }`}
                    id="btn-toggle-filters"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filter Options</span>
                    {(selectedRating !== "all" || maxPrice < 700 || onlyAvailable) && (
                      <span className="w-2 h-2 rounded-full bg-[#E53935]" />
                    )}
                  </button>
                </div>

                {/* Expandable Advanced Filter Panel */}
                <AnimatePresence>
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm space-y-4"
                      id="filters-drawer"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* 1. Price Budget Range in ETB */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex justify-between">
                            <span>Max Budget Target</span>
                            <span className="text-[#E53935] font-mono">{maxPrice} ETB</span>
                          </label>
                          <input
                            type="range"
                            min="90"
                            max="700"
                            step="10"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#E53935]"
                          />
                          <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                            <span>90 ETB</span>
                            <span>350 ETB</span>
                            <span>700 ETB</span>
                          </div>
                        </div>

                        {/* 2. Rating Threshold filter */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                            Rating Scale
                          </span>
                          <div className="flex gap-1.5">
                            {["all", 4, 5].map((stars) => (
                              <button
                                key={stars}
                                onClick={() => setSelectedRating(stars as any)}
                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                                  selectedRating === stars
                                    ? "bg-[#121212] text-white border-neutral-900"
                                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                                }`}
                              >
                                {stars === "all" ? (
                                  <span>All ⭐</span>
                                ) : (
                                  <>
                                    <span>{stars}+</span>
                                    <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                                  </>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 3. Availability and Quick Fixes */}
                        <div className="space-y-2 flex flex-col justify-end">
                          <label className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={onlyAvailable}
                              onChange={(e) => setOnlyAvailable(e.target.checked)}
                              className="w-4.5 h-4.5 rounded text-[#E53935] border-neutral-300 focus:ring-[#FFC107]"
                            />
                            <div className="text-xs">
                              <span className="font-bold text-neutral-800 block">Available Now Only</span>
                              <span className="text-[10px] text-neutral-400">Exclude kitchen backorders</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                        <button
                          onClick={() => {
                            setMaxPrice(700);
                            setSelectedRating("all");
                            setOnlyAvailable(false);
                            setSearchQuery("");
                          }}
                          className="px-4 py-1.5 rounded-xl text-neutral-500 hover:text-neutral-800 text-xs font-bold"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* HORIZONTAL CATEGORY SCROLL LIST (With Icons + Custom Labels) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest font-black text-neutral-400 font-mono">
                      {activeTab === "home" ? "Full Catalog" : `${activeTab} specialties`}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#E53935] bg-red-50 px-2.5 py-0.5 rounded-full">
                      {filteredMenuItems.length} Dishes Found
                    </span>
                  </div>

                  {/* Scrolling chips layout wrapper */}
                  <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1" id="category-scroller-track">
                    <button
                      onClick={() => setSelectedSubCategory("all")}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        selectedSubCategory === "all"
                          ? "bg-[#121212] text-white shadow-md scale-[1.02]"
                          : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200"
                      }`}
                      id="cat-pill-all"
                    >
                      🍽️ Show All
                    </button>
                    {categories.map((cat) => {
                      const isSelected = selectedSubCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedSubCategory(cat.id)}
                          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-[#E53935] text-white shadow-md scale-[1.02]"
                              : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200"
                          }`}
                          id={`cat-pill-${cat.id}`}
                        >
                          <span className="text-sm">{cat.icon}</span>
                          <span>{cat.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* TWO-COLUMN GRID (FORCING 2 CARDS PER ROW ON MOBILE, 3-4 ON TABLET, 4-6 ON DESKTOP) */}
              <section className="px-4 pb-28 max-w-7xl mx-auto w-full flex-1" id="menu-items-grid">
                
                {filteredMenuItems.length === 0 ? (
                  <div className="py-20 text-center text-neutral-500 space-y-4 bg-white rounded-3xl border border-neutral-200/80 p-6 max-w-md mx-auto shadow-sm">
                    <div className="w-16 h-16 bg-neutral-50/50 rounded-full flex items-center justify-center mx-auto border border-neutral-100">
                      <UtensilsCrossed className="w-8 h-8 text-neutral-300" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-display font-black text-neutral-800 text-lg">No Items Match Filter</p>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Try easing your search or max budget. Our kitchen has plenty of choice waiting!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedSubCategory("all");
                        setMaxPrice(700);
                        setSelectedRating("all");
                        setOnlyAvailable(false);
                      }}
                      className="px-5 py-2 bg-[#121212] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-neutral-800"
                    >
                      Reset Catalog filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {filteredMenuItems.map((item) => {
                      const isLiked = favorites.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-neutral-205/90 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-lg hover:border-amber-200 transition-all duration-300 group cursor-pointer relative"
                          onClick={() => setSelectedItemId(item.id)}
                          id={`card-${item.id}`}
                        >
                          {/* Top Badges & Favorite button */}
                          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                            {item.isPopular && (
                              <span className="bg-[#E53935] text-white font-mono text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded shadow-sm">
                                POPULAR
                              </span>
                            )}
                            {item.isNew && (
                              <span className="bg-indigo-600/90 text-white font-mono text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded shadow-sm">
                                NEW
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => toggleFavorite(item.id, e)}
                            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 text-neutral-400 hover:text-[#E53935] backdrop-blur-md shadow-sm transition-all"
                            title="Add to favorites"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-[#E53935] text-[#E53935]" : ""}`} />
                          </button>

                          {/* Food Card Image */}
                          <div className="w-full h-28 sm:h-36 bg-neutral-100 overflow-hidden relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            {!item.isAvailable && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                                <span className="bg-white text-neutral-900 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">
                                  Backorder
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Food Body info */}
                          <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                            
                            {/* Star indicators & review count */}
                            <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-medium">
                              <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                              <span className="text-neutral-900 font-bold">{item.rating}</span>
                              <span className="text-neutral-400 font-mono">({item.reviewsCount})</span>
                            </div>

                            {/* Clickable Card Title */}
                            <div>
                              <h3 className="font-display font-black text-neutral-900 text-xs sm:text-sm tracking-tight leading-snug group-hover:text-[#E53935] transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-[11px] text-neutral-400 font-light leading-tight line-clamp-2 mt-0.5">
                                {item.shortDescription}
                              </p>
                            </div>

                            {/* Price Line ETB */}
                            <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                              <span className="font-mono text-[#E53935] text-xs sm:text-sm font-black">
                                {item.price} ETB
                              </span>
                              <span className="text-[9px] uppercase font-mono font-bold text-neutral-400 flex items-center gap-0.5 group-hover:text-black transition-colors">
                                Details →
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* FIXED BOTTOM NAVIGATION BAR BAR FOR MOBILES */}
              <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 py-2.5 px-4 shadow-2xl z-40" id="bottom-bar-nav">
                <div className="max-w-md mx-auto flex items-center justify-around">
                  
                  {/* Home */}
                  <button
                    onClick={() => handleTabChange("home")}
                    className={`flex flex-col items-center justify-center gap-1 transition-all ${
                      activeTab === "home" ? "text-[#E53935] font-extrabold" : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    <div className={`p-1 rounded-full transition-colors ${activeTab === "home" ? "bg-red-50" : ""}`}>
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-mono">Home</span>
                  </button>

                  {/* Food */}
                  <button
                    onClick={() => handleTabChange("food")}
                    className={`flex flex-col items-center justify-center gap-1 transition-all ${
                      activeTab === "food" ? "text-[#E53935] font-extrabold" : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    <div className={`p-1 rounded-full transition-colors ${activeTab === "food" ? "bg-red-50" : ""}`}>
                      <Hamburger className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-mono">Food</span>
                  </button>

                  {/* Drinks */}
                  <button
                    onClick={() => handleTabChange("drinks")}
                    className={`flex flex-col items-center justify-center gap-1 transition-all ${
                      activeTab === "drinks" ? "text-[#E53935] font-extrabold" : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    <div className={`p-1 rounded-full transition-colors ${activeTab === "drinks" ? "bg-red-50" : ""}`}>
                      <CupSoda className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-mono">Drinks</span>
                  </button>

                  {/* Favorites */}
                  <button
                    onClick={() => handleTabChange("favorites")}
                    className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
                      activeTab === "favorites" ? "text-[#E53935] font-extrabold" : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    <div className={`p-1 rounded-full transition-colors ${activeTab === "favorites" ? "bg-red-50" : ""}`}>
                      <Heart className="w-5 h-5" />
                    </div>
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 right-2 w-4 h-4 bg-[#E53935] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                    <span className="text-[9px] uppercase tracking-wider font-mono">Liked</span>
                  </button>
                </div>
              </nav>

            </motion.div>
          ) : !loggedInAdmin ? (
            // ====================================================================
            //                        2. ADMIN LOGIN GATEKEEPER                    //
            // ====================================================================
            <motion.div
              key="admin-login-page"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 flex items-center justify-center min-h-[85vh] px-4 py-12 md:py-24 bg-neutral-50 dark:bg-stone-950 transition-colors"
              id="admin-login-root"
            >
              <div className="max-w-md w-full bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 rounded-[2.5rem] shadow-2xl p-8 md:p-10 space-y-6 relative overflow-hidden">
                {/* Visual Background Accent Glows */}
                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#FFC107]/10 dark:bg-[#FFC107]/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-[#E53935]/10 dark:bg-[#E53935]/5 rounded-full blur-[80px] pointer-events-none" />

                {/* LOGO SECTION */}
                <div className="flex flex-col items-center text-center space-y-3.5 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E53935] to-[#FFC107] flex items-center justify-center shadow-lg relative">
                    <Flame className="w-8 h-8 text-white animate-pulse" />
                    <span className="absolute -top-1.5 -right-1.5 text-xs select-none">🍔</span>
                  </div>
                  <div>
                    <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight text-neutral-900 dark:text-white">
                      Wow Burger Admin Panel
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-stone-400 mt-2 leading-relaxed">
                      Sign in to manage menu items, categories, offers, and restaurant settings.
                    </p>
                  </div>
                </div>

                {/* LOGIN FORM */}
                <form onSubmit={handleAdminVerifyLogin} className="space-y-4 relative z-10">
                  {/* Validation Error Message */}
                  {loginError && (
                    <div className="p-3 bg-red-50 dark:bg-rose-950/20 text-xs text-[#E53935] dark:text-rose-400 font-bold rounded-2xl border border-red-200/60 dark:border-rose-900/40 flex items-center gap-2 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-[#E53935]" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Success Message */}
                  {loginSuccessMsg && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-xs text-emerald-700 dark:text-emerald-400 font-bold rounded-2xl border border-emerald-250 dark:border-emerald-900/40 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>{loginSuccessMsg}</span>
                    </div>
                  )}

                  {/* Username or Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-stone-400">
                      Username or Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        placeholder="admin or admin@wowburger.com"
                        disabled={isLoggingIn}
                        className="w-full bg-neutral-50 dark:bg-stone-900/60 text-neutral-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-2xl border border-neutral-200 dark:border-stone-805 focus:outline-none focus:ring-4 focus:ring-[#FFC107]/10 focus:border-[#FFC107] transition-all font-sans"
                        id="login-username-input"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-stone-400">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={loginShowPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={isLoggingIn}
                        className="w-full bg-neutral-50 dark:bg-stone-900/60 text-neutral-900 dark:text-white text-sm pl-11 pr-10 py-3 rounded-2xl border border-neutral-200 dark:border-stone-805 focus:outline-none focus:ring-4 focus:ring-[#FFC107]/10 focus:border-[#FFC107] transition-all font-sans"
                        id="login-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setLoginShowPassword(!loginShowPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-stone-200 cursor-pointer"
                        title={loginShowPassword ? "Hide Password" : "Show Password"}
                      >
                        {loginShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Links */}
                  <div className="flex items-center justify-between pt-1 select-none">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-neutral-300 dark:border-stone-700 text-[#E53935] focus:ring-[#E53935] cursor-pointer"
                      />
                      <span className="text-xs text-neutral-500 dark:text-stone-400">Remember Me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        showToast("Password recovery email triggered inside simulated environment! 📨");
                      }}
                      className="text-xs text-[#E53935] hover:underline font-bold"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#E53935] to-[#FFC107] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 font-sans"
                    id="btn-login-submit"
                  >
                    {isLoggingIn ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Session...</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Enter Dashboard</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Back Link */}
                <div className="text-center pt-1 relative z-10 font-sans">
                  <button
                    onClick={() => setIsAdminPortalOpen(false)}
                    className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-stone-200 transition-all inline-flex items-center gap-1.5 hover:underline cursor-pointer"
                    id="btn-return-dining"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Return to Dining App</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            // ====================================================================
            //                        3. ADMIN DASHBOARD SYSTEM                     //
            // ====================================================================
            <motion.div
              key="admin-dashboard-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 flex flex-col md:flex-row bg-slate-50 relative pb-20 md:pb-0"
              id="admin-view-root"
            >
              {/* Admin Side Drawer */}
              <aside className="w-full md:w-64 bg-[#121212] text-white p-4 flex flex-col justify-between border-r border-neutral-800" id="admin-sidebar">
                <div className="space-y-6">
                  
                  {/* Account / Active Identity session status */}
                  <div className="bg-neutral-900 p-3 rounded-2xl border border-neutral-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={adminUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                        alt="admin avatar"
                        className="w-10 h-10 rounded-full border border-neutral-700"
                      />
                      <div>
                        <h4 className="text-xs font-bold font-display text-white">{adminUser?.fullName}</h4>
                        <span className="bg-[#FFC107] text-[#121212] font-mono text-[9px] font-black px-2 py-0.5 rounded uppercase">
                          {adminUser?.role}
                        </span>
                      </div>
                    </div>
                    
                    {/* Role Switcher Drawer (To let clients test Viewer vs Super Admin restriction blocks) */}
                    <div className="pt-2 border-t border-neutral-800 space-y-1">
                      <label className="text-[9px] text-neutral-400 font-mono uppercase tracking-widest block font-bold">
                        Switch demo session role:
                      </label>
                      <div className="flex gap-1.5">
                        <select
                          value={selectedRoleForLogin}
                          onChange={(e) => {
                            const newRole = e.target.value as any;
                            setSelectedRoleForLogin(newRole);
                            handleAdminLogin(newRole);
                          }}
                          className="bg-neutral-950 text-white text-[11px] font-semibold border border-neutral-800 rounded-lg p-1.5 w-full outline-none"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Admin">Admin</option>
                          <option value="Menu Manager">Menu Manager</option>
                          <option value="Viewer">Viewer (Read-only)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Tabs Links */}
                  <nav className="space-y-1 flex flex-col" id="admin-nav-links">
                    {[
                      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                      { id: "categories", label: "Categories", icon: MenuSquare },
                      { id: "items", label: "Menu Items", icon: MenuIcon },
                      { id: "ingredients", label: "Ingredients", icon: Sparkle },
                      { id: "images", label: "Images", icon: ImageIcon },
                      { id: "offers", label: "Offers", icon: Percent },
                      { id: "banners", label: "Banners", icon: Tags },
                      { id: "reviews", label: "Reviews", icon: MessageSquare },
                      { id: "settings", label: "Restaurant Settings", icon: SettingsIcon },
                      { id: "users", label: "Admin Users", icon: UsersIcon },
                      { id: "logs", label: "Login Logs", icon: Terminal },
                      { id: "logout", label: "Logout (Exit)", icon: LogOut }
                    ].map((sec) => {
                      const IconComponent = sec.icon;
                      const isActive = adminActiveSection === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => {
                            if (sec.id === "logout") {
                              setLoggedInAdmin(null);
                              setAdminUser(null);
                              setAdminActiveSection("dashboard");
                              showToast("Logged out successfully. Have a nice day! 🚪");
                            } else {
                              setAdminActiveSection(sec.id as any);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#E53935] text-white shadow-md font-extrabold"
                              : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{sec.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Back to Client Menu indicator */}
                <div className="pt-4 border-t border-neutral-800">
                  <button
                    onClick={() => setIsAdminPortalOpen(false)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-400 group hover:text-white rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Dining App
                  </button>
                </div>
              </aside>

              {/* Main Content Workspace viewport */}
              <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto" id="admin-main-viewport">
                
                {/* Header title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
                  <div>
                    <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight text-[#121212]">
                      WOW Admin <span className="text-[#E53935]">Workspace</span>
                    </h2>
                    <p className="text-xs text-neutral-400 font-light mt-0.5">
                      Live administration dashboard for real-time menu orchestration & customer sentiment analysis.
                    </p>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-3.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px] font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Feed Active
                    </span>
                  </div>
                </div>

                {/* ======================= TABS CONTENT: 1. DASHBOARD ======================= */}
                {adminActiveSection === "dashboard" && (
                  <div className="space-y-6" id="sec-dashboard">
                    
                    {/* STATS TILES BANNER */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
                      
                      {/* Total Categories */}
                      <div className="bg-white p-4 rounded-2xl border border-neutral-205/80 shadow-sm space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 font-mono">
                          Categories
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black font-display text-neutral-950">
                            {stats.totalCategories}
                          </span>
                          <span className="p-1 px-2 rounded-lg bg-orange-50 text-orange-600 text-xs font-mono font-bold">
                            Live
                          </span>
                        </div>
                      </div>

                      {/* Total Menu Items */}
                      <div className="bg-white p-4 rounded-2xl border border-neutral-205/80 shadow-sm space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 font-mono">
                          Menu Items
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black font-display text-neutral-950">
                            {stats.totalMenuItems}
                          </span>
                          <span className="p-1 px-2 rounded-lg bg-red-50 text-red-650 text-xs font-mono font-bold">
                            {menuItems.filter(i=>i.isPopular).length} Hot
                          </span>
                        </div>
                      </div>

                      {/* Available Items */}
                      <div className="bg-white p-4 rounded-2xl border border-neutral-205/80 shadow-sm space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 font-mono">
                          Active Supply
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black font-display text-emerald-600">
                            {stats.availableItems}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {menuItems.filter(i=>!i.isAvailable).length} Backorder
                          </span>
                        </div>
                      </div>

                      {/* Average Rating */}
                      <div className="bg-white p-4 rounded-2xl border border-neutral-205/80 shadow-sm space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 font-mono">
                          Avg Rating
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black font-display text-amber-500 flex items-center gap-1">
                            {stats.averageRating} <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                          </span>
                          <span className="text-[10px] text-neutral-400">Addis Joint #1</span>
                        </div>
                      </div>

                      {/* Total Reviews */}
                      <div className="bg-white p-4 rounded-2xl border border-neutral-205/80 shadow-sm space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 font-mono">
                          Reviews Total
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black font-display text-indigo-600">
                            {stats.totalReviews}
                          </span>
                          <span className="p-1 px-2 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-mono font-bold">
                            Feed
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Double Columns: Left Quick View, Right Live Simulation */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Popular menu scoreboard */}
                      <div className="bg-white p-5 rounded-3xl border border-neutral-200/95 shadow-sm space-y-4 lg:col-span-2">
                        <h4 className="font-display font-black text-neutral-900 text-base">
                          Our Hot Popular Sellers 🔥
                        </h4>
                        
                        <div className="space-y-2.5">
                          {menuItems.filter(i => i.isPopular).map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-2.5 hover:bg-neutral-50 rounded-xl border border-neutral-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-11 h-11 object-cover rounded-lg border border-neutral-200"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <span className="font-bold text-xs block text-neutral-800">{item.name}</span>
                                  <span className="text-[10px] text-neutral-400">{item.category.toUpperCase()} • {item.calories} kcal</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-mono text-[#E53935] text-xs font-black block">{item.price} ETB</span>
                                <span className="text-[9px] text-neutral-400">⭐ {item.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Simulation Actions box for easy presentation */}
                      <div className="bg-[#121212] text-white p-5 rounded-3xl border border-neutral-800 shadow-xl space-y-4 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-500">
                            <Sparkle className="w-5 h-5" />
                          </div>
                          <h4 className="font-display font-black text-white text-base">
                            Interactive Sandbox Play
                          </h4>
                          <p className="text-xs text-neutral-400 font-light leading-relaxed">
                            Try editing prices, adding a new burger category, or posting custom reviews. All changes immediately propagate to the dining app context for live testing! Toggle back and forth.
                          </p>
                        </div>

                        <div className="pt-4 border-t border-neutral-800">
                          <button
                            onClick={() => setIsAdminPortalOpen(false)}
                            className="w-full bg-[#FFC107] text-[#121212] font-black text-xs py-3.5 rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/10 flex items-center justify-center gap-1.5 uppercase"
                          >
                            <span>Open Dining App</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* ======================= TABS CONTENT: 2. CATEGORIES CRUD ======================= */}
                {adminActiveSection === "categories" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="sec-categories">
                    
                    {/* List of categories */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-black text-neutral-900 text-base">
                          Managing Categories
                        </h4>
                        <span className="text-xs font-mono text-neutral-400">Total {categories.length}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categories.map((cat) => (
                          <div key={cat.id} className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{cat.icon}</span>
                                <span className="font-bold text-sm text-neutral-800">{cat.title}</span>
                              </div>
                              <p className="text-[11px] text-neutral-400 leading-tight">
                                {cat.description}
                              </p>
                              <span className="inline-block text-[9px] font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded uppercase mt-2">
                                ID Code: {cat.id}
                              </span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingCategory(cat);
                                  setCatFormId(cat.id);
                                  setCatFormTitle(cat.title);
                                  setCatFormIcon(cat.icon);
                                  setCatFormDesc(cat.description);
                                }}
                                className="p-1.5 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-600 transition-colors"
                                title="Edit category details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#E53935] transition-colors"
                                title="Delete category permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Form to Create/Edit */}
                    <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                      <h4 className="font-display font-black text-neutral-900 text-base">
                        {editingCategory ? "✏️ Edit Category" : "✨ Create Category"}
                      </h4>
                      <p className="text-xs text-neutral-400 leading-normal">
                        Add a new custom food section with custom emoji representative icon. This category immediately joins the scroll header!
                      </p>

                      <form onSubmit={handleSaveCategory} className="space-y-3.5 pt-2">
                        
                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Unique ID Code (No spaces)
                          </label>
                          <input
                            type="text"
                            value={catFormId}
                            onChange={(e) => setCatFormId(e.target.value)}
                            disabled={!!editingCategory}
                            placeholder="e.g. tacos, wraps"
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2 w-full text-xs text-neutral-800 disabled:opacity-60 outline-none focus:ring-2 focus:ring-[#FFC107]/30"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Title Name
                          </label>
                          <input
                            type="text"
                            value={catFormTitle}
                            onChange={(e) => setCatFormTitle(e.target.value)}
                            placeholder="e.g. Gourmet Wraps"
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2 w-full text-xs text-neutral-800 outline-none focus:ring-2 focus:ring-[#FFC107]/30"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Emoji Icon
                          </label>
                          <input
                            type="text"
                            value={catFormIcon}
                            onChange={(e) => setCatFormIcon(e.target.value)}
                            placeholder="e.g. 🌯"
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2 w-full text-xs text-neutral-800 outline-none focus:ring-2 focus:ring-[#FFC107]/30"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Explanation Description
                          </label>
                          <textarea
                            value={catFormDesc}
                            onChange={(e) => setCatFormDesc(e.target.value)}
                            placeholder="Briefly state flavor themes of category..."
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2 w-full text-xs text-neutral-800 h-16 outline-none focus:ring-2 focus:ring-[#FFC107]/30"
                            required
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="flex-1 bg-[#121212] text-white font-bold text-xs py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                          >
                            Save Category
                          </button>
                          {editingCategory && (
                            <button
                              type="button"
                              onClick={resetCategoryForm}
                              className="px-3 py-2 border border-neutral-205/85 rounded-xl text-neutral-500 hover:text-neutral-800 text-xs font-bold"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                  </div>
                )}

                {/* ======================= TABS CONTENT: 3. MENU ITEMS CRUD ======================= */}
                {adminActiveSection === "items" && (
                  <div className="space-y-6" id="sec-menu-items">
                    
                    {/* Add Item or Edit toggle banner */}
                    <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                      
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-black text-neutral-900 text-base">
                          {editingItem ? `✏️ Revise: ${editingItem.name}` : "✨ Add New Dish / Menu Item"}
                        </h4>
                        {editingItem && (
                          <button
                            onClick={resetItemForm}
                            className="text-xs font-semibold text-[#E53935] hover:underline"
                          >
                            Clear Form & Add New
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleSaveMenuItem} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        
                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Code ID (lowercase, e.g. classic-wow)
                          </label>
                          <input
                            type="text"
                            value={itemFormId}
                            onChange={(e) => setItemFormId(e.target.value)}
                            disabled={!!editingItem}
                            placeholder="e.g. smash-avocado"
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2.5 w-full text-xs text-neutral-800 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Dish Name
                          </label>
                          <input
                            type="text"
                            value={itemFormName}
                            onChange={(e) => setItemFormName(e.target.value)}
                            placeholder="Gourmet Chili slider"
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2.5 w-full text-xs text-neutral-800 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Price (ETB Birr)
                          </label>
                          <input
                            type="number"
                            value={itemFormPrice}
                            onChange={(e) => setItemFormPrice(Number(e.target.value))}
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2.5 w-full text-xs text-neutral-800 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Primary Category
                          </label>
                          <select
                            value={itemFormCategory}
                            onChange={(e) => setItemFormCategory(e.target.value as any)}
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2.5 w-full text-xs text-neutral-800 outline-none"
                          >
                            <option value="burgers">Burgers</option>
                            <option value="sides">Sides</option>
                            <option value="drinks">Drinks</option>
                            <option value="desserts">Desserts</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Energy Content (kcal)
                          </label>
                          <input
                            type="number"
                            value={itemFormCalories}
                            onChange={(e) => setItemFormCalories(Number(e.target.value))}
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2.5 w-full text-xs text-neutral-800 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Photo Asset URL
                          </label>
                          <input
                            type="text"
                            value={itemFormImage}
                            onChange={(e) => setItemFormImage(e.target.value)}
                            placeholder="Enter image URL"
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2.5 w-full text-xs text-neutral-800 outline-none"
                            required
                          />
                          <p className="text-[9px] text-neutral-450 mt-1 block">
                            Use local file or paste Unsplash food image URL.
                          </p>
                        </div>

                        <div className="md:col-span-3">
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Ingredients (Comma-separated list)
                          </label>
                          <input
                            type="text"
                            value={itemFormIngredients}
                            onChange={(e) => setItemFormIngredients(e.target.value)}
                            placeholder="Cheddar Cheese, Beef Patty, Grilled Onion, BBQ Glaze"
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2.5 w-full text-xs text-neutral-800 outline-none"
                            required
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Short Menu Card Description
                          </label>
                          <textarea
                            value={itemFormShortDesc}
                            onChange={(e) => setItemFormShortDesc(e.target.value)}
                            placeholder="Appealing short prompt for the interactive cards..."
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2.5 w-full h-14 text-xs text-neutral-800 outline-none"
                            required
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Detailed Epicurean Full Description
                          </label>
                          <textarea
                            value={itemFormFullDesc}
                            onChange={(e) => setItemFormFullDesc(e.target.value)}
                            placeholder="Expanded narrative details shown when customers view details of product..."
                            className="bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2.5 w-full h-20 text-xs text-neutral-800 outline-none"
                          />
                        </div>

                        {/* Boolean checkboxes */}
                        <div className="md:col-span-3 flex flex-wrap gap-4 pt-2 border-t border-neutral-100">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={itemFormIsAvailable}
                              onChange={(e) => setItemFormIsAvailable(e.target.checked)}
                              className="rounded text-[#E53935] focus:ring-[#FFC107] w-4 h-4"
                            />
                            <span className="font-bold text-[#121212]">In Stock / Available</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={itemFormIsPopular}
                              onChange={(e) => setItemFormIsPopular(e.target.checked)}
                              className="rounded text-[#E53935] focus:ring-[#FFC107] w-4 h-4"
                            />
                            <span className="font-bold text-[#E53935]">Show Hot Popular Badge</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={itemFormIsNew}
                              onChange={(e) => setItemFormIsNew(e.target.checked)}
                              className="rounded text-[#E53935] focus:ring-[#FFC107] w-4 h-4"
                            />
                            <span className="font-bold text-indigo-650">Show New Release Badge</span>
                          </label>
                        </div>

                        <div className="md:col-span-3 pt-3 flex justify-end gap-2">
                          <button
                            type="submit"
                            className="bg-[#E53935] text-white font-black uppercase text-xs px-6 py-3 rounded-xl hover:bg-red-750 transition-colors shadow-lg shadow-red-500/10"
                          >
                            Save Menu Item Changes
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Interactive table list to edit items */}
                    <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                        <span className="font-display font-black text-xs text-neutral-500 uppercase tracking-wider">
                          Compiled Menu Items Database ({menuItems.length})
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-neutral-50 text-neutral-450 uppercase font-mono text-[9px] border-b border-neutral-100">
                              <th className="p-4 font-bold">Image</th>
                              <th className="p-4 font-bold">Dish Name</th>
                              <th className="p-4 font-bold">Category</th>
                              <th className="p-4 font-bold">Price</th>
                              <th className="p-4 font-bold">In Stock</th>
                              <th className="p-4 font-bold">Rating</th>
                              <th className="p-4 text-right font-bold">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                            {menuItems.map((item) => (
                              <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                                <td className="p-4">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded-lg border border-neutral-200"
                                    referrerPolicy="no-referrer"
                                  />
                                </td>
                                <td className="p-4 font-bold text-neutral-800">
                                  <div>
                                    <span className="block text-xs">{item.name}</span>
                                    <span className="text-[10px] text-neutral-400 font-normal block font-mono">ID: {item.id}</span>
                                  </div>
                                </td>
                                <td className="p-4 capitalize text-neutral-500">
                                  {item.category}
                                </td>
                                <td className="p-4 font-mono font-bold text-neutral-800">
                                  {item.price} ETB
                                </td>
                                <td className="p-4">
                                  <span className={`p-1 px-2.5 rounded-full text-[10px] font-bold ${
                                    item.isAvailable 
                                      ? "bg-emerald-50 text-emerald-700" 
                                      : "bg-red-50 text-[#E53935]"
                                  }`}>
                                    {item.isAvailable ? "Available" : "Backorder"}
                                  </span>
                                </td>
                                <td className="p-4 text-amber-500 font-bold font-mono">
                                  ⭐ {item.rating} ({item.reviewsCount})
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={() => startEditItem(item)}
                                      className="p-1 px-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-medium text-[11px] flex items-center gap-1 transition-colors"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem(item.id)}
                                      className="p-1 px-2 rounded-lg bg-red-50 hover:bg-red-100 text-[#E53935] font-medium text-[11px] flex items-center gap-1 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

                {/* ======================= TABS CONTENT: 4. REVIEWS ARCHIVE ======================= */}
                {adminActiveSection === "reviews" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="sec-reviews">
                    
                    {/* Reviews list */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-black text-neutral-900 text-base">
                          Managing Customer Sentiment Feed
                        </h4>
                        <span className="text-xs font-mono text-neutral-400">Total {reviews.length} archive entries</span>
                      </div>

                      <div className="space-y-3">
                        {reviews.map((rev) => {
                          const item = menuItems.find(it => it.id === rev.itemId);
                          return (
                            <div key={rev.id} className="bg-white p-4.5 rounded-2xl border border-neutral-200/80 shadow-sm flex gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-bold text-xs text-[#121212]">{rev.customerName}</h5>
                                    <span className="text-[10px] text-[#E53935] font-semibold bg-red-50 px-2 py-0.5 rounded mr-2">
                                      Dish: {item?.name || rev.itemId}
                                    </span>
                                    <span className="text-[10px] text-neutral-450 font-mono">{rev.date}</span>
                                  </div>

                                  <div className="text-right">
                                    <div className="flex items-center gap-0.5 text-amber-500 justify-end">
                                      {Array.from({ length: rev.rating }).map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                                      ))}
                                    </div>
                                    <span className="text-[10px] text-neutral-400 block mt-1 font-mono">ID: {rev.id}</span>
                                  </div>
                                </div>

                                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                                  "{rev.comment}"
                                </p>
                              </div>

                              <div className="flex-shrink-0 self-start">
                                <button
                                  onClick={() => handleDeleteReview(rev.id)}
                                  className="p-1 px-2 bg-red-50 hover:bg-red-100 text-[#E53935] rounded-xl flex items-center gap-1 text-[11px]"
                                  title="Delete review comment"
                                >
                                  <Trash2 className="w-3 h-3" /> Remove
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Form to simulate reviews */}
                    <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                      <h4 className="font-display font-black text-neutral-900 text-base">
                        Simulate Review Entry
                      </h4>
                      <p className="text-xs text-neutral-400 leading-normal">
                        Pre-populate customer reviews for any specific menu entity to assess the rating calculations.
                      </p>

                      <form onSubmit={handleSimulateReview} className="space-y-3 pt-2">
                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Select Dish Entity
                          </label>
                          <select
                            value={reviewFormItem}
                            onChange={(e) => setReviewFormItem(e.target.value)}
                            className="bg-slate-50 border border-neutral-202 rounded-xl p-2 w-full text-xs text-neutral-800 outline-none"
                            required
                          >
                            <option value="">-- Choose Menu Item --</option>
                            {menuItems.map(it => (
                              <option key={it.id} value={it.id}>{it.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Customer Name
                          </label>
                          <input
                            type="text"
                            value={reviewFormAuthor}
                            onChange={(e) => setReviewFormAuthor(e.target.value)}
                            placeholder="e.g. Samuel Admasu"
                            className="bg-slate-50 border border-neutral-202 rounded-xl p-2 w-full text-xs text-neutral-800 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Star Grade Value
                          </label>
                          <select
                            value={reviewFormRating}
                            onChange={(e) => setReviewFormRating(Number(e.target.value))}
                            className="bg-slate-50 border border-neutral-202 rounded-xl p-2 w-full text-xs text-neutral-800 outline-none"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                            <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                            <option value={3}>⭐⭐⭐ 3 Stars</option>
                            <option value={2}>⭐⭐ 2 Stars</option>
                            <option value={1}>⭐ 1 Star</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Customer Review Comment
                          </label>
                          <textarea
                            value={reviewFormComment}
                            onChange={(e) => setReviewFormComment(e.target.value)}
                            placeholder="Type comment details..."
                            className="bg-slate-50 border border-neutral-202 rounded-xl p-2 w-full h-18 text-xs text-neutral-800 outline-none"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#121212] text-white font-bold text-xs py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                        >
                          Push simulated Review
                        </button>
                      </form>
                    </div>

                  </div>
                )}

                {/* ======================= TABS CONTENT: 5. USERS CRUD ======================= */}
                {adminActiveSection === "users" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="sec-users">
                    
                    {/* Users roles board list */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-black text-neutral-900 text-base">
                          Administrative Privilege Hierarchy
                        </h4>
                        <span className="text-xs font-mono text-neutral-400">{users.length} active roles</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-35">
                        {users.map((usr) => (
                          <div key={usr.id} className="bg-white p-4.5 rounded-2xl border border-neutral-200 shadow-sm flex items-start gap-3 justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={usr.avatar}
                                alt={usr.fullName}
                                className="w-10 h-10 rounded-full border border-neutral-200"
                              />
                              <div>
                                <h5 className="font-bold text-xs text-neutral-800">{usr.fullName}</h5>
                                <span className="text-[10px] text-neutral-400 font-mono">@{usr.username}</span>
                                <div className="mt-1">
                                  <span className={`p-1 px-2 rounded-lg text-[9px] font-mono font-black ${
                                    usr.role === "Super Admin" 
                                      ? "bg-red-50 text-[#E53935]" 
                                      : usr.role === "Admin" 
                                      ? "bg-amber-50 text-[#FFC107]" 
                                      : usr.role === "Menu Manager" 
                                      ? "bg-blue-50 text-blue-600" 
                                      : "bg-neutral-100 text-neutral-500"
                                  }`}>
                                    {usr.role}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => {
                                  setEditingUser(usr);
                                  setUserFormUsername(usr.username);
                                  setUserFormFullname(usr.fullName);
                                  setUserFormRole(usr.role);
                                  setUserFormAvatar(usr.avatar);
                                }}
                                className="p-1 px-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-[10px] rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(usr.id)}
                                className="p-1 px-2 bg-red-50 hover:bg-red-100 text-[#E53935] text-[10px] rounded"
                              >
                                Terminate
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Manage Users Form */}
                    <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                      <h4 className="font-display font-black text-neutral-900 text-base">
                        {editingUser ? "✏️ Revise Admin Account" : "✨ Provision New Role"}
                      </h4>
                      <p className="text-xs text-neutral-400 leading-normal">
                        Create user profiles with targeted permissions to test administrative workflows.
                      </p>

                      <form onSubmit={handleSaveUser} className="space-y-3 pt-2">
                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Account Username
                          </label>
                          <input
                            type="text"
                            value={userFormUsername}
                            onChange={(e) => setUserFormUsername(e.target.value)}
                            placeholder="e.g. sileshicook"
                            className="bg-slate-50 border border-neutral-200 rounded-xl p-2 w-full text-xs text-neutral-800 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Full Legal Name
                          </label>
                          <input
                            type="text"
                            value={userFormFullname}
                            onChange={(e) => setUserFormFullname(e.target.value)}
                            placeholder="e.g. Sileshi Kebede"
                            className="bg-slate-50 border border-neutral-200 rounded-xl p-2 w-full text-xs text-neutral-800 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Privilege Role Assignment
                          </label>
                          <select
                            value={userFormRole}
                            onChange={(e) => setUserFormRole(e.target.value as any)}
                            className="bg-slate-50 border border-neutral-200 rounded-xl p-2 w-full text-xs text-neutral-800 outline-none"
                          >
                            <option value="Super Admin">Super Admin (All Access)</option>
                            <option value="Admin">Admin</option>
                            <option value="Menu Manager">Menu Manager</option>
                            <option value="Viewer">Viewer (Read-Only)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                            Avatar URL
                          </label>
                          <input
                            type="text"
                            value={userFormAvatar}
                            onChange={(e) => setUserFormAvatar(e.target.value)}
                            placeholder="URL to profile picture"
                            className="bg-slate-50 border border-neutral-200 rounded-xl p-2 w-full text-xs text-neutral-800 outline-none"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 bg-[#121212] text-white font-bold text-xs py-2.5 rounded-xl hover:bg-neutral-800"
                          >
                            Save User Account
                          </button>
                        </div>
                      </form>
                    </div>

                  </div>
                )}

                {/* ======================= TABS CONTENT: 6. SETTINGS ======================= */}
                {adminActiveSection === "settings" && (
                  <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm max-w-xl space-y-6" id="sec-settings">
                    <div className="space-y-1.5">
                      <h4 className="font-display font-black text-neutral-900 text-base">
                        Global Configurations Settings
                      </h4>
                      <p className="text-xs text-neutral-400 leading-normal">
                        Configure brand definitions, tax scales, and dynamic checkout features.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2 text-xs">
                      <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                        <h5 className="font-bold text-[#121212]">Menu Settings</h5>
                        <div className="space-y-2.5">
                          <label className="flex items-center justify-between">
                            <span>Enable QR Code ordering on tables</span>
                            <input type="checkbox" defaultChecked className="rounded text-[#E53935]" />
                          </label>
                          <label className="flex items-center justify-between">
                            <span>Charge 15% VAT automatically under ETB</span>
                            <input type="checkbox" defaultChecked className="rounded text-[#E53935]" />
                          </label>
                          <label className="flex items-center justify-between">
                            <span>Display Calorie indicator to consumers</span>
                            <input type="checkbox" defaultChecked className="rounded text-[#E53935]" />
                          </label>
                        </div>
                      </div>

                      <div className="p-4 bg-red-50/40 rounded-2xl border border-red-100 space-y-3">
                        <h5 className="font-bold text-[#E53935]">Extreme Sandbox Controls</h5>
                        <p className="text-[11px] text-neutral-500">
                          Revert all interactive CRUD state modifications back to pristine defaults.
                        </p>
                        <button
                          onClick={() => {
                            checkPermissionAndAction(() => {
                              localStorage.removeItem("wow_menu_items");
                              localStorage.removeItem("wow_categories");
                              localStorage.removeItem("wow_reviews");
                              localStorage.removeItem("wow_users");
                              localStorage.removeItem("wow_favorites");
                              setMenuItems(INITIAL_MENU_ITEMS);
                              setCategories(CATEGORIES);
                              setReviews(INITIAL_REVIEWS);
                              setUsers(INITIAL_USERS);
                              setFavorites(["classic-wow", "retro-strawberry"]);
                              showToast("🔄 Database restored completely!");
                            });
                          }}
                          className="w-full bg-[#E53935] hover:bg-red-750 text-white font-bold py-2 px-3 rounded-xl transition-colors"
                        >
                          Factory Restore Local Database
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================= TABS CONTENT: INGREDIENTS ======================= */}
                {adminActiveSection === "ingredients" && (
                  <div className="space-y-6 animate-fade-in" id="sec-ingredients">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                      <div className="space-y-1">
                        <h3 className="font-display font-black text-neutral-900 dark:text-white text-lg">WOW Ingredients Inventory</h3>
                        <p className="text-xs text-neutral-400 dark:text-stone-450">Track and replenish essential kitchen stock counts in real-time.</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            checkPermissionAndAction(() => {
                              const name = prompt("Enter ingredient name:");
                              if (!name) return;
                              const qty = parseInt(prompt("Enter initial quantity:") || "100");
                              const min = parseInt(prompt("Enter minimal warning threshold:") || "30");
                              const unit = prompt("Enter unit (e.g., pcs, kg, bags, liters):") || "pcs";
                              const supplier = prompt("Enter supplier brand name:") || "Premium Foods Inc.";
                              
                              const nextId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1;
                              const newIng = {
                                id: nextId,
                                name,
                                quantity: qty,
                                minStock: min,
                                unit,
                                supplier,
                                status: (qty <= 0 ? "Out of Stock" : qty <= min ? "Low Stock" : "Good") as any
                              };
                              setIngredients(prev => [...prev, newIng]);
                              showToast(`Ingredient ${name} added perfectly! 🥗`);
                            });
                          }}
                          className="px-3.5 py-2 bg-[#E11D48] hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1 cursor-pointer font-sans"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Stock Item</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-3xl border border-neutral-200 dark:border-stone-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-neutral-50 dark:bg-stone-800/50 border-b border-neutral-200 dark:border-stone-700/60 font-bold text-neutral-500 dark:text-stone-400">
                                <th className="p-4 uppercase tracking-wider font-mono text-[10px]">Item Name</th>
                                <th className="p-4 uppercase tracking-wider font-mono text-[10px]">Stock Level</th>
                                <th className="p-4 uppercase tracking-wider font-mono text-[10px]">Supplier</th>
                                <th className="p-4 uppercase tracking-wider font-mono text-[10px] text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-stone-800/80">
                              {ingredients.map((ing) => {
                                const isLow = ing.quantity <= ing.minStock;
                                const isOut = ing.quantity <= 0;
                                return (
                                  <tr key={ing.id} className="hover:bg-neutral-50/50 dark:hover:bg-stone-800/30 text-neutral-800 dark:text-stone-300">
                                    <td className="p-4 font-bold">
                                      <div className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${isOut ? "bg-red-500" : isLow ? "bg-amber-400" : "bg-emerald-500 animate-pulse"}`} />
                                        <span>{ing.name}</span>
                                      </div>
                                      <span className="text-[10px] text-neutral-400 dark:text-stone-500 font-mono block mt-0.5">Threshold: {ing.minStock} {ing.unit}</span>
                                    </td>
                                    <td className="p-4">
                                      <span className={`font-mono font-bold px-2.5 py-1 rounded-lg text-[11px] ${isOut ? "bg-red-50 dark:bg-rose-950/20 text-red-650" : isLow ? "bg-amber-50 dark:bg-amber-950/25 text-amber-600" : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600"}`}>
                                        {ing.quantity} {ing.unit}
                                      </span>
                                    </td>
                                    <td className="p-4 text-neutral-450 dark:text-stone-455 font-sans pr-2">{ing.supplier}</td>
                                    <td className="p-4 text-right space-x-1 flex items-center justify-end">
                                      <button
                                        onClick={() => {
                                          checkPermissionAndAction(() => {
                                            const addStr = prompt(`Replenish ${ing.name} - Enter count to add:`);
                                            if (!addStr) return;
                                            const addVal = parseInt(addStr);
                                            if (isNaN(addVal)) return;
                                            
                                            setIngredients(prev => prev.map(i => {
                                              if (i.id === ing.id) {
                                                const newQty = i.quantity + addVal;
                                                return {
                                                  ...i,
                                                  quantity: newQty,
                                                  status: (newQty <= 0 ? "Out of Stock" : newQty <= i.minStock ? "Low Stock" : "Good") as any
                                                };
                                              }
                                              return i;
                                            }));
                                            showToast(`Stock updated for ${ing.name}! 📦`);
                                          });
                                        }}
                                        className="px-2.5 py-1.5 bg-neutral-100 dark:bg-stone-800 hover:bg-neutral-200 dark:hover:bg-stone-700 text-neutral-700 dark:text-stone-300 rounded-lg font-bold text-[10px] cursor-pointer"
                                      >
                                        Restock
                                      </button>
                                      <button
                                        onClick={() => {
                                          checkPermissionAndAction(() => {
                                            setIngredients(prev => prev.filter(i => i.id !== ing.id));
                                            showToast("Ingredient deleted! 🗑️");
                                          });
                                        }}
                                        className="p-1.5 text-neutral-400 hover:text-[#E11D48] cursor-pointer"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-neutral-200 dark:border-stone-800 shadow-sm p-6 space-y-4">
                        <h4 className="font-display font-black text-neutral-900 dark:text-white text-sm">Inventory Alert Thresholds</h4>
                        <p className="text-xs text-neutral-450 dark:text-stone-500">Our kitchen monitors automatic low stock triggers based on typical meal orders.</p>
                        
                        <div className="space-y-3.5 text-xs text-neutral-700 dark:text-stone-300">
                          {ingredients.filter(i => i.quantity <= i.minStock).length === 0 ? (
                            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500 animate-pulse" />
                              <span className="font-bold font-sans">Perfect Stock Status! All levels green.</span>
                            </div>
                          ) : (
                            ingredients.filter(i => i.quantity <= i.minStock).map(i => (
                              <div key={i.id} className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl flex items-center justify-between" id={`alert-stock-${i.id}`}>
                                <span className="font-bold text-amber-950 dark:text-amber-400">{i.name}</span>
                                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-305 px-2.5 py-1 rounded-lg font-bold font-mono">
                                  {i.quantity} left
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================= TABS CONTENT: IMAGES ======================= */}
                {adminActiveSection === "images" && (
                  <div className="space-y-6 animate-fade-in" id="sec-images">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                      <div className="space-y-1">
                        <h3 className="font-display font-black text-neutral-900 dark:text-white text-lg">Media Library</h3>
                        <p className="text-xs text-neutral-400 dark:text-stone-450">Manage vector, banner, and item thumbnail imagery storage.</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          checkPermissionAndAction(() => {
                            const title = prompt("Enter media item title:");
                            if (!title) return;
                            const url = prompt("Enter Image URL:") || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80";
                            const cat = prompt("Category tag (e.g. burgers, drinks, banners):") || "burgers";
                            
                            const nextId = mediaImages.length > 0 ? Math.max(...mediaImages.map(m => m.id)) + 1 : 1;
                            const newImg = {
                              id: nextId,
                              title,
                              url,
                              size: "450 KB",
                              type: "image/jpeg",
                              category: cat
                            };
                            setMediaImages(prev => [newImg, ...prev]);
                            showToast(`Image ${title} registered to gallery! 📸`);
                          });
                        }}
                        className="px-4 py-2 bg-neutral-900 dark:bg-stone-800 hover:bg-neutral-855 dark:hover:bg-stone-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer font-sans"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload Mock Graphic</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {mediaImages.map((img) => (
                        <div key={img.id} className="group bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between" id={`image-card-${img.id}`}>
                          <div className="aspect-square bg-slate-100 dark:bg-stone-800 relative overflow-hidden">
                            <img
                              src={img.url}
                              alt={img.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute bottom-2 left-2 bg-black/70 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                              {img.category}
                            </span>
                          </div>
                          
                          <div className="p-3.5 space-y-1.5">
                            <h4 className="text-xs font-bold text-neutral-800 dark:text-stone-300 truncate font-display">{img.title}</h4>
                            <div className="flex items-center justify-between font-mono text-[9px] text-neutral-400 dark:text-stone-500">
                              <span>{img.size}</span>
                              <span>JPG</span>
                            </div>
                          </div>

                          <div className="p-2 border-t border-neutral-100 dark:border-stone-800/80 bg-neutral-50 dark:bg-stone-850/30 flex items-center justify-around gap-1 font-sans">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(img.url);
                                showToast("Copied dynamic asset path! 📋");
                              }}
                              className="px-2 py-1.5 text-[10px] font-bold bg-white dark:bg-stone-800 hover:bg-neutral-100 rounded-lg text-neutral-600 dark:text-stone-400 transition-colors flex-1 text-center cursor-pointer"
                            >
                              Copy path
                            </button>
                            <button
                              onClick={() => {
                                checkPermissionAndAction(() => {
                                  setMediaImages(prev => prev.filter(m => m.id !== img.id));
                                  showToast("Asset detached from server! 🗑️");
                                });
                              }}
                              className="p-1 px-1.5 bg-red-50 text-red-650 hover:bg-red-100 hover:text-red-700 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ======================= TABS CONTENT: OFFERS ======================= */}
                {adminActiveSection === "offers" && (
                  <div className="space-y-6 animate-fade-in" id="sec-offers">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                      <div className="space-y-1">
                        <h3 className="font-display font-black text-neutral-900 dark:text-white text-lg">Interactive Discount Offers</h3>
                        <p className="text-xs text-neutral-400 dark:text-stone-450">Configure public code coupons, seasonal reductions, and discounts.</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          checkPermissionAndAction(() => {
                            const title = prompt("Enter Offer Campaign Name:");
                            if (!title) return;
                            const prCode = prompt("Enter Promo Coupon Code (e.g. WOWFAST10):") || "WOWFAST50";
                            const disPercent = parseInt(prompt("Enter Discount Percent (e.g. 15):") || "15");
                            const subtitle = prompt("Enter subtitles text:") || "Valid on classic burger deals";
                            const valid = prompt("Valid timeframe:") || "Till end of month";

                            const nextId = offers.length > 0 ? Math.max(...offers.map(o => o.id)) + 1 : 1;
                            const newOff = {
                              id: nextId,
                              title,
                              subtitle,
                              promoCode: prCode,
                              discountPercent: disPercent,
                              validity: valid,
                              isActive: true
                            };
                            setOffers(prev => [...prev, newOff]);
                            showToast(`Discount Campaign ${title} is green! 🏷️`);
                          });
                        }}
                        className="px-4 py-2 bg-[#E11D48] hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer font-sans"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Offer Coupon</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {offers.map((off) => (
                        <div key={off.id} className="bg-white dark:bg-stone-900 border border-neutral-205 dark:border-stone-805 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between" id={`offer-card-${off.id}`}>
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/20 to-red-500/20 rounded-full blur-2xl pointer-events-none" />
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="bg-[#E53935] text-white font-mono text-[11px] font-black px-2.5 py-1 rounded-xl">
                                {off.discountPercent}% OFF
                              </span>
                              
                              <label className="flex items-center gap-2 cursor-pointer font-sans">
                                <input
                                  type="checkbox"
                                  checked={off.isActive}
                                  onChange={(e) => {
                                    setOffers(prev => prev.map(o => o.id === off.id ? { ...o, isActive: e.target.checked } : o));
                                    showToast(`${off.title} Campaign status updated! 🔄`);
                                  }}
                                  className="w-4 h-4 rounded text-emerald-500 font-bold focus:ring-[#FFC107] cursor-pointer"
                                />
                                <span className={`text-[10px] font-bold ${off.isActive ? "text-emerald-600 font-black" : "text-neutral-400 font-mono"}`}>
                                  {off.isActive ? "LIVE" : "DRAFT"}
                                </span>
                              </label>
                            </div>

                            <div className="space-y-1">
                              <h4 className="font-display font-black text-neutral-955 dark:text-white text-base leading-snug">{off.title}</h4>
                              <p className="text-xs text-neutral-500 dark:text-stone-400">{off.subtitle}</p>
                            </div>
                          </div>

                          <div className="pt-5 mt-5 border-t border-dashed border-neutral-200 dark:border-stone-800 bg-transparent">
                            <div className="bg-amber-100/30 dark:bg-amber-950/20 p-2.5 rounded-xl border border-dashed border-amber-300 dark:border-amber-800/60 flex items-center justify-between font-mono">
                              <span className="text-[10.5px] text-amber-900 dark:text-amber-400">Coupon:</span>
                              <span className="font-black text-xs text-[#E53935] tracking-widest">{off.promoCode}</span>
                            </div>
                            <div className="flex items-center justify-between mt-3 text-[10px] text-neutral-400 dark:text-stone-500 font-sans">
                              <span>Validity: {off.validity}</span>
                              <button
                                onClick={() => {
                                  checkPermissionAndAction(() => {
                                    setOffers(prev => prev.filter(o => o.id !== off.id));
                                    showToast("Offer detoured! 🗑️");
                                  });
                                }}
                                className="text-neutral-400 hover:text-red-651 cursor-pointer text-[10.5px] font-bold"
                              >
                                Delete campaign
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ======================= TABS CONTENT: BANNERS ======================= */}
                {adminActiveSection === "banners" && (
                  <div className="space-y-6 animate-fade-in" id="sec-banners">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                      <div className="space-y-1">
                        <h3 className="font-display font-black text-neutral-900 dark:text-white text-lg">Interactive Home Page Banners</h3>
                        <p className="text-xs text-neutral-400 dark:text-stone-450">Upload and configure promotional cards displayed prominently at customer entry.</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          checkPermissionAndAction(() => {
                            const title = prompt("Banner Title:");
                            if (!title) return;
                            const kicker = prompt("Banner kicker/tagline:") || "LIMITED EDITION CAMPAIGN";
                            const cta = prompt("CTA action button text:") || "Order Gourmet Now";
                            const imgUrl = prompt("Banner Background Image URL:") || "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80";

                            const nextId = banners.length > 0 ? Math.max(...banners.map(b => b.id)) + 1 : 1;
                            const newBanner = {
                              id: nextId,
                              title,
                              kicker,
                              imageUrl: imgUrl,
                              ctaText: cta,
                              isLive: true
                            };
                            setBanners(prev => [...prev, newBanner]);
                            showToast(`Banner campaign ${title} appended! 📱`);
                          });
                        }}
                        className="px-4 py-2 bg-neutral-950 dark:bg-stone-800 hover:bg-neutral-850 dark:hover:bg-stone-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer font-sans"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Live Banner</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {banners.map((ban) => (
                        <div key={ban.id} className="bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between" id={`banner-card-${ban.id}`}>
                          <div className="h-40 relative bg-slate-900">
                            <img
                              src={ban.imageUrl}
                              alt={ban.title}
                              className="w-full h-full object-cover opacity-85"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 flex flex-col justify-end space-y-1">
                              <span className="text-[9px] uppercase tracking-wider font-mono font-black text-[#FFC107]">{ban.kicker}</span>
                              <h4 className="font-display font-black text-white text-lg tracking-tight leading-tight">{ban.title}</h4>
                            </div>
                          </div>

                          <div className="p-5 flex items-center justify-between border-t border-neutral-100 dark:border-stone-800/80 bg-neutral-50/50 dark:bg-stone-850/20 text-xs">
                            <span className="font-mono text-[10.5px] text-neutral-400 dark:text-stone-500 font-sans">CTA: <strong className="text-neutral-700 dark:text-stone-300 font-sans">{ban.ctaText}</strong></span>
                            
                            <div className="flex items-center gap-4 font-sans">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={ban.isLive}
                                  onChange={(e) => {
                                    setBanners(prev => prev.map(b => b.id === ban.id ? { ...b, isLive: e.target.checked } : b));
                                    showToast(`${ban.title} live status changed! 🔄`);
                                  }}
                                  className="w-4.5 h-4.5 rounded text-[#E53935] focus:ring-[#E53935]"
                                />
                                <span className="font-black text-[10px] text-neutral-500 dark:text-stone-400">{ban.isLive ? "LIVE ON APP" : "DRAFT"}</span>
                              </label>

                              <button
                                onClick={() => {
                                  checkPermissionAndAction(() => {
                                    setBanners(prev => prev.filter(b => b.id !== ban.id));
                                    showToast("Banner Campaign deleted! 🗑️");
                                  });
                                }}
                                className="text-neutral-400 hover:text-red-650 transition-colors p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ======================= TABS CONTENT: LOGIN LOGS ======================= */}
                {adminActiveSection === "logs" && (
                  <div className="bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in" id="sec-logs">
                    <div className="space-y-1.5 font-sans">
                      <h4 className="font-display font-black text-neutral-900 dark:text-white text-base">Administrative Access Logs</h4>
                      <p className="text-xs text-neutral-400 dark:text-stone-450 leading-normal">
                        Audit security, sessions, credentials triggers, and local testing logs with relative sandbox markers.
                      </p>
                    </div>

                    <div className="border border-neutral-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-neutral-50 dark:bg-stone-800/40 border-b border-neutral-200 dark:border-stone-750 font-bold text-neutral-500 dark:text-stone-400">
                              <th className="p-3.5 font-mono text-[10px]">Attempt ID</th>
                              <th className="p-3.5 text-[10px]">Administrator</th>
                              <th className="p-3.5 text-[10px]">Timestamp</th>
                              <th className="p-3.5 text-[10px]">IP Address</th>
                              <th className="p-3.5 text-right text-[10px]">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 dark:divide-stone-800/80 font-mono text-[11px] text-neutral-700 dark:text-stone-300">
                            {loginLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-neutral-50/40 dark:hover:bg-stone-850/20" id={`log-row-${log.id}`}>
                                <td className="p-3.5 font-semibold text-neutral-400">#WOW-SEC-{log.id * 102}</td>
                                <td className="p-3.5 font-bold font-sans text-neutral-800 dark:text-white">{log.username}</td>
                                <td className="p-3.5 text-neutral-500 dark:text-stone-400">{log.timestamp}</td>
                                <td className="p-3.5 text-neutral-400">{log.ip}</td>
                                <td className="p-3.5 text-right font-sans">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">
                                    {log.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </main>
              
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ==================================================================== */}
      {/*                    3. GOURMET CUSTOMER DETAILED MODAL                */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {activeDetailedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#121212]/80 backdrop-blur-md z-50 overflow-y-auto flex items-center justify-center p-0 md:p-6"
            onClick={() => setSelectedItemId(null)}
            id="detailed-item-overlay"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.9 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="bg-white w-full max-w-lg min-h-screen md:min-h-0 md:max-h-[92vh] md:rounded-[2.5rem] flex flex-col overflow-hidden relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Close Hover button */}
              <button
                onClick={() => setSelectedItemId(null)}
                className="absolute top-4 right-4 z-30 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md transition-colors"
                title="Back to menu catalog"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex-1 overflow-y-auto pb-24" id="modal-scroller-node">
                
                {/* Hero High-Fidelity Food Shot */}
                <div className="w-full h-72 sm:h-80 bg-neutral-900 relative">
                  <img
                    src={activeDetailedItem.image}
                    alt={activeDetailedItem.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Glowing vignette fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
                  
                  {/* Interactive heart quick toggle on photo */}
                  <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2 items-center">
                    <span className="bg-[#E53935] text-white font-mono text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                      {activeDetailedItem.category.toUpperCase()}
                    </span>
                    {activeDetailedItem.isPopular && (
                      <span className="bg-[#FFC107] text-[#121212] font-mono text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                        🔥 HOT BESTSELLER
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleFavorite(activeDetailedItem.id)}
                    className="absolute bottom-4 right-4 z-10 p-3 rounded-full bg-white/95 text-neutral-400 hover:text-[#E53935] shadow-lg"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(activeDetailedItem.id) ? "fill-[#E53935] text-[#E53935]" : ""}`} />
                  </button>
                </div>

                {/* Body Content Description */}
                <div className="p-6 space-y-6">
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display font-black text-neutral-950 text-2xl md:text-3xl tracking-tight leading-none">
                        {activeDetailedItem.name}
                      </h3>
                      <span className="font-mono text-xl text-[#E53935] font-black bg-red-50 border border-red-100 px-4 py-1.5 rounded-2xl shadow-sm flex-shrink-0">
                        {activeDetailedItem.price} ETB
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      <span className="bg-neutral-100 border border-neutral-200 rounded-lg py-1 px-2.5 text-[11px] font-mono font-medium text-neutral-600">
                        ⚡ {activeDetailedItem.calories} Calories
                      </span>
                      {activeDetailedItem.dietaryBadges.map((diet) => (
                        <span key={diet} className="bg-emerald-50 text-emerald-700 border border-emerald-150 rounded-lg py-1 px-2.5 text-[11px] font-bold">
                          🥬 {diet}
                        </span>
                      ))}
                      <span className="bg-amber-50 border border-amber-100 rounded-lg py-1 px-2.5 text-[11px] font-mono font-bold text-amber-700 flex items-center gap-1">
                        ⭐ {activeAverageRating} ({activeReviews.length} Reviews)
                      </span>
                    </div>
                  </div>

                  {/* Copywriting statement */}
                  <div className="space-y-1.5">
                    <p className="text-xs text-[#E53935] uppercase font-mono font-black tracking-widest">
                      Gourmet Experience Description
                    </p>
                    <p className="text-neutral-600 font-light text-sm leading-relaxed">
                      {activeDetailedItem.fullDescription}
                    </p>
                  </div>

                  {/* Checklist Ingredients list (✓ Format requested!) */}
                  <div className="space-y-3 bg-neutral-50/50 rounded-3xl border border-neutral-100/80 p-5">
                    <h4 className="font-display font-black text-neutral-900 text-sm tracking-tight">
                      ✓ Sourced Ingredients
                    </h4>
                    
                    <ul className="grid grid-cols-2 gap-2 text-xs text-neutral-700">
                      {activeDetailedItem.ingredients.map((ing, k) => (
                        <li key={k} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-neutral-100 shadow-xs">
                          <Check className="w-3.5 h-3.5 text-[#E53935] shrink-0" />
                          <span className="font-semibold text-neutral-800">{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Allergen Sensitivity notice */}
                  {activeDetailedItem.allergens.length > 0 && (
                    <div className="bg-amber-50/40 p-4.5 rounded-2xl border border-amber-100 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest font-black text-amber-700 block">
                        ⚠️ Allergen Precaution Check
                      </span>
                      <p className="text-[11px] text-neutral-500 leading-normal font-light">
                        This culinary recipe contains: <strong className="text-neutral-800">{activeDetailedItem.allergens.join(", ")}</strong>. Please speak with kitchen crew regarding customizations.
                      </p>
                    </div>
                  )}

                  {/* CUSTOMER REVIEWS ARCHIVE SECTION */}
                  <div className="space-y-4 pt-4 border-t border-neutral-100" id="reviews-section">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-black text-neutral-900 text-sm">
                        Total Sentiment Reviews ({activeReviews.length})
                      </h4>
                      <div className="flex items-center gap-1 bg-amber-50 rounded-lg p-1 px-2">
                        <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                        <span className="text-xs font-bold text-neutral-800">{activeAverageRating}</span>
                      </div>
                    </div>

                    {activeReviews.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic bg-neutral-50 p-4 rounded-xl text-center">
                        No customer logs for this dish yet. Be the very first to comment!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {activeReviews.map((rev) => (
                          <div key={rev.id} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-150/90 text-xs text-neutral-600 space-y-1">
                            <div className="flex justify-between items-center font-bold text-neutral-800">
                              <span className="text-[12px]">{rev.customerName}</span>
                              <div className="flex gap-0.5 text-[#FFC107]">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-current text-[#FFC107]" />
                                ))}
                              </div>
                            </div>
                            <p className="font-light text-[12px] leading-relaxed">
                              "{rev.comment}"
                            </p>
                            <span className="block text-[10px] text-neutral-400 text-right">{rev.date}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* NEW REVIEW SUBMISSION FORM */}
                    <form onSubmit={handleAddReview} className="bg-slate-50 p-4.5 rounded-3xl border border-neutral-200 mt-4 space-y-3.5">
                      <div className="space-y-1">
                        <h5 className="font-display font-black text-xs text-neutral-800 uppercase tracking-wider">
                          Share your gourmet review
                        </h5>
                        <p className="text-[10px] text-neutral-400 font-light">
                          Post your rating or recommend ingredient modifications.
                        </p>
                      </div>

                      {reviewSubmitMessage && (
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] font-bold text-center">
                          {reviewSubmitMessage}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-black block">Your Name</label>
                          <input
                            type="text"
                            value={newReviewAuthor}
                            onChange={(e) => setNewReviewAuthor(e.target.value)}
                            placeholder="e.g. Elias Daniel"
                            className="bg-white border border-neutral-200 rounded-xl p-2 w-full text-xs text-neutral-800 outline-none"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-black block font-bold">Grade Level</label>
                          <select
                            value={newReviewRating}
                            onChange={(e) => setNewReviewRating(Number(e.target.value))}
                            className="bg-white border border-neutral-202 rounded-xl p-2 w-full text-xs text-neutral-800 outline-none font-bold"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                            <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                            <option value={3}>⭐⭐⭐ 3 Stars</option>
                            <option value={2}>⭐⭐ 2 Stars</option>
                            <option value={1}>⭐ 1 Star</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-black block">Your Comment</label>
                        <textarea
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          placeholder="Tell cooks how juicy the beef was..."
                          className="bg-white border border-neutral-202 rounded-xl p-2 w-full h-20 text-xs text-neutral-800 outline-none resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#121212] hover:bg-neutral-800 text-[#FFC107] font-black text-xs py-3 rounded-xl uppercase tracking-wider shadow-md"
                      >
                        Publish Sentiment Review
                      </button>
                    </form>

                  </div>

                </div>
              </div>

              {/* Pin back button */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-white via-white to-white/70 border-t border-neutral-100 z-10">
                <button
                  onClick={() => setSelectedItemId(null)}
                  className="w-full bg-[#121212] hover:bg-neutral-800 text-white font-black text-xs py-3.5 rounded-2xl uppercase tracking-widest font-mono shadow-md"
                >
                  Return to Menu
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER BLOCK */}
      <footer className="bg-[#121212] text-neutral-500 py-10 px-4 text-center border-t border-neutral-800" id="wow-main-footer">
        <div className="max-w-md mx-auto space-y-3.5">
          <div className="flex items-center justify-center gap-1 text-[#FFC107] font-extrabold text-sm uppercase">
            <span>WOW BURGER</span>
            <span className="w-1 h-1 bg-[#E53935] rounded-full" />
            <span>Digital Platform</span>
          </div>
          <p className="text-xs text-neutral-400 leading-normal font-light">
            Crafted for premium smartphone deployment. Implemented with reactive local state variables, fully authorized admin workspace control modules, and two-column gourmet menu displays.
          </p>
          <p className="text-[9px] text-neutral-500 font-mono">
            Powered by Wow-Menu QR Engine • Table #08
          </p>
        </div>
      </footer>

    </div>
  );
}
