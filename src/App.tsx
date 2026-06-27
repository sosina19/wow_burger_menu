import React, { useState, useEffect } from "react";
import {
  Flame,
  Search,
  SlidersHorizontal,
  Star,
  Plus,
  Eye,
  Heart,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  ShoppingBag,
  Percent,
  Settings,
  Shield,
  Upload,
  Trash2,
  ListFilter,
  Package,
  History,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
  Users,
  X,
  RefreshCw,
  Home,
  Utensils,
  CupSoda,
  ClipboardList,
  QrCode,
  Minus,
  Check,
  Printer,
  Download,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MenuItem, Category, Review, User, Offer, Banner, Ingredient, ActivityLog, AnalyticsData, ItemImage } from "./types";
import { api, getLoggedInUser, getAuthToken } from "./utils/api";
import { MenuCarousel } from "./components/MenuCarousel";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { EmployeeManagement } from "./components/EmployeeManagement";
import { PasswordChange } from "./components/PasswordChange";

const CATEGORIES: Category[] = [
  { id: "burgers", title: "Burgers", icon: "🍔", description: "Premium flame-grilled burgers" },
  { id: "sides", title: "Sides", icon: "🍟", description: "Golden crispy sides & snacks" },
  { id: "drinks", title: "Drinks", icon: "🥤", description: "Cold shakes, sodas, & brews" },
  { id: "desserts", title: "Desserts", icon: "🍰", description: "Decadent bakes & sweet treats" }
];

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("wow_dark_mode") === "true";
  });

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(getLoggedInUser());
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  // QR Code Table Ordering States
  const [tableNumber, setTableNumber] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const tbl = params.get("table") || localStorage.getItem("wow_table_number") || "";
    if (tbl) {
      localStorage.setItem("wow_table_number", tbl);
    }
    return tbl;
  });

  interface CartItem {
    menuItem: MenuItem;
    quantity: number;
  }

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("wow_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wow_cart", JSON.stringify(cart));
  }, [cart]);

  const [customerName, setCustomerName] = useState(() => localStorage.getItem("wow_customer_name") || "");
  const [customerPhone, setCustomerPhone] = useState(() => localStorage.getItem("wow_customer_phone") || "");
  const [orderNotes, setOrderNotes] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<any>(null);

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedItemImages, setSelectedItemImages] = useState<ItemImage[]>([]);
  const [modalQty, setModalQty] = useState(1);
  const [itemReviews, setItemReviews] = useState<Review[]>([]);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Customer Catalog State
  const [activeTab, setActiveTab] = useState<"home" | "food" | "drinks" | "favorites" | "cart">("home");
  const [catalogItems, setCatalogItems] = useState<MenuItem[]>([]);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategory, setCatalogCategory] = useState<string>("all");
  const [catalogMinPrice] = useState(0);
  const [catalogMaxPrice, setCatalogMaxPrice] = useState(1000);
  const [catalogOnlyAvailable, setCatalogOnlyAvailable] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("wow_favorites") || '["classic-wow", "retro-strawberry"]');
    } catch {
      return ["classic-wow", "retro-strawberry"];
    }
  });

  // Admin View state
  const [adminTab, setAdminTab] = useState<"dashboard" | "menu" | "employees" | "offers" | "banners" | "inventory" | "logs" | "security" | "orders" | "qrcodes">("orders");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Orders polling & states
  const [orders, setOrders] = useState<any[]>([]);
  const [lastOrdersCount, setLastOrdersCount] = useState<number>(0);
  const [ordersSearch, setOrdersSearch] = useState("");
  const [ordersStatusFilter, setOrdersStatusFilter] = useState("all");
  const [ordersTableFilter, setOrdersTableFilter] = useState("all");
  const [ordersDateFilter, setOrdersDateFilter] = useState("");

  // QR Code Generation Panel State
  const [qrCodeTableCount, setQrCodeTableCount] = useState(10);
  const [selectedQrTable, setSelectedQrTable] = useState<string>("1");

  // Admin Items list pagination & queries
  const [adminItems, setAdminItems] = useState<MenuItem[]>([]);
  const [adminTotalItems, setAdminTotalItems] = useState(0);
  const [adminPage, setAdminPage] = useState(1);
  const [adminLimit, setAdminLimit] = useState(10);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminCategory, setAdminCategory] = useState("all");
  const [adminMinPrice] = useState(0);
  const [adminMaxPrice, setAdminMaxPrice] = useState(1000);
  const [adminOnlyAvailable, setAdminOnlyAvailable] = useState<"all" | "true" | "false">("all");
  const [adminSortBy, setAdminSortBy] = useState("dateAdded");
  const [adminSortOrder, setAdminSortOrder] = useState<"asc" | "desc">("desc");

  // Admin edit/create MenuItem Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCat, setItemCat] = useState<MenuItem["category"]>("burgers");
  const [itemShortDesc, setItemShortDesc] = useState("");
  const [itemFullDesc, setItemFullDesc] = useState("");
  const [itemPrimaryImage, setItemPrimaryImage] = useState("");
  const [itemIngredients, setItemIngredients] = useState("");
  const [itemAllergens, setItemAllergens] = useState("");
  const [itemBadges, setItemBadges] = useState<string[]>([]);
  const [itemCalories, setItemCalories] = useState("500");
  const [itemAvailable, setItemAvailable] = useState(true);
  const [itemIsPopular, setItemIsPopular] = useState(false);
  const [itemIsNew, setItemIsNew] = useState(true);

  // Multiple Images Manager state (within Edit Modal)
  const [uploadedImages, setUploadedImages] = useState<ItemImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // System Configs lists
  const [offersList, setOffersList] = useState<Offer[]>([]);
  const [bannersList, setBannersList] = useState<Banner[]>([]);
  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<ActivityLog[]>([]);

  // Offers modal
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerSubtitle, setOfferSubtitle] = useState("");
  const [offerCode, setOfferCode] = useState("");
  const [offerDiscount, setOfferDiscount] = useState("15");
  const [offerValidity, setOfferValidity] = useState("");
  const [offerActive, setOfferActive] = useState(true);

  // Banners modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerKicker, setBannerKicker] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerCta, setBannerCta] = useState("");
  const [bannerLive, setBannerLive] = useState(true);

  // Ingredients modal
  const [isIngModalOpen, setIsIngModalOpen] = useState(false);
  const [ingName, setIngName] = useState("");
  const [ingQty, setIngQty] = useState("100");
  const [ingMin, setIngMin] = useState("30");
  const [ingUnit, setIngUnit] = useState("pcs");
  const [ingSupplier, setIngSupplier] = useState("");

  // Login form state
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErr, setLoginErr] = useState("");

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync favorites
  useEffect(() => {
    localStorage.setItem("wow_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Sync dark theme
  useEffect(() => {
    localStorage.setItem("wow_dark_mode", String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Fetch customer catalog items
  const fetchCatalog = async () => {
    try {
      const isFavoritesTab = activeTab === "favorites";
      const catFilter = isFavoritesTab ? "all" : (activeTab === "food" ? "burgers" : activeTab === "drinks" ? "drinks" : catalogCategory);
      const res = await api.getMenu({
        search: catalogSearch,
        category: catFilter === "all" ? undefined : catFilter,
        minPrice: catalogMinPrice,
        maxPrice: catalogMaxPrice,
        isAvailable: catalogOnlyAvailable ? true : undefined,
        limit: 100 // Load full scrollable grid for clients
      });

      let items = [...res.data];

      // Special handling for Client "sides" which fall under "food" tab
      if (activeTab === "food") {
        const sidesRes = await api.getMenu({
          search: catalogSearch,
          category: "sides",
          minPrice: catalogMinPrice,
          maxPrice: catalogMaxPrice,
          isAvailable: catalogOnlyAvailable ? true : undefined,
          limit: 100
        });
        items = [...items, ...sidesRes.data];
      }

      // If active tab is favorites, filter the list client side using favorites IDs
      if (isFavoritesTab) {
        items = items.filter((item) => favorites.includes(item.id));
      }

      setCatalogItems(items);
    } catch (err: any) {
      showToast("Could not sync food catalog.", "error");
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [activeTab, catalogSearch, catalogCategory, catalogMaxPrice, catalogOnlyAvailable, favorites]);

  // Fetch admin items list
  const fetchAdminItems = async () => {
    try {
      const res = await api.getMenu({
        page: adminPage,
        limit: adminLimit,
        search: adminSearch,
        category: adminCategory === "all" ? undefined : adminCategory,
        minPrice: adminMinPrice,
        maxPrice: adminMaxPrice,
        isAvailable: adminOnlyAvailable === "all" ? undefined : adminOnlyAvailable === "true",
        sortBy: adminSortBy,
        sortOrder: adminSortOrder
      });
      setAdminItems(res.data);
      setAdminTotalItems(res.totalItems);
    } catch (e) {
      showToast("Error paging menu items.", "error");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAdminItems();
    }
  }, [currentUser, adminPage, adminLimit, adminSearch, adminCategory, adminOnlyAvailable, adminSortBy, adminSortOrder]);

  // Load dashboards and BI
  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const report = await api.getAnalytics();
      setAnalyticsData(report);
    } catch (e: any) {
      showToast("BI server query failed.", "error");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Load other listings
  const loadOffers = async () => {
    try {
      const res = await api.getOffers();
      setOffersList(res);
    } catch {}
  };

  const loadBanners = async () => {
    try {
      const res = await api.getBanners();
      setBannersList(res);
    } catch {}
  };

  const loadIngredients = async () => {
    try {
      const res = await api.getIngredients();
      setIngredientsList(res);
    } catch {}
  };

  const loadAuditLogs = async () => {
    try {
      const res = await api.getLogs();
      setAuditLogsList(res);
    } catch {}
  };

  useEffect(() => {
    if (currentUser) {
      if (adminTab === "dashboard") loadAnalytics();
      if (adminTab === "offers") loadOffers();
      if (adminTab === "banners") loadBanners();
      if (adminTab === "inventory") loadIngredients();
      if (adminTab === "logs" && currentUser.role === "Super Admin") loadAuditLogs();
    }
  }, [currentUser, adminTab]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr("");
    setLoginLoading(true);
    try {
      const res = await api.login(loginUser, loginPass);
      setCurrentUser(res.user);
      showToast(`Welcome back, ${res.user.firstName}! Session authorized.`);
      setLoginUser("");
      setLoginPass("");
    } catch (err: any) {
      setLoginErr(err.message || "Invalid credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setIsAdminPortalOpen(false);
    showToast("Session closed successfully.");
  };

  // --- Cart and Ordering Operations ---

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.menuItem.id === item.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prevCart, { menuItem: item, quantity }];
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((i) =>
        i.menuItem.id === itemId ? { ...i, quantity } : i
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.menuItem.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      showToast("Please provide your Name and Phone Number to place your order.", "error");
      return;
    }
    if (cart.length === 0) {
      showToast("Your shopping cart is empty.", "error");
      return;
    }

    setIsPlacingOrder(true);
    localStorage.setItem("wow_customer_name", customerName);
    localStorage.setItem("wow_customer_phone", customerPhone);

    const totalPrice = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const orderItemsPayload = cart.map((item) => ({
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
      price: item.menuItem.price
    }));

    try {
      const orderRes = await api.createOrder({
        customerName,
        phone: customerPhone,
        tableNumber: tableNumber || "Takeaway",
        items: orderItemsPayload,
        totalPrice,
        notes: orderNotes
      });

      setLastPlacedOrder(orderRes);
      clearCart();
      setOrderNotes("");
      showToast("🎉 Order placed successfully!");
      // Play high pitch beep chime
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } catch {}
    } catch (err: any) {
      showToast(err.message || "Failed to place order. Please try again.", "error");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Poll orders and updates for Admin and Customer live status updates
  const loadOrders = async () => {
    try {
      const res = await api.getOrders();
      setOrders(res);
      
      // If we got more orders than before, show notification for admins!
      if (lastOrdersCount > 0 && res.length > lastOrdersCount) {
        const hasPending = res.some((o: any) => o.status === "Pending" && !orders.some(existing => existing.id === o.id));
        if (hasPending) {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
          } catch {}
          showToast("🔔 Live Order Alert: New table order received!");
        }
      }
      setLastOrdersCount(res.length);

      // If customer has an active order, let's keep its status updated in real-time!
      if (lastPlacedOrder) {
        const currentOrder = res.find((o: any) => o.id === lastPlacedOrder.id);
        if (currentOrder && currentOrder.status !== lastPlacedOrder.status) {
          setLastPlacedOrder(currentOrder);
          showToast(`📣 Order Update: Your order is now "${currentOrder.status}"!`);
        }
      }
    } catch (e) {
      console.warn("Error polling orders:", e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: "Pending" | "Accepted" | "Preparing" | "Ready" | "Completed" | "Cancelled") => {
    try {
      await api.updateOrderStatus(orderId, status);
      showToast(`Order status updated to: ${status}`);
      await loadOrders();
    } catch (err: any) {
      showToast(err.message || "Could not update order status.", "error");
    }
  };

  useEffect(() => {
    // Poll every 5 seconds for orders (admins AND active customers)
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, [currentUser, lastPlacedOrder, lastOrdersCount]);

  // Trigger Details overlay (increments view count dynamically)
  const viewDetails = async (item: MenuItem) => {
    try {
      setModalQty(1);
      setSelectedItem(item);
      const res = await api.getMenuItem(item.id);
      setSelectedItem(res);
      setSelectedItemImages(res.images || []);
      
      const revs = await api.getReviews(item.id);
      setItemReviews(revs);
    } catch {
      showToast("Failed to fetch full item details.", "error");
    }
  };

  // Review Submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) {
      showToast("Reviewer name and comments are required.", "error");
      return;
    }
    setReviewLoading(true);
    try {
      await api.submitReview(selectedItem!.id, reviewAuthor, reviewRating, reviewComment);
      showToast("Thank you for your review! Rating updated.");
      setReviewAuthor("");
      setReviewComment("");
      
      // Reload reviews
      const revs = await api.getReviews(selectedItem!.id);
      setItemReviews(revs);
      
      // Re-sync detail item
      const itemDetail = await api.getMenuItem(selectedItem!.id);
      setSelectedItem(itemDetail);
      fetchCatalog(); // update ratings on main grid
    } catch (err: any) {
      showToast(err.message || "Review post failed.", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  // MenuItem Edit modal open
  const openEditMenuItem = async (item: MenuItem | null) => {
    setEditingItem(item);
    if (item) {
      setItemName(item.name);
      setItemPrice(String(item.price));
      setItemCat(item.category);
      setItemShortDesc(item.shortDescription);
      setItemFullDesc(item.fullDescription);
      setItemPrimaryImage(item.image);
      setItemIngredients(item.ingredients.join(", "));
      setItemAllergens(item.allergens.join(", "));
      setItemBadges(item.dietaryBadges);
      setItemCalories(String(item.calories));
      setItemAvailable(item.isAvailable);
      setItemIsPopular(item.isPopular);
      setItemIsNew(item.isNew);
      
      // Load all associated images
      try {
        const imgs = await api.getItemImages(item.id);
        setUploadedImages(imgs);
      } catch {
        setUploadedImages([]);
      }
    } else {
      setItemName("");
      setItemPrice("");
      setItemCat("burgers");
      setItemShortDesc("");
      setItemFullDesc("");
      setItemPrimaryImage("");
      setItemIngredients("");
      setItemAllergens("");
      setItemBadges([]);
      setItemCalories("500");
      setItemAvailable(true);
      setItemIsPopular(false);
      setItemIsNew(true);
      setUploadedImages([]);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsEditModalOpen(true);
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemPrice || !itemCat) {
      showToast("Name, category and price are required fields.", "error");
      return;
    }

    const payload = {
      name: itemName,
      price: parseFloat(itemPrice),
      category: itemCat,
      shortDescription: itemShortDesc,
      fullDescription: itemFullDesc,
      image: itemPrimaryImage || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      ingredients: itemIngredients.split(",").map(i => i.trim()).filter(Boolean),
      allergens: itemAllergens.split(",").map(a => a.trim()).filter(Boolean),
      dietaryBadges: itemBadges,
      calories: parseInt(itemCalories) || 500,
      isAvailable: itemAvailable,
      isPopular: itemIsPopular,
      isNew: itemIsNew
    };

    try {
      if (editingItem) {
        await api.updateMenuItem(editingItem.id, payload);
        showToast("Menu Item updated successfully.");
      } else {
        await api.createMenuItem(payload);
        showToast("New Menu Item added to catalog.");
      }
      setIsEditModalOpen(false);
      fetchAdminItems();
    } catch (err: any) {
      showToast(err.message || "Failed to save item.", "error");
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    // Only Super Admin & Manager can delete records
    if (currentUser?.role === "Employee") {
      showToast("Access Denied: Employees cannot delete system records.", "error");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this menu item? This will trigger cascades on images and reviews!")) {
      return;
    }
    try {
      await api.deleteMenuItem(id);
      showToast("Item and all nested dependencies purged.");
      fetchAdminItems();
    } catch (e: any) {
      showToast(e.message || "Purge failed.", "error");
    }
  };

  // --- Image Upload & Previews ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast("File is too large! Maximum limit is 5MB.", "error");
        return;
      }
      // Check type
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowed.includes(file.type)) {
        showToast("Unsupported file type. Please use JPG, PNG, or WEBP.", "error");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImageForMenuItem = async () => {
    if (!editingItem || !selectedFile) return;
    setUploadLoading(true);
    try {
      const isPrimary = uploadedImages.length === 0; // Make primary if first image
      const newImg = await api.uploadItemImage(editingItem.id, selectedFile, isPrimary);
      showToast("Secure image uploaded successfully.");
      
      // Update primary image on form if it was primary
      if (isPrimary) {
        setItemPrimaryImage(newImg.imagePath);
      }

      // Re-fetch images list
      const imgs = await api.getItemImages(editingItem.id);
      setUploadedImages(imgs);
      
      // Reset upload state
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (e: any) {
      showToast(e.message || "Upload failed.", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSetPrimaryImage = async (imgId: string) => {
    if (!editingItem) return;
    try {
      await api.setPrimaryImage(editingItem.id, imgId);
      showToast("Primary image updated successfully.");
      
      // Find the image and update display
      const primaryImg = uploadedImages.find(i => i.id === imgId);
      if (primaryImg) {
        setItemPrimaryImage(primaryImg.imagePath);
      }

      const imgs = await api.getItemImages(editingItem.id);
      setUploadedImages(imgs);
    } catch (e: any) {
      showToast(e.message || "Failed to set primary.", "error");
    }
  };

  const handleDeleteItemImage = async (imgId: string) => {
    if (!editingItem) return;
    if (uploadedImages.length <= 1) {
      showToast("Cannot delete the only image. Please upload a secondary first.", "error");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await api.deleteItemImage(editingItem.id, imgId);
      showToast("Image removed.");
      
      const imgs = await api.getItemImages(editingItem.id);
      setUploadedImages(imgs);
      
      // Set the first remaining as primary inside form display
      const newPrimary = imgs.find(i => i.isPrimary);
      if (newPrimary) {
        setItemPrimaryImage(newPrimary.imagePath);
      }
    } catch (e: any) {
      showToast(e.message || "Failed to delete.", "error");
    }
  };

  // --- Offers Controls ---
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: offerTitle,
      subtitle: offerSubtitle,
      promoCode: offerCode,
      discountPercent: parseInt(offerDiscount),
      validity: offerValidity,
      isActive: offerActive
    };
    try {
      if (editingOffer) {
        await api.updateOffer(editingOffer.id, payload);
        showToast("Special offer updated.");
      } else {
        await api.createOffer(payload);
        showToast("New special offer launched.");
      }
      setIsOfferModalOpen(false);
      loadOffers();
    } catch (e: any) {
      showToast(e.message || "Offer save failed.", "error");
    }
  };

  const handleDeleteOffer = async (id: number) => {
    if (!window.confirm("Delete this special offer?")) return;
    try {
      await api.deleteOffer(id);
      showToast("Offer removed.");
      loadOffers();
    } catch {}
  };

  // --- Banners Controls ---
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: bannerTitle,
      kicker: bannerKicker,
      imageUrl: bannerImage || "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
      ctaText: bannerCta,
      isLive: bannerLive
    };
    try {
      if (editingBanner) {
        await api.updateBanner(editingBanner.id, payload);
        showToast("Banner campaign updated.");
      } else {
        await api.createBanner(payload);
        showToast("Banner campaign created.");
      }
      setIsBannerModalOpen(false);
      loadBanners();
    } catch (e: any) {
      showToast(e.message || "Banner save failed.", "error");
    }
  };

  // --- Ingredients Controls ---
  const handleSaveIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createIngredient({
        name: ingName,
        quantity: parseInt(ingQty),
        minStock: parseInt(ingMin),
        unit: ingUnit,
        supplier: ingSupplier
      });
      showToast("Inventory item added.");
      setIsIngModalOpen(false);
      loadIngredients();
    } catch (e: any) {
      showToast(e.message || "Failed to add ingredient.", "error");
    }
  };

  const handleRestock = async (id: number, qty: number) => {
    try {
      await api.restockIngredient(id, qty);
      showToast(`Restocked ${qty} units successfully.`);
      loadIngredients();
    } catch {}
  };

  return (
    <div id="wow-app-container" className="min-h-screen font-sans flex flex-col bg-[#faf9f6] text-neutral-800 transition-colors duration-300 dark:bg-stone-950 dark:text-stone-100">
      
      {/* Dynamic Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl border text-sm font-semibold font-sans backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-500/90 text-white border-emerald-400"
                : "bg-red-500/90 text-white border-red-400"
            }`}
          >
            {toast.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corporate Header Nav */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-gray-100 dark:border-stone-850 px-4 py-4 md:px-8 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsAdminPortalOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-200 dark:shadow-none">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display tracking-tight text-neutral-900 dark:text-white leading-none">
                WOW BURGER
              </h1>
              {!isAdminPortalOpen && (
                tableNumber ? (
                  <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Table {tableNumber} Ordering
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      const tNum = window.prompt("Welcome to WOW BURGER! Please enter your Table Number to start digital ordering:", "1");
                      if (tNum) {
                        setTableNumber(tNum);
                        showToast(`Joined Table ${tNum}! Ready to order.`);
                      }
                    }}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-950/30 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/30 flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                  >
                    Select Table
                  </button>
                )
              )}
            </div>
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-1 block">Digital Menu Suite</span>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-xl transition-all text-gray-500 dark:text-gray-400 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-neutral-600" />}
          </button>

          {/* Admin Back-office trigger */}
          {!isAdminPortalOpen ? (
            currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAdminPortalOpen(true)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 hover:bg-red-100 dark:bg-stone-800 dark:text-stone-300 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <Settings className="w-4 h-4 animate-spin-slow" /> Control Deck
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 hover:bg-gray-100 dark:hover:bg-stone-800 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdminPortalOpen(true)}
                className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <UserIcon className="w-4 h-4" /> Sign In
              </button>
            )
          ) : (
            <button
              onClick={() => setIsAdminPortalOpen(false)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" /> Customer Menu
            </button>
          )}
        </div>
      </header>

      {/* RENDER VIEW CONTROLLER */}
      {!isAdminPortalOpen ? (
        /* ==================== CUSTOMER VIEW PORTAL ==================== */
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-8 pb-32 md:pb-36 md:px-8 space-y-8 animate-fade-in" id="customer-view-root">
          {activeTab === "cart" ? (
            /* ==================== CUSTOMER DEDICATED CART / CHECKOUT VIEW ==================== */
            <div className="space-y-8 animate-fade-in font-sans">
              <div className="border-b border-gray-100 dark:border-stone-850 pb-5">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                  <ShoppingBag className="w-8 h-8 text-red-600" /> Your Order & Checkout
                </h2>
                <p className="text-sm text-gray-500 mt-1">Review your table items, customize notes, and place your order instantly.</p>
              </div>

              {/* ACTIVE ORDER TRACKING (If user has already placed an order) */}
              {lastPlacedOrder && (
                <div className="bg-red-50/20 dark:bg-stone-900/40 border border-red-100 dark:border-stone-850 p-6 rounded-[2rem] space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30 inline-flex items-center gap-1.5 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Active Order Tracking
                      </span>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white mt-2">
                        {lastPlacedOrder.tableNumber && lastPlacedOrder.tableNumber !== "Takeaway" ? `Table ${lastPlacedOrder.tableNumber}` : "Takeaway Order"} • #{lastPlacedOrder.id.slice(-8)}
                      </h3>
                      <p className="text-xs text-gray-400 font-mono mt-1">Placed at {new Date(lastPlacedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          showToast("🛎️ Waitstaff summoned! A server will be at your table shortly.");
                          try {
                            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.frequency.setValueAtTime(659.25, ctx.currentTime);
                            gain.gain.setValueAtTime(0.05, ctx.currentTime);
                            osc.start();
                            osc.stop(ctx.currentTime + 0.15);
                          } catch {}
                        }}
                        className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        🛎️ Summon Server
                      </button>
                      <button
                        type="button"
                        onClick={() => setLastPlacedOrder(null)}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-gray-700 dark:text-gray-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        Dismiss Tracker
                      </button>
                    </div>
                  </div>

                  {/* Aesthetic Stepper Bar */}
                  <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono font-bold text-gray-400 py-4 relative">
                    {/* Stepper progress background line */}
                    <div className="absolute top-[26px] left-[10%] right-[10%] h-1 bg-gray-200 dark:bg-stone-800 -z-10 rounded-full"></div>
                    <div
                      className="absolute top-[26px] left-[10%] h-1 bg-red-600 rounded-full -z-10 transition-all duration-1000"
                      style={{
                        width: 
                          lastPlacedOrder.status === "Pending" ? "0%" :
                          lastPlacedOrder.status === "Accepted" ? "25%" :
                          lastPlacedOrder.status === "Preparing" ? "50%" :
                          lastPlacedOrder.status === "Ready" ? "75%" : "100%"
                      }}
                    ></div>

                    {[
                      { status: "Pending", label: "📋 Submitted" },
                      { status: "Accepted", label: "👍 Accepted" },
                      { status: "Preparing", label: "🔥 In Kitchen" },
                      { status: "Ready", label: "🛎️ Ready!" },
                      { status: "Completed", label: "✅ Served" }
                    ].map((step, idx) => {
                      const isReached = 
                        (step.status === "Pending" && ["Pending", "Accepted", "Preparing", "Ready", "Completed"].includes(lastPlacedOrder.status)) ||
                        (step.status === "Accepted" && ["Accepted", "Preparing", "Ready", "Completed"].includes(lastPlacedOrder.status)) ||
                        (step.status === "Preparing" && ["Preparing", "Ready", "Completed"].includes(lastPlacedOrder.status)) ||
                        (step.status === "Ready" && ["Ready", "Completed"].includes(lastPlacedOrder.status)) ||
                        (step.status === "Completed" && lastPlacedOrder.status === "Completed");

                      const isActive = lastPlacedOrder.status === step.status;

                      return (
                        <div key={idx} className="flex flex-col items-center space-y-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            isActive ? "border-red-600 bg-white dark:bg-stone-900 text-red-600 scale-110 shadow-md ring-4 ring-red-100 dark:ring-red-900/20" :
                            isReached ? "border-red-600 bg-red-600 text-white font-bold" :
                            "border-gray-300 bg-gray-50 dark:border-stone-800 dark:bg-stone-850 text-gray-400"
                          }`}>
                            <span>{idx + 1}</span>
                          </div>
                          <span className={`text-[9px] uppercase tracking-wider ${isActive ? "text-red-600 font-extrabold" : isReached ? "text-gray-700 dark:text-gray-300" : "text-gray-400"}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Info Status block */}
                  <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-gray-100 dark:border-stone-800 text-xs text-gray-600 dark:text-gray-400 space-y-2">
                    <p className="font-bold text-gray-900 dark:text-white">
                      💡 Status update: {
                        lastPlacedOrder.status === "Pending" ? "We have received your order! A waiter will confirm it shortly." :
                        lastPlacedOrder.status === "Accepted" ? "Your order is confirmed! The kitchen is getting ready to prepare your meal." :
                        lastPlacedOrder.status === "Preparing" ? "Our specialty chefs are flame-grilling your burgers now! Get ready for maximum flavor." :
                        lastPlacedOrder.status === "Ready" ? "Your order is ready to be served! Our waitstaff is bringing it to your table right now." :
                        lastPlacedOrder.status === "Completed" ? "This order has been fully completed and paid. Thank you for dining with WOW BURGER!" :
                        "This order has been cancelled by the back-office staff. Please consult a server if this was done in error."
                      }
                    </p>
                    <p className="text-[11px] font-mono text-gray-400">If you want to add additional dishes, simply add them to your cart and place another order. It will be seamlessly delivered to your table as well.</p>
                  </div>
                </div>
              )}

              {/* TWO COLUMN GRID FOR BROWSED BASKET & CHECKOUT FORM */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT SIDE: CART ITEMS BASKET LIST */}
                <div className="lg:col-span-7 space-y-6">
                  {cart.length === 0 ? (
                    <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-850 rounded-[2rem] p-12 text-center space-y-4">
                      <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto animate-bounce" />
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Ordering Cart is Empty</h3>
                        <p className="text-sm text-gray-500 font-sans">You haven't added any premium burger items to your cart yet.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setActiveTab("home"); setCatalogCategory("all"); }}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer inline-block"
                      >
                        Browse Specialty Menu
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-850 rounded-[2rem] p-6 md:p-8 space-y-6">
                      <h3 className="font-black text-lg text-gray-900 dark:text-white">Items in Basket</h3>

                      <div className="divide-y divide-gray-100 dark:divide-stone-850">
                        {cart.map((item) => (
                          <div key={item.menuItem.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                            {/* Thumbnail image */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-stone-800 shrink-0 border border-gray-100 dark:border-stone-800">
                              <img
                                src={item.menuItem.image}
                                alt={item.menuItem.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.menuItem.name}</h4>
                                <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">{item.menuItem.price * item.quantity} ETB</span>
                              </div>
                              <p className="text-[11px] text-gray-400 font-sans line-clamp-1">{item.menuItem.shortDescription}</p>

                              {/* Controls */}
                              <div className="flex justify-between items-center pt-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                                    className="p-1 border border-gray-200 dark:border-stone-800 rounded-md hover:bg-gray-50 dark:hover:bg-stone-800 cursor-pointer text-gray-500"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="font-mono text-xs font-bold w-6 text-center text-gray-800 dark:text-white">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                                    className="p-1 border border-gray-200 dark:border-stone-800 rounded-md hover:bg-gray-50 dark:hover:bg-stone-800 cursor-pointer text-gray-500"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.menuItem.id)}
                                  className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Notes input */}
                      <div className="border-t border-gray-100 dark:border-stone-850 pt-5 space-y-2">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">Kitchen & Waiter Instructions</label>
                        <textarea
                          rows={2}
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="e.g., no onions, extra burger sauce, well done patty, bring cold soft drink..."
                          className="w-full text-xs p-3 bg-gray-50 dark:bg-stone-850/30 border border-gray-200 dark:border-stone-800 rounded-xl outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-800 dark:text-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT SIDE: CUSTOMER DETAILS & ORDER SUBMISSION */}
                {cart.length > 0 && (
                  <div className="lg:col-span-5 space-y-6">
                    <form onSubmit={handlePlaceOrder} className="bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-850 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-xs">
                      <h3 className="font-black text-lg text-gray-900 dark:text-white">Checkout Details</h3>

                      {/* Table Selection / Details */}
                      <div className="p-4 bg-red-50/10 dark:bg-stone-850/40 rounded-2xl border border-red-100/30 dark:border-stone-800 space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Current Assigned Table</span>
                          <span className="bg-red-600 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase">
                            {tableNumber ? `Table ${tableNumber}` : "Not Selected"}
                          </span>
                        </div>
                        
                        {!tableNumber ? (
                          <div className="space-y-2 pt-1">
                            <p className="text-amber-600 dark:text-amber-400 text-[11px] font-sans font-medium">⚠️ Table number is required to route your order successfully.</p>
                            <select
                              required
                              value={tableNumber || ""}
                              onChange={(e) => setTableNumber(e.target.value)}
                              className="w-full text-xs px-3 py-2.5 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-800 dark:text-white font-bold"
                            >
                              <option value="">-- Choose Your Table Number --</option>
                              {Array.from({ length: 20 }, (_, i) => String(i + 1)).map(num => (
                                <option key={num} value={num}>Dining Table {num}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center text-[11px] text-gray-400 font-sans border-t border-gray-100 dark:border-stone-800 pt-2">
                            <span>Change table number if scanned wrong table:</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newTable = window.prompt("Change Table Number:", tableNumber);
                                if (newTable) setTableNumber(newTable);
                              }}
                              className="text-red-600 dark:text-red-400 font-bold hover:underline"
                            >
                              Change Table
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-1.5">Your Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Almaz Tesfaye"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 dark:border-stone-800 focus:border-red-500 rounded-xl outline-hidden focus:ring-1 focus:ring-red-500 text-gray-800 dark:text-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-1.5">Mobile Phone Number</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g., 0911223344"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 dark:border-stone-800 focus:border-red-500 rounded-xl outline-hidden focus:ring-1 focus:ring-red-500 text-gray-800 dark:text-white font-mono font-medium"
                          />
                        </div>
                      </div>

                      {/* Bill Breakdown */}
                      <div className="border-t border-gray-100 dark:border-stone-850 pt-5 text-xs space-y-2.5 text-gray-500">
                        <div className="flex justify-between">
                          <span>Subtotal Items</span>
                          <span className="font-mono text-gray-900 dark:text-white">
                            {cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)} ETB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service Charge (5%)</span>
                          <span className="font-mono text-gray-900 dark:text-white">
                            {Math.round(cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0) * 0.05)} ETB
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-100 dark:border-stone-850 pt-3 text-sm text-gray-900 dark:text-white font-bold">
                          <span>Total Amount Due</span>
                          <span className="font-mono text-red-600 dark:text-red-500 text-base">
                            {Math.round(cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0) * 1.05)} ETB
                          </span>
                        </div>
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isPlacingOrder}
                        className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                      >
                        {isPlacingOrder ? "Placing Your Order..." : "🚀 Send Order to Kitchen"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Aesthetic Hero Banner Campaign */}
          <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white p-8 md:p-14 h-96 flex items-center shadow-xl border border-transparent dark:border-stone-800">
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80"
              alt="Crispy gourmet bacon cheeseburger"
              className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
            <div className="relative max-w-xl space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFC107] bg-[#FFC107]/15 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
                🔥 Hot & Sizzling Now
              </span>
              <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight">
                Addis Ababa's Legendary Gourmet Burgers.
              </h2>
              <p className="text-sm md:text-base text-gray-200 max-w-md font-sans leading-relaxed">
                Flame-grilled grass-fed premium beef patties, aged Colby Jack cheese, and signature slow-simmered house WOW sauce on toasted buttery brioche.
              </p>
              <button
                onClick={() => {
                  setActiveTab("food");
                  document.getElementById("menu-grid-anchor")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-2xl shadow-lg hover:shadow-red-500/25 transition-all cursor-pointer"
              >
                Explore Sizzling Menu
              </button>
            </div>
          </div>

          {/* Category Tabs Navigation */}
          <div className="flex flex-col gap-5" id="menu-grid-anchor">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-stone-900 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {activeTab === "home" ? <ShoppingBag className="w-5 h-5 text-red-500" /> : activeTab === "favorites" ? <Heart className="w-5 h-5 text-red-500 fill-red-500" /> : null}
                {activeTab === "home" ? "Full Specialty Catalog" : activeTab === "food" ? "Gourmet Food Specialties" : activeTab === "drinks" ? "Craft Beverage Collection" : "Saved Favorites"}
              </h3>
              <span className="text-xs text-gray-400 font-mono">Matched items: {catalogItems.length}</span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2">
              <button
                onClick={() => { setActiveTab("home"); setCatalogCategory("all"); }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shrink-0 ${
                  activeTab === "home" && catalogCategory === "all"
                    ? "bg-red-600 text-white shadow-md shadow-red-100 dark:shadow-none"
                    : "bg-white hover:bg-gray-100 text-neutral-600 dark:bg-stone-900 dark:text-gray-300 dark:hover:bg-stone-850"
                }`}
              >
                <span>🌍 All Specialties</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === "burgers" || cat.id === "sides") {
                      setActiveTab("food");
                      setCatalogCategory(cat.id);
                    } else if (cat.id === "drinks") {
                      setActiveTab("drinks");
                      setCatalogCategory("drinks");
                    } else {
                      setActiveTab("home");
                      setCatalogCategory("desserts");
                    }
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shrink-0 ${
                    (activeTab === "food" && catalogCategory === cat.id) ||
                    (activeTab === "drinks" && cat.id === "drinks" && catalogCategory === "drinks") ||
                    (activeTab === "home" && cat.id === "desserts" && catalogCategory === "desserts")
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white hover:bg-gray-100 text-neutral-600 dark:bg-stone-900 dark:text-gray-300 dark:hover:bg-stone-850"
                  }`}
                >
                  <span>{cat.icon} {cat.title}</span>
                </button>
              ))}
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shrink-0 ${
                  activeTab === "favorites"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-white hover:bg-gray-100 text-neutral-600 dark:bg-stone-900 dark:text-gray-300 dark:hover:bg-stone-850"
                }`}
              >
                <span>❤️ My Favorites</span>
              </button>
            </div>
          </div>

          {/* Live Advanced Filters & Search */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-gray-100 dark:border-stone-850 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Client Search */}
              <div className="relative w-full md:max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Real-time search item names, category, or ingredients..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                />
              </div>

              {/* Price filter slider */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <span className="text-xs text-gray-400 font-mono shrink-0 uppercase">Max Price: {catalogMaxPrice} ETB</span>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={catalogMaxPrice}
                  onChange={(e) => setCatalogMaxPrice(parseInt(e.target.value))}
                  className="w-full md:w-48 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              {/* Availability check */}
              <label className="flex items-center gap-2 self-start md:self-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={catalogOnlyAvailable}
                  onChange={(e) => setCatalogOnlyAvailable(e.target.checked)}
                  className="w-4.5 h-4.5 rounded text-red-600 border-neutral-300 focus:ring-red-500 cursor-pointer"
                />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">In Stock / Available Only</span>
              </label>
            </div>
          </div>

          {/* Interactive Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalogItems.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-gray-50 dark:bg-stone-900 text-gray-400 rounded-full mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">No items found</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-sm font-sans leading-relaxed">
                  We couldn't match any items. Try altering your price slider range, categories, or search term.
                </p>
              </div>
            ) : (
              catalogItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => viewDetails(item)}
                  className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-stone-850 hover:border-red-100 dark:hover:border-stone-800 hover:shadow-lg transition-all flex flex-col group cursor-pointer"
                >
                  {/* Item Image & Badges */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Popular / New Tags */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {item.isPopular && (
                        <span className="bg-amber-500 text-neutral-900 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-neutral-900" /> Popular
                        </span>
                      )}
                      {item.isNew && (
                        <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Favorite Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (favorites.includes(item.id)) {
                          setFavorites(favorites.filter((id) => id !== item.id));
                          showToast("Removed from My Favorites.");
                        } else {
                          setFavorites([...favorites, item.id]);
                          showToast("Added to My Favorites!");
                        }
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <Heart className={`w-4.5 h-4.5 ${favorites.includes(item.id) ? "text-red-600 fill-red-600 animate-pulse" : ""}`} />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors text-base line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-sm font-black text-red-600 shrink-0 font-mono">
                          {item.price} ETB
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {item.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 dark:border-stone-850 pt-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{item.rating}</span>
                        <span className="text-[10px] text-gray-400 font-mono">({item.reviewsCount})</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                          item.isAvailable ? "text-emerald-600" : "text-red-400"
                        }`}>
                          {item.isAvailable ? "● In Stock" : "● Sold Out"}
                        </span>
                        {item.isAvailable && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item, 1);
                              showToast(`Added ${item.name} to cart!`);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95 shadow-sm"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
            </>
          )}
        </main>
      ) : (
        /* ==================== SECURED ADMIN BACK-OFFICE ==================== */
        <div className="flex-1 flex flex-col md:flex-row min-h-[85vh] bg-[#fdfdfd] dark:bg-stone-950 transition-colors duration-300" id="admin-view-root">
          {!currentUser ? (
            /* Admin Sign In form */
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-xl border border-gray-100 dark:border-stone-850 p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black font-display text-gray-900 dark:text-white tracking-tight">Access Control Deck</h2>
                  <p className="text-xs text-gray-400 font-sans max-w-xs mx-auto">
                    Sign in with corporate credentials to manage menus, track view analytics and update settings.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-sm font-sans">
                  {loginErr && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600 flex items-center gap-2">
                      <XCircle className="w-4.5 h-4.5" /> {loginErr}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-gray-400 mb-1.5">Username</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. superadmin"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      className="w-full p-3 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-gray-400 mb-1.5">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      className="w-full p-3 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    {loginLoading ? "Authorizing Security..." : "Secure Sign In"}
                  </button>
                </form>

                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100 text-[10px] text-amber-800 font-mono leading-relaxed">
                  <p className="font-bold">🔑 System Default Accounts:</p>
                  <p className="mt-1">Username: <span className="font-black bg-white/75 px-1 rounded-sm">superadmin</span> | Pass: <span className="font-black bg-white/75 px-1 rounded-sm">admin123</span></p>
                  <p className="mt-0.5">Username: <span className="font-black bg-white/75 px-1 rounded-sm">menumanager</span> | Pass: <span className="font-black bg-white/75 px-1 rounded-sm">admin123</span></p>
                </div>
              </div>
            </div>
          ) : (
            /* Active Admin Dashboard Dashboard Frame */
            <>
              {/* Backoffice Left Sidebar */}
              <aside className="w-full md:w-64 bg-gray-50 dark:bg-stone-900 border-r border-gray-100 dark:border-stone-850 p-6 flex flex-col justify-between gap-6">
                <div className="space-y-6">
                  {/* Current Active User Profile */}
                  <div className="flex items-center gap-3 bg-white dark:bg-stone-850 p-4 rounded-2xl border border-gray-100 dark:border-stone-800 shadow-xs">
                    <img
                      src={currentUser.avatar}
                      alt="Admin avatar"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white leading-tight">{currentUser.firstName}</p>
                      <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1 mt-0.5 uppercase">
                        <Shield className="w-3 h-3 text-red-500" /> {currentUser.role}
                      </span>
                    </div>
                  </div>

                  {/* Sidebar Nav links */}
                  <nav className="flex flex-col gap-1.5 font-sans text-xs uppercase font-bold tracking-wider">
                    {/* BI Dashboard */}
                    <button
                      onClick={() => setAdminTab("dashboard")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                        adminTab === "dashboard"
                          ? "bg-red-600 text-white"
                          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-stone-800"
                      }`}
                    >
                      <Eye className="w-4 h-4" /> BI Analytics Report
                    </button>

                    {/* Menu Items Page */}
                    <button
                      onClick={() => setAdminTab("menu")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                        adminTab === "menu"
                          ? "bg-red-600 text-white"
                          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-stone-800"
                      }`}
                    >
                      <MenuIcon className="w-4 h-4" /> Menu Items Manager
                    </button>

                    {/* Employee CRUD (only visible to Super Admin) */}
                    {currentUser.role === "Super Admin" && (
                      <button
                        onClick={() => setAdminTab("employees")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                          adminTab === "employees"
                            ? "bg-red-600 text-white"
                            : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-stone-800"
                        }`}
                      >
                        <Users className="w-4 h-4" /> Employee Directory
                      </button>
                    )}

                    {/* Active special Offers */}
                    <button
                      onClick={() => setAdminTab("offers")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                        adminTab === "offers"
                          ? "bg-red-600 text-white"
                          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-stone-800"
                      }`}
                    >
                      <Percent className="w-4 h-4" /> Promo Discount Offers
                    </button>

                    {/* Landing campaigns Banners */}
                    <button
                      onClick={() => setAdminTab("banners")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                        adminTab === "banners"
                          ? "bg-red-600 text-white"
                          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-stone-800"
                      }`}
                    >
                      <Plus className="w-4 h-4" /> Landing Campaigns
                    </button>

                    {/* Ingredients levels */}
                    <button
                      onClick={() => setAdminTab("inventory")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                        adminTab === "inventory"
                          ? "bg-red-600 text-white"
                          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-stone-800"
                      }`}
                    >
                      <Package className="w-4 h-4" /> Stock Inventory
                    </button>

                    {/* Audit logs (Super Admin only) */}
                    {currentUser.role === "Super Admin" && (
                      <button
                        onClick={() => setAdminTab("logs")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                          adminTab === "logs"
                            ? "bg-red-600 text-white"
                            : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-stone-800"
                        }`}
                      >
                        <History className="w-4 h-4" /> Security Audit logs
                      </button>
                    )}

                    {/* Live Order Monitor */}
                    <button
                      onClick={() => setAdminTab("orders")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer relative ${
                        adminTab === "orders"
                          ? "bg-red-600 text-white"
                          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-stone-800"
                      }`}
                    >
                      <ClipboardList className="w-4 h-4" /> Live Order Monitor
                      {orders.filter((o: any) => o.status === "Pending").length > 0 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-amber-500 text-neutral-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                          {orders.filter((o: any) => o.status === "Pending").length}
                        </span>
                      )}
                    </button>

                    {/* QR Code Table Generator */}
                    <button
                      onClick={() => setAdminTab("qrcodes")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                        adminTab === "qrcodes"
                          ? "bg-red-600 text-white"
                          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-stone-800"
                      }`}
                    >
                      <QrCode className="w-4 h-4" /> QR Table Generator
                    </button>

                    {/* Security Passwords change */}
                    <button
                      onClick={() => setAdminTab("security")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                        adminTab === "security"
                          ? "bg-red-600 text-white"
                          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-stone-800"
                      }`}
                    >
                      <Settings className="w-4 h-4" /> Access & Security
                    </button>
                  </nav>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-stone-800 dark:hover:bg-stone-850 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Exit Session
                </button>
              </aside>

              {/* Backoffice Main Display Panels */}
              <section className="flex-1 p-6 md:p-10 bg-white dark:bg-stone-900 transition-colors duration-300 overflow-y-auto">
                {adminTab === "dashboard" && analyticsData && (
                  <AnalyticsDashboard data={analyticsData} onRefresh={loadAnalytics} loading={analyticsLoading} />
                )}

                {/* MENU MANAGEMENT TAB */}
                {adminTab === "menu" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Specialty Menu Control System</h2>
                        <p className="text-sm text-gray-500 font-sans mt-1">Manage food lists, catalog parameters, and multiple photo carousel files.</p>
                      </div>
                      <button
                        onClick={() => openEditMenuItem(null)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Create Menu Item
                      </button>
                    </div>

                    {/* Search, Sorting and Advanced Filters for Admin List */}
                    <div className="bg-gray-50 dark:bg-stone-850 p-5 rounded-3xl border border-gray-100 dark:border-stone-800 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Keyword Search */}
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search name, description..."
                            value={adminSearch}
                            onChange={(e) => { setAdminSearch(e.target.value); setAdminPage(1); }}
                            className="w-full text-xs pl-9 pr-3 py-2 bg-white rounded-lg border border-transparent focus:border-red-500 outline-hidden text-gray-800 font-sans"
                          />
                        </div>

                        {/* Category Dropdown Filter */}
                        <select
                          value={adminCategory}
                          onChange={(e) => { setAdminCategory(e.target.value); setAdminPage(1); }}
                          className="w-full p-2 bg-white rounded-lg text-xs font-semibold outline-hidden border border-transparent focus:border-red-500 text-gray-700 font-sans"
                        >
                          <option value="all">Category: All</option>
                          <option value="burgers">Burgers</option>
                          <option value="sides">Sides</option>
                          <option value="drinks">Drinks</option>
                          <option value="desserts">Desserts</option>
                        </select>

                        {/* Availability Dropdown Filter */}
                        <select
                          value={adminOnlyAvailable}
                          onChange={(e) => { setAdminOnlyAvailable(e.target.value as any); setAdminPage(1); }}
                          className="w-full p-2 bg-white rounded-lg text-xs font-semibold outline-hidden border border-transparent focus:border-red-500 text-gray-700 font-sans"
                        >
                          <option value="all">Availability: All</option>
                          <option value="true">In Stock</option>
                          <option value="false">Out of Stock</option>
                        </select>

                        {/* Advanced Sorting Options */}
                        <select
                          value={`${adminSortBy}-${adminSortOrder}`}
                          onChange={(e) => {
                            const [by, order] = e.target.value.split("-");
                            setAdminSortBy(by);
                            setAdminSortOrder(order as any);
                            setAdminPage(1);
                          }}
                          className="w-full p-2 bg-white rounded-lg text-xs font-semibold outline-hidden border border-transparent focus:border-red-500 text-gray-700 font-sans"
                        >
                          <option value="dateAdded-desc">Newest Added</option>
                          <option value="dateAdded-asc">Oldest Added</option>
                          <option value="name-asc">Name: A ➔ Z</option>
                          <option value="name-desc">Name: Z ➔ A</option>
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                          <option value="viewCount-desc">Most Viewed</option>
                        </select>
                      </div>
                    </div>

                    {/* Server-side Paginated Table View */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400 font-mono uppercase tracking-wider">
                              <th className="py-4 px-6">Specialty Item</th>
                              <th className="py-4 px-6">Category</th>
                              <th className="py-4 px-6">Price</th>
                              <th className="py-4 px-6">Analytics Views</th>
                              <th className="py-4 px-6">Stock Availability</th>
                              <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm font-sans text-gray-800">
                            {adminItems.map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <img src={item.image} alt="" className="w-10 h-10 rounded-xl object-cover shadow-xs border border-gray-100" />
                                    <div>
                                      <p className="font-semibold text-gray-900 leading-tight">{item.name}</p>
                                      <span className="text-[10px] text-gray-400 font-mono">Calories: {item.calories} kcal</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-xs font-mono uppercase font-bold text-gray-500">{item.category}</td>
                                <td className="py-4 px-6 font-bold font-mono text-red-600">{item.price} ETB</td>
                                <td className="py-4 px-6 font-semibold font-mono text-gray-600">
                                  <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {item.viewCount} views</span>
                                </td>
                                <td className="py-4 px-6">
                                  <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md font-mono ${
                                    item.isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-400"
                                  }`}>
                                    {item.isAvailable ? "In Stock" : "Sold Out"}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => openEditMenuItem(item)}
                                      className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-blue-600 rounded-lg cursor-pointer transition-colors"
                                      title="Edit details & images"
                                    >
                                      <Settings className="w-4 h-4 animate-spin-hover" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMenuItem(item.id)}
                                      className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                                      title="Purge record"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination UI Controls */}
                      <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-100 gap-4 text-xs font-mono text-gray-500">
                        {/* Info details */}
                        <div>
                          Showing page <span className="font-bold text-gray-800">{adminPage}</span> of <span className="font-bold text-gray-800">{Math.ceil(adminTotalItems / adminLimit) || 1}</span> (Total item matching: <span className="font-bold text-gray-800">{adminTotalItems}</span>)
                        </div>

                        {/* Page sizes */}
                        <div className="flex items-center gap-2">
                          <span>Page size:</span>
                          <select
                            value={adminLimit}
                            onChange={(e) => { setAdminLimit(parseInt(e.target.value)); setAdminPage(1); }}
                            className="p-1.5 bg-white rounded-md border text-xs font-bold font-mono outline-hidden text-gray-700"
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                        </div>

                        {/* Prev / Next triggers */}
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setAdminPage(prev => Math.max(1, prev - 1))}
                            disabled={adminPage === 1}
                            className="p-1.5 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                            title="Previous Page"
                          >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => setAdminPage(prev => Math.min(Math.ceil(adminTotalItems / adminLimit), prev + 1))}
                            disabled={adminPage >= Math.ceil(adminTotalItems / adminLimit)}
                            className="p-1.5 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                            title="Next Page"
                          >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub components calling */}
                {adminTab === "employees" && currentUser.role === "Super Admin" && (
                  <EmployeeManagement onNotify={showToast} />
                )}

                {/* OFFERS CAMPAIGNS TAB */}
                {adminTab === "offers" && (
                  <div className="space-y-6 animate-fade-in text-sm text-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Active Promotional Offers</h2>
                        <p className="text-sm text-gray-500 font-sans mt-1">Configure active customer coupons, discount rates, and validity periods.</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingOffer(null);
                          setOfferTitle("");
                          setOfferSubtitle("");
                          setOfferCode("");
                          setOfferDiscount("15");
                          setOfferValidity("");
                          setOfferActive(true);
                          setIsOfferModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add Special Offer
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {offersList.map((off) => (
                        <div key={off.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between relative overflow-hidden">
                          <div className="space-y-2">
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold font-mono px-2.5 py-1 rounded-md uppercase">
                              Promo Code: {off.promoCode}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 mt-1">{off.title}</h3>
                            <p className="text-xs text-gray-500 font-sans leading-relaxed">{off.subtitle}</p>
                            <div className="flex gap-4 text-xs font-mono pt-2 text-gray-400">
                              <span>Validity: {off.validity}</span>
                              <span className={off.isActive ? "text-emerald-600" : "text-red-400"}>
                                {off.isActive ? "● Active" : "● Paused"}
                              </span>
                            </div>
                          </div>
                          <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
                            <span className="text-3xl font-black text-red-600 font-mono">{off.discountPercent}% OFF</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingOffer(off);
                                  setOfferTitle(off.title);
                                  setOfferSubtitle(off.subtitle);
                                  setOfferCode(off.promoCode);
                                  setOfferDiscount(String(off.discountPercent));
                                  setOfferValidity(off.validity);
                                  setOfferActive(off.isActive);
                                  setIsOfferModalOpen(true);
                                }}
                                className="text-xs font-semibold hover:text-blue-600 font-mono cursor-pointer"
                              >
                                Edit Offer
                              </button>
                              <span className="text-gray-300">|</span>
                              <button onClick={() => handleDeleteOffer(off.id)} className="text-xs font-semibold hover:text-red-500 font-mono text-red-400 cursor-pointer">
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* BANNERS TAB */}
                {adminTab === "banners" && (
                  <div className="space-y-6 animate-fade-in text-sm text-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Active Landing Campaigns</h2>
                        <p className="text-sm text-gray-500 font-sans mt-1">Design landing showcase highlights, text prompts, and cover images.</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingBanner(null);
                          setBannerTitle("");
                          setBannerKicker("");
                          setBannerImage("");
                          setBannerCta("");
                          setBannerLive(true);
                          setIsBannerModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Launch Campaign
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {bannersList.map((ban) => (
                        <div key={ban.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs flex flex-col justify-between relative">
                          <div className="h-44 bg-gray-100 relative">
                            <img src={ban.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <span className="absolute top-4 left-4 bg-black/60 text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-xs font-bold">
                              {ban.kicker}
                            </span>
                          </div>
                          <div className="p-6 space-y-4">
                            <h3 className="text-base font-bold text-gray-900">{ban.title}</h3>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                              <span className="text-xs font-mono font-semibold text-gray-400">CTA: "{ban.ctaText}"</span>
                              <span className={`text-xs font-bold font-mono ${ban.isLive ? "text-emerald-600" : "text-gray-400"}`}>
                                {ban.isLive ? "● Online" : "● Offline"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* INVENTORY TAB */}
                {adminTab === "inventory" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Food Ingredient Inventory</h2>
                        <p className="text-sm text-gray-500 font-sans mt-1">Track system ingredients levels, suppliers, units, and minimum safety thresholds.</p>
                      </div>
                      <button
                        onClick={() => {
                          setIngName("");
                          setIngQty("100");
                          setIngMin("30");
                          setIngUnit("pcs");
                          setIngSupplier("");
                          setIsIngModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add Ingredient
                      </button>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400 font-mono uppercase tracking-wider">
                              <th className="py-4 px-6">Ingredient</th>
                              <th className="py-4 px-6">Volume Level</th>
                              <th className="py-4 px-6">Min Threshold</th>
                              <th className="py-4 px-6">Assigned Supplier</th>
                              <th className="py-4 px-6">Status</th>
                              <th className="py-4 px-6 text-right">Quick Restock</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm font-sans text-gray-800">
                            {ingredientsList.map((ing) => (
                              <tr key={ing.id} className="hover:bg-gray-50/40 transition-colors">
                                <td className="py-4 px-6 font-bold text-gray-950">{ing.name}</td>
                                <td className="py-4 px-6 font-mono font-semibold">{ing.quantity} {ing.unit}</td>
                                <td className="py-4 px-6 font-mono text-gray-400">{ing.minStock} {ing.unit}</td>
                                <td className="py-4 px-6 text-xs text-gray-500 font-medium">{ing.supplier}</td>
                                <td className="py-4 px-6">
                                  <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md font-mono ${
                                    ing.status === "Good"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : ing.status === "Low Stock"
                                      ? "bg-amber-50 text-amber-600"
                                      : "bg-red-50 text-red-500"
                                  }`}>
                                    {ing.status}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end gap-1.5 font-mono text-xs">
                                    <button
                                      onClick={() => handleRestock(ing.id, 10)}
                                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-md transition-colors font-bold cursor-pointer"
                                    >
                                      +10
                                    </button>
                                    <button
                                      onClick={() => handleRestock(ing.id, 50)}
                                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-md transition-colors font-bold cursor-pointer"
                                    >
                                      +50
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

                {/* SECURITY AUDIT LOGS TAB (Super Admin only) */}
                {adminTab === "logs" && currentUser.role === "Super Admin" && (
                  <div className="space-y-6 animate-fade-in text-sm text-gray-800">
                    <div className="border-b border-gray-100 pb-5">
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Security Audit Logs & Sessions</h2>
                      <p className="text-sm text-gray-500 font-sans mt-1">Chronological list of administrative logins, edits, and status changes.</p>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400 font-mono uppercase tracking-wider">
                              <th className="py-4 px-6">Timestamp</th>
                              <th className="py-4 px-6">Admin Username</th>
                              <th className="py-4 px-6">Action Performed</th>
                              <th className="py-4 px-6">Client Host IP</th>
                              <th className="py-4 px-6 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-xs font-mono text-gray-700">
                            {auditLogsList.map((log) => (
                              <tr key={log.id} className="hover:bg-gray-50/40 transition-colors">
                                <td className="py-4 px-6 text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="py-4 px-6 font-bold text-gray-950">@{log.username}</td>
                                <td className="py-4 px-6 text-gray-600 font-sans font-medium">{log.action}</td>
                                <td className="py-4 px-6 text-gray-500">{log.ip}</td>
                                <td className="py-4 px-6 text-right">
                                  <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    log.status === "Success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                                  }`}>
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

                {/* ACCESS & SECURITY (PASSWORD CHANGE) TAB */}
                {adminTab === "security" && (
                  <PasswordChange onSuccessLogout={handleLogout} onNotify={showToast} />
                )}

                {/* LIVE ORDER MONITOR TAB */}
                {adminTab === "orders" && (
                  <div className="space-y-6 animate-fade-in font-sans">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Live Order Command Center</h2>
                        <p className="text-sm text-gray-500 mt-1">Accept, track, and update dynamic customer table & takeaway orders in real-time.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { loadOrders(); showToast("Refreshed incoming orders!"); }}
                          className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-gray-700 dark:text-gray-300 rounded-xl transition-all cursor-pointer"
                          title="Refresh Orders"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Auto-Polling Live
                        </span>
                      </div>
                    </div>

                    {/* Advanced Live Order Filters */}
                    <div className="bg-gray-50 dark:bg-stone-850 p-5 rounded-3xl border border-gray-100 dark:border-stone-800 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Keyword Search */}
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search Customer name, phone..."
                            value={ordersSearch}
                            onChange={(e) => setOrdersSearch(e.target.value)}
                            className="w-full text-xs pl-9 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-gray-800 dark:text-white"
                          />
                        </div>

                        {/* Status Filter */}
                        <div>
                          <select
                            value={ordersStatusFilter}
                            onChange={(e) => setOrdersStatusFilter(e.target.value)}
                            className="w-full text-xs px-3 py-2.5 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-gray-800 dark:text-white"
                          >
                            <option value="all">All Statuses</option>
                            <option value="Pending">Pending Approval</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Preparing">Preparing in Kitchen</option>
                            <option value="Ready">Ready to Serve</option>
                            <option value="Completed">Completed / Paid</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Table Number Filter */}
                        <div>
                          <select
                            value={ordersTableFilter}
                            onChange={(e) => setOrdersTableFilter(e.target.value)}
                            className="w-full text-xs px-3 py-2.5 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-gray-800 dark:text-white"
                          >
                            <option value="all">All Tables & Takeaway</option>
                            <option value="Takeaway">Takeaway Only</option>
                            {Array.from({ length: 20 }, (_, i) => String(i + 1)).map(num => (
                              <option key={num} value={num}>Table {num}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Orders Render Deck */}
                    {(() => {
                      const filteredOrders = orders.filter((o: any) => {
                        const sMatch = ordersSearch ? (
                          o.customerName.toLowerCase().includes(ordersSearch.toLowerCase()) ||
                          o.phone.includes(ordersSearch) ||
                          o.id.includes(ordersSearch)
                        ) : true;
                        const statusMatch = ordersStatusFilter === "all" ? true : o.status === ordersStatusFilter;
                        const tableMatch = ordersTableFilter === "all" ? true : o.tableNumber === ordersTableFilter;
                        return sMatch && statusMatch && tableMatch;
                      });

                      if (filteredOrders.length === 0) {
                        return (
                          <div className="py-16 text-center border-2 border-dashed border-gray-100 dark:border-stone-850 rounded-3xl">
                            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="font-bold text-gray-800 dark:text-white">No matching orders</h3>
                            <p className="text-xs text-gray-400 mt-1">There are no customer orders matching your filter parameters.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {filteredOrders.map((order: any) => (
                            <div
                              key={order.id}
                              className={`bg-white dark:bg-stone-900 border rounded-3xl p-6 space-y-4 transition-all hover:shadow-md ${
                                order.status === "Pending"
                                  ? "border-amber-200 dark:border-amber-900/30 bg-amber-50/5 dark:bg-amber-950/5 ring-1 ring-amber-100 dark:ring-transparent"
                                  : order.status === "Preparing"
                                  ? "border-blue-200 dark:border-blue-900/30 bg-blue-50/5 dark:bg-blue-950/5"
                                  : order.status === "Ready"
                                  ? "border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/5 dark:bg-emerald-950/5"
                                  : "border-gray-100 dark:border-stone-850"
                              }`}
                            >
                              {/* Card Header */}
                              <div className="flex justify-between items-start gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-neutral-900 text-white dark:bg-stone-800 dark:text-gray-100 text-xs font-black tracking-wider px-2.5 py-1 rounded-lg">
                                      {order.tableNumber && order.tableNumber !== "Takeaway" ? `Table ${order.tableNumber}` : "🥡 Takeaway"}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono font-medium">#{order.id.slice(-8)}</span>
                                  </div>
                                  <p className="text-xs text-gray-400 font-mono">
                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold leading-none ${
                                    order.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100 animate-pulse dark:bg-amber-950/20 dark:text-amber-400 dark:border-transparent" :
                                    order.status === "Accepted" ? "bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-transparent" :
                                    order.status === "Preparing" ? "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-transparent" :
                                    order.status === "Ready" ? "bg-emerald-50 text-emerald-700 border border-emerald-100 animate-bounce dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-transparent" :
                                    order.status === "Completed" ? "bg-gray-100 text-gray-600 dark:bg-stone-800 dark:text-gray-400" :
                                    "bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-transparent"
                                  }`}>
                                    {order.status === "Pending" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                                    {order.status === "Preparing" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>}
                                    {order.status === "Ready" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                                    {order.status}
                                  </span>
                                </div>
                              </div>

                              {/* Customer Details */}
                              <div className="bg-gray-50/50 dark:bg-stone-850/40 p-3.5 rounded-2xl text-xs space-y-1">
                                <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                  <span>👤 {order.customerName}</span>
                                  <span className="text-gray-400 font-normal">({order.phone})</span>
                                </p>
                                {order.notes && (
                                  <p className="text-gray-500 italic font-sans border-l-2 border-amber-400 pl-2 mt-1">
                                    &ldquo;{order.notes}&rdquo;
                                  </p>
                                )}
                              </div>

                              {/* Ordered Items List */}
                              <div className="space-y-1.5 py-1">
                                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Order Items Basket</p>
                                <div className="divide-y divide-gray-100 dark:divide-stone-850 text-xs">
                                  {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between py-2 text-gray-700 dark:text-gray-300">
                                      <span className="font-medium">
                                        <strong className="text-red-600 font-bold mr-1.5">{item.quantity}x</strong> 
                                        {item.itemName || "Special Menu Item"}
                                      </span>
                                      <span className="font-mono text-gray-400 font-bold">{item.price * item.quantity} ETB</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Financial Total & Actions */}
                              <div className="border-t border-gray-100 dark:border-stone-850 pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="self-start sm:self-center">
                                  <span className="text-[10px] text-gray-400 font-mono block uppercase">Total Bill (inc. service)</span>
                                  <span className="text-lg font-black text-red-600 dark:text-red-500 font-mono leading-none">{order.totalPrice} ETB</span>
                                </div>

                                {/* Dynamic Order Action Pipeline */}
                                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                                  {order.status === "Pending" && (
                                    <>
                                      <button
                                        onClick={() => handleUpdateOrderStatus(order.id, "Accepted")}
                                        className="flex-1 sm:flex-initial bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                                      >
                                        Accept Order
                                      </button>
                                      <button
                                        onClick={() => handleUpdateOrderStatus(order.id, "Cancelled")}
                                        className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                                      >
                                        Decline
                                      </button>
                                    </>
                                  )}

                                  {order.status === "Accepted" && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, "Preparing")}
                                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                                    >
                                      Start Preparing 👨‍🍳
                                    </button>
                                  )}

                                  {order.status === "Preparing" && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, "Ready")}
                                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 animate-pulse"
                                    >
                                      Ready to Serve! 🛎️
                                    </button>
                                  )}

                                  {order.status === "Ready" && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, "Completed")}
                                      className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-stone-800 dark:hover:bg-stone-750 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                                    >
                                      Complete & Paid 💸
                                    </button>
                                  )}

                                  {/* Print kitchen ticket */}
                                  <button
                                    onClick={() => {
                                      const printWindow = window.open("", "_blank");
                                      if (printWindow) {
                                        const htmlLines = [
                                          "<html>",
                                          "<head>",
                                          "  <title>WOW BURGER - KITCHEN TICKET</title>",
                                          "  <style>",
                                          "    body { font-family: 'Courier New', Courier, monospace; width: 300px; padding: 20px; color: #000; }",
                                          "    h1 { text-align: center; font-size: 18px; margin-bottom: 5px; }",
                                          "    .header-info { text-align: center; font-size: 12px; margin-bottom: 15px; border-bottom: 2px dashed #000; padding-bottom: 10px; }",
                                          "    .item-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; }",
                                          "    .qty { font-weight: bold; margin-right: 10px; }",
                                          "    .notes { font-style: italic; font-size: 12px; border-left: 2px solid #000; padding-left: 5px; margin: 10px 0; }",
                                          "    .total { font-weight: bold; border-top: 1px dashed #000; margin-top: 15px; padding-top: 5px; font-size: 16px; display: flex; justify-content: space-between; }",
                                          "    .footer { text-align: center; font-size: 10px; margin-top: 30px; border-top: 1px solid #000; padding-top: 5px; }",
                                          "  </style>",
                                          "</head>",
                                          "<body>",
                                          "  <h1>WOW BURGER</h1>",
                                          "  <div class='header-info'>",
                                          "    <strong>KITCHEN TICKET</strong><br>",
                                          "    " + (order.tableNumber !== "Takeaway" ? "TABLE: " + order.tableNumber : "TAKEOUT") + "<br>",
                                          "    ID: " + order.id + "<br>",
                                          "    Date: " + new Date(order.createdAt).toLocaleString(),
                                          "  </div>",
                                          "  <div style='font-weight: bold; margin-bottom: 10px;'>Name: " + order.customerName + "</div>",
                                          "  <div>",
                                          order.items.map((it: any) => 
                                            "    <div class='item-row'>" +
                                            "      <span><span class='qty'>" + it.quantity + "x</span> " + it.itemName + "</span>" +
                                            "      <span>" + (it.price * it.quantity) + " ETB</span>" +
                                            "    </div>"
                                          ).join(""),
                                          "  </div>",
                                          order.notes ? "  <div class='notes'>Notes: \"" + order.notes + "\"</div>" : "",
                                          "  <div class='total'>",
                                          "    <span>TOTAL:</span>",
                                          "    <span>" + order.totalPrice + " ETB</span>",
                                          "  </div>",
                                          "  <div class='footer'>",
                                          "    Enjoy Addis Ababa's Finest Burgers",
                                          "  </div>",
                                          "  <script>window.onload = function() { window.print(); window.close(); }</script>",
                                          "</body>",
                                          "</html>"
                                        ];
                                        printWindow.document.write(htmlLines.join("\n"));
                                        printWindow.document.close();
                                      }
                                    }}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-gray-600 dark:text-gray-300 rounded-xl transition-all cursor-pointer"
                                    title="Print Kitchen Receipt"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* QR CODE TABLE GENERATOR TAB */}
                {adminTab === "qrcodes" && (
                  <div className="space-y-6 animate-fade-in font-sans">
                    <div className="border-b border-gray-100 pb-5">
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">QR Table Code Generator</h2>
                      <p className="text-sm text-gray-500 mt-1">Generate print-ready, scan-to-order dynamic signs for table-specific ordering.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Control Form */}
                      <div className="lg:col-span-1 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-gray-100 dark:border-stone-850 shadow-xs h-fit space-y-5">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">Configure Table Sign</h3>
                        
                        <div className="space-y-4 text-xs">
                          <div>
                            <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-gray-400 mb-1.5">Table Number Selector</label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              defaultValue="1"
                              id="qr-table-input"
                              className="w-full px-3 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 dark:border-stone-800 focus:border-red-500 rounded-xl outline-hidden focus:ring-1 focus:ring-red-500 text-gray-800 dark:text-white font-mono font-bold"
                            />
                          </div>

                          <div className="p-3.5 bg-gray-50 dark:bg-stone-850/40 rounded-xl border border-gray-100 dark:border-stone-800 space-y-1">
                            <span className="text-[9px] font-black uppercase text-amber-600 block">How it works</span>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
                              When customers scan these generated codes, the menu opens instantly with their exact Table Number auto-assigned in the header. They can add items and submit orders directly to your Live Kitchen Monitor without waiter assistance.
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              const input = document.getElementById("qr-table-input") as HTMLInputElement;
                              const tNum = input?.value || "1";
                              const origin = window.location.origin;
                              const tableUrl = `${origin}/?table=${tNum}`;
                              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(tableUrl)}`;
                              
                              const printWindow = window.open("", "_blank");
                              if (printWindow) {
                                printWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>WOW BURGER - TABLE ${tNum} SIGN</title>
                                      <style>
                                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; padding: 50px; background: #fff; color: #111; }
                                        .card { border: 4px solid #dc2626; border-radius: 40px; padding: 50px; max-width: 450px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                                        .logo { font-size: 32px; font-weight: 900; color: #dc2626; letter-spacing: -1px; margin-bottom: 5px; }
                                        .subtitle { font-size: 12px; font-family: monospace; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-bottom: 30px; }
                                        .table-badge { background: #dc2626; color: #fff; font-size: 36px; font-weight: 900; display: inline-block; padding: 10px 40px; border-radius: 20px; margin-bottom: 35px; }
                                        .qr-box { margin-bottom: 35px; display: inline-block; padding: 15px; border: 2px solid #e5e7eb; border-radius: 20px; background: #fff; }
                                        .qr-box img { display: block; }
                                        .action-text { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
                                        .sub-action { font-size: 12px; color: #666; margin-bottom: 30px; }
                                        .url-text { font-size: 10px; font-family: monospace; color: #999; word-break: break-all; }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="card">
                                        <div class="logo">🔥 WOW BURGER</div>
                                        <div class="subtitle">Digital Menu Suite</div>
                                        <div class="table-badge">TABLE \${tNum}</div>
                                        <br>
                                        <div class="qr-box">
                                          <img src="\${qrUrl}" width="240" height="240" />
                                        </div>
                                        <div class="action-text">SCAN TO ORDER & PAY</div>
                                        <div class="sub-action">Instant table service • No apps required</div>
                                        <div class="url-text">\${tableUrl}</div>
                                      </div>
                                      <script>window.onload = function() { window.print(); window.close(); }</script>
                                    </body>
                                  </html>
                                `);
                                printWindow.document.close();
                              }
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Printer className="w-4 h-4" /> Print Custom Sign
                          </button>
                        </div>
                      </div>

                      {/* Display Grid of Standard Restaurant Tables */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-gray-900 dark:text-white text-base">Standard Floor Layout (Tables 1 - 8)</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Array.from({ length: 8 }, (_, i) => i + 1).map(num => {
                            const tableUrl = `${window.location.origin}/?table=${num}`;
                            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tableUrl)}`;
                            return (
                              <div
                                key={num}
                                className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-gray-100 dark:border-stone-850 flex items-center gap-4 hover:shadow-md transition-all"
                              >
                                <div className="border border-gray-100 dark:border-stone-800 p-2 bg-white rounded-2xl shrink-0">
                                  <img
                                    src={qrUrl}
                                    alt={`Table ${num} QR`}
                                    className="w-20 h-20"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="space-y-2 flex-1 min-w-0 text-xs">
                                  <div>
                                    <span className="bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 font-bold px-2 py-0.5 rounded-md">
                                      Table {num}
                                    </span>
                                    <h4 className="font-bold text-gray-900 dark:text-white mt-1.5 truncate">Active Sign</h4>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const printWindow = window.open("", "_blank");
                                      if (printWindow) {
                                        const htmlLines = [
                                          "<html>",
                                          "<head>",
                                          "  <title>WOW BURGER - TABLE " + num + " SIGN</title>",
                                          "  <style>",
                                          "    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; padding: 50px; background: #fff; color: #111; }",
                                          "    .card { border: 4px solid #dc2626; border-radius: 40px; padding: 50px; max-width: 450px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }",
                                          "    .logo { font-size: 32px; font-weight: 900; color: #dc2626; letter-spacing: -1px; margin-bottom: 5px; }",
                                          "    .subtitle { font-size: 12px; font-family: monospace; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-bottom: 30px; }",
                                          "    .table-badge { background: #dc2626; color: #fff; font-size: 36px; font-weight: 900; display: inline-block; padding: 10px 40px; border-radius: 20px; margin-bottom: 35px; }",
                                          "    .qr-box { margin-bottom: 35px; display: inline-block; padding: 15px; border: 2px solid #e5e7eb; border-radius: 20px; background: #fff; }",
                                          "    .qr-box img { display: block; }",
                                          "    .action-text { font-size: 18px; font-weight: bold; margin-bottom: 5px; }",
                                          "    .sub-action { font-size: 12px; color: #666; margin-bottom: 30px; }",
                                          "    .url-text { font-size: 10px; font-family: monospace; color: #999; word-break: break-all; }",
                                          "  </style>",
                                          "</head>",
                                          "<body>",
                                          "  <div class='card'>",
                                          "    <div class='logo'>🔥 WOW BURGER</div>",
                                          "    <div class='subtitle'>Digital Menu Suite</div>",
                                          "    <div class='table-badge'>TABLE " + num + "</div>",
                                          "    <br>",
                                          "    <div class='qr-box'>",
                                          "      <img src='" + qrUrl + "' width='240' height='240' />",
                                          "    </div>",
                                          "    <div class='action-text'>SCAN TO ORDER & PAY</div>",
                                          "    <div class='sub-action'>Instant table service • No apps required</div>",
                                          "    <div class='url-text'>" + tableUrl + "</div>",
                                          "  </div>",
                                          "  <script>window.onload = function() { window.print(); window.close(); }</script>",
                                          "</body>",
                                          "</html>"
                                        ];
                                        printWindow.document.write(htmlLines.join("\n"));
                                        printWindow.document.close();
                                      }
                                    }}
                                    className="text-red-600 dark:text-red-400 font-bold hover:underline cursor-pointer flex items-center gap-1 shrink-0 mt-1"
                                  >
                                    <Printer className="w-3.5 h-3.5" /> Print Layout Sign
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      )}

      {/* Corporate footer */}
      <footer className="bg-white dark:bg-stone-900 border-t border-gray-100 dark:border-stone-850 px-4 py-8 md:px-8 mt-auto text-center space-y-2 transition-colors duration-300">
        <p className="text-xs text-neutral-500 dark:text-gray-400 font-sans">
          &copy; {new Date().getFullYear()} WOW BURGER, INC. All rights reserved. Addis Ababa, Ethiopia.
        </p>
        <span className="text-[10px] text-gray-300 dark:text-stone-700 font-mono tracking-widest block uppercase">
          Crafted for Excellence | Secure RBAC Session Active
        </span>
      </footer>

      {/* ==================== CLIENT ITEM DETAIL OVERLAY DIALOG ==================== */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="detailed-item-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-stone-900 rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-gray-100 dark:border-stone-850 flex flex-col max-h-[90vh]"
            >
              {/* Overlay Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 dark:border-stone-850 bg-gray-50/50 dark:bg-stone-850/30">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{selectedItem.name}</h3>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{selectedItem.category} specialties</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-stone-800 text-gray-400 hover:text-gray-800 rounded-full cursor-pointer transition-colors"
                  aria-label="Close"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable details wrapper */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                {/* Left section: Multiple Images Carousel & Badges */}
                <div className="space-y-4">
                  <MenuCarousel images={selectedItemImages} fallbackImage={selectedItem.image} />

                  {/* Dietary badges */}
                  {selectedItem.dietaryBadges && selectedItem.dietaryBadges.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedItem.dietaryBadges.map((badge) => (
                        <span key={badge} className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 text-[10px] font-bold font-mono px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/40">
                          🌿 {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Calories info */}
                  <div className="bg-gray-50 dark:bg-stone-850 p-4 rounded-2xl border border-gray-100 dark:border-stone-800 text-xs text-gray-500 flex justify-between items-center font-mono">
                    <span>Nutritional Energy Value:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">{selectedItem.calories} kcal</span>
                  </div>
                </div>

                {/* Right section: Description & Reviews */}
                <div className="space-y-6 text-sm text-gray-800 dark:text-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-2xl font-black text-red-600 font-mono">{selectedItem.price} ETB</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-gray-900 dark:text-white">{selectedItem.rating}</span>
                        <span className="text-xs text-gray-400">({selectedItem.reviewsCount} reviews)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-sans">{selectedItem.fullDescription}</p>
                  </div>

                  {/* Ingredients details list */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">Selected Ingredients:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.ingredients?.map((ing) => (
                        <span key={ing} className="bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-lg">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Allergens warning */}
                  {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                    <div className="bg-rose-50 dark:bg-rose-950/20 text-xs text-red-600 dark:text-rose-400 p-3 rounded-2xl border border-red-100 dark:border-rose-900/40 flex items-start gap-2 leading-relaxed">
                      <span className="shrink-0 mt-0.5">⚠️</span>
                      <div>
                        <span className="font-bold">Allergen Warning Alert:</span> This specialty recipe contains {selectedItem.allergens.join(", ")}. Please alert our waitstaff of serious dietary sensitivities.
                      </div>
                    </div>
                  )}

                  {/* Sticky Add to Cart control block */}
                  <div className="bg-gray-50 dark:bg-stone-850 p-4 rounded-3xl border border-gray-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 my-4 shadow-xs">
                    <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                      <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Quantity:</span>
                      {selectedItem.isAvailable ? (
                        <div className="flex items-center border border-gray-200 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-900 shadow-xs">
                          <button
                            type="button"
                            onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                            className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-stone-800 font-bold transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-4 font-mono font-bold text-gray-900 dark:text-white text-sm">
                            {modalQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setModalQty(modalQty + 1)}
                            className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-stone-800 font-bold transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-red-500 font-mono uppercase">Sold Out</span>
                      )}
                    </div>
                    {selectedItem.isAvailable ? (
                      <button
                        onClick={() => {
                          addToCart(selectedItem, modalQty);
                          showToast(`Added ${modalQty}x ${selectedItem.name} to cart!`);
                          setSelectedItem(null);
                        }}
                        className="w-full sm:w-auto flex-1 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <ShoppingBag className="w-4 h-4" /> Add {(selectedItem.price * modalQty).toLocaleString()} ETB to Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full sm:w-auto flex-1 bg-gray-200 dark:bg-stone-850 text-gray-400 dark:text-gray-650 font-bold px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        Currently Unavailable
                      </button>
                    )}
                  </div>

                  {/* Reviews & Submission Area */}
                  <div className="border-t border-gray-100 dark:border-stone-850 pt-5 space-y-4">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">Customer Reviews & Ratings</h4>
                    
                    {/* Previous reviews */}
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {itemReviews.length === 0 ? (
                        <div className="text-xs text-gray-400 italic text-center py-4">Be the first to review this legendary recipe!</div>
                      ) : (
                        itemReviews.map((rev) => (
                          <div key={rev.id} className="bg-gray-50/60 dark:bg-stone-850/30 p-3.5 rounded-2xl border border-gray-100 dark:border-stone-800 text-xs space-y-1.5 leading-relaxed">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-950 dark:text-white">{rev.customerName}</span>
                              <span className="text-gray-400 font-mono">{rev.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"}`} />
                              ))}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 font-sans">{rev.comment}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Review submission Form */}
                    <form onSubmit={handleReviewSubmit} className="bg-neutral-50 dark:bg-stone-850/40 p-4 rounded-3xl space-y-3 text-xs">
                      <p className="font-bold text-gray-800 dark:text-white">Write Your Feedback:</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          className="w-full p-2 bg-white rounded-lg border text-gray-800 font-sans"
                        />
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(parseInt(e.target.value))}
                          className="w-full p-2 bg-white rounded-lg border text-gray-800 font-sans font-bold text-amber-600"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                          <option value="4">⭐⭐⭐⭐ Great (4/5)</option>
                          <option value="3">⭐⭐⭐ Good (3/5)</option>
                          <option value="2">⭐⭐ Fair (2/5)</option>
                          <option value="1">⭐ Poor (1/5)</option>
                        </select>
                      </div>

                      <textarea
                        required
                        placeholder="Add your review comment details..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full p-2 bg-white rounded-lg border text-gray-800 font-sans h-16 resize-none"
                      />

                      <button
                        type="submit"
                        disabled={reviewLoading}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {reviewLoading ? "Submitting feedback..." : "Publish Review Rating"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== EDIT/CREATE MENU ITEM DIALOG MODAL ==================== */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-stone-900 rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-gray-100 dark:border-stone-850 flex flex-col max-h-[92vh]"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Settings className="w-5 h-5 text-red-600 animate-spin-slow" />
                  {editingItem ? `Edit Menu Item: ${editingItem.name}` : "Create New Menu Item"}
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-800 rounded-full transition-colors cursor-pointer"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Dual Column Layout: Left (Inputs Form), Right (Multiple Images Manager & Carousel Setup) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 font-sans text-sm">
                {/* Left Form */}
                <form onSubmit={handleSaveMenuItem} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Item Name *</label>
                      <input
                        type="text"
                        required
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Price (ETB) *</label>
                      <input
                        type="number"
                        required
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Category *</label>
                      <select
                        value={itemCat}
                        onChange={(e) => setItemCat(e.target.value as any)}
                        className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1"
                      >
                        <option value="burgers">Burgers</option>
                        <option value="sides">Sides</option>
                        <option value="drinks">Drinks</option>
                        <option value="desserts">Desserts</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Energy (kcal)</label>
                      <input
                        type="number"
                        value={itemCalories}
                        onChange={(e) => setItemCalories(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Short Description *</label>
                    <input
                      type="text"
                      required
                      value={itemShortDesc}
                      onChange={(e) => setItemShortDesc(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Full Description *</label>
                    <textarea
                      required
                      value={itemFullDesc}
                      onChange={(e) => setItemFullDesc(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent h-20 resize-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Primary Image Path / URL *</label>
                    <input
                      type="text"
                      value={itemPrimaryImage}
                      onChange={(e) => setItemPrimaryImage(e.target.value)}
                      placeholder="e.g. /uploads/image-123.jpg"
                      className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Ingredients (Comma separated)</label>
                    <input
                      type="text"
                      value={itemIngredients}
                      onChange={(e) => setItemIngredients(e.target.value)}
                      placeholder="Beef Patty, Cheddar Cheese, WOW Sauce"
                      className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Allergens (Comma separated)</label>
                    <input
                      type="text"
                      value={itemAllergens}
                      onChange={(e) => setItemAllergens(e.target.value)}
                      placeholder="Wheat (Gluten), Dairy, Egg"
                      className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none pt-2">
                      <input
                        type="checkbox"
                        checked={itemAvailable}
                        onChange={(e) => setItemAvailable(e.target.checked)}
                        className="w-4.5 h-4.5 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-gray-700">Stock Available / In Store</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none pt-2">
                      <input
                        type="checkbox"
                        checked={itemIsPopular}
                        onChange={(e) => setItemIsPopular(e.target.checked)}
                        className="w-4.5 h-4.5 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-gray-700">Mark as Popular</span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end gap-3.5">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold shadow-md cursor-pointer animate-pulse-hover"
                    >
                      Save Item Record
                    </button>
                  </div>
                </form>

                {/* Right: Multiple Images Manager (Requires item to be saved first) */}
                <div className="space-y-6 border-l border-gray-100 pl-8">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-red-500" /> Multiple Images Manager
                    </h4>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed">
                      Each menu item supports up to 5 custom images. Set one as primary or delete secondary profiles.
                    </p>
                  </div>

                  {!editingItem ? (
                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center">
                      <SlidersHorizontal className="w-8 h-8 text-gray-300" />
                      <p className="text-xs text-gray-400 mt-2 font-sans">
                        Save menu item record first to activate multiple images uploads.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* Grid listing existing images */}
                      <div className="grid grid-cols-2 gap-3.5">
                        {uploadedImages.map((img) => (
                          <div key={img.id} className="relative group rounded-xl overflow-hidden bg-gray-50 border border-gray-100 h-28 flex flex-col justify-between p-2">
                            <img src={img.imagePath} alt="" className="absolute inset-0 w-full h-full object-cover z-0" referrerPolicy="no-referrer" />
                            <div className="relative z-10 flex justify-between items-start">
                              <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded-sm shadow-xs ${
                                img.isPrimary ? "bg-red-600 text-white" : "bg-black/60 text-white"
                              }`}>
                                {img.isPrimary ? "Primary" : "Secondary"}
                              </span>
                              {!img.isPrimary && (
                                <button
                                  onClick={() => handleDeleteItemImage(img.id)}
                                  className="p-1 bg-white/95 text-gray-500 hover:text-red-600 rounded-full shadow-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            {!img.isPrimary && (
                              <button
                                onClick={() => handleSetPrimaryImage(img.id)}
                                className="relative z-10 w-full text-center py-1 bg-black/60 hover:bg-black/80 text-white text-[9px] font-mono uppercase font-bold tracking-widest rounded-md cursor-pointer transition-colors"
                              >
                                Set Primary
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Interactive Drag & Drop zone */}
                      <div className="space-y-3.5 border-t border-gray-100 pt-5">
                        <p className="text-xs font-bold text-gray-700">Upload Additional Image Profile:</p>
                        
                        <div className="flex items-center gap-4">
                          <label className="flex-1 border border-dashed border-gray-300 hover:border-red-500 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50/50 transition-colors">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1 font-sans">Choose Image File</span>
                            <input
                              type="file"
                              accept=".jpeg,.jpg,.png,.webp"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>

                          {previewUrl && (
                            <div className="w-20 h-20 rounded-xl overflow-hidden border relative bg-gray-50 shrink-0">
                              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                                className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {selectedFile && (
                          <button
                            type="button"
                            disabled={uploadLoading}
                            onClick={handleUploadImageForMenuItem}
                            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {uploadLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                            Upload Selected Image
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== CREATE/EDIT OFFERS MODAL ==================== */}
      <AnimatePresence>
        {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 border space-y-4"
            >
              <h3 className="text-lg font-bold text-gray-900">{editingOffer ? "Edit Promo Code" : "Launch Special Offer"}</h3>
              <form onSubmit={handleSaveOffer} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold mb-1">Offer Title</label>
                  <input type="text" required value={offerTitle} onChange={e => setOfferTitle(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Subtitle Description</label>
                  <input type="text" value={offerSubtitle} onChange={e => setOfferSubtitle(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Promo Code</label>
                    <input type="text" required value={offerCode} onChange={e => setOfferCode(e.target.value)} className="w-full p-2 border rounded-lg uppercase" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Discount (%)</label>
                    <input type="number" required value={offerDiscount} onChange={e => setOfferDiscount(e.target.value)} className="w-full p-2 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Validity (e.g. Daily after 10 PM)</label>
                  <input type="text" required value={offerValidity} onChange={e => setOfferValidity(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
                <label className="flex items-center gap-2 pt-2 cursor-pointer">
                  <input type="checkbox" checked={offerActive} onChange={e => setOfferActive(e.target.checked)} />
                  <span className="font-semibold text-gray-700">Mark as Active</span>
                </label>
                <div className="pt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsOfferModalOpen(false)} className="px-3.5 py-2 border rounded-lg font-semibold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold">Save Campaign</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== CREATE INGREDIENT MODAL ==================== */}
      <AnimatePresence>
        {isIngModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 border space-y-4"
            >
              <h3 className="text-lg font-bold text-gray-900">Add Stock Ingredient</h3>
              <form onSubmit={handleSaveIngredient} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold mb-1">Ingredient Name</label>
                  <input type="text" required value={ingName} onChange={e => setIngName(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Quantity Level</label>
                    <input type="number" required value={ingQty} onChange={e => setIngQty(e.target.value)} className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Safety Threshold</label>
                    <input type="number" required value={ingMin} onChange={e => setIngMin(e.target.value)} className="w-full p-2 border rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Unit</label>
                    <input type="text" required value={ingUnit} onChange={e => setIngUnit(e.target.value)} className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Supplier Name</label>
                    <input type="text" value={ingSupplier} onChange={e => setIngSupplier(e.target.value)} className="w-full p-2 border rounded-lg" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsIngModalOpen(false)} className="px-3.5 py-2 border rounded-lg font-semibold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold">Register Item</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== CREATE/EDIT BANNERS MODAL ==================== */}
      <AnimatePresence>
        {isBannerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 border space-y-4"
            >
              <h3 className="text-lg font-bold text-gray-900">Launch Banner Campaign</h3>
              <form onSubmit={handleSaveBanner} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold mb-1">Campaign Title</label>
                  <input type="text" required value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kicker Badge (e.g. LIMITED LAUNCH)</label>
                  <input type="text" required value={bannerKicker} onChange={e => setBannerKicker(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Cover Image URL</label>
                  <input type="url" value={bannerImage} onChange={e => setBannerImage(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Button CTA Text</label>
                  <input type="text" required value={bannerCta} onChange={e => setBannerCta(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
                <label className="flex items-center gap-2 pt-2 cursor-pointer">
                  <input type="checkbox" checked={bannerLive} onChange={e => setBannerLive(e.target.checked)} />
                  <span className="font-semibold text-gray-700">Set Campaign Live</span>
                </label>
                <div className="pt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsBannerModalOpen(false)} className="px-3.5 py-2 border rounded-lg font-semibold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold">Save Campaign</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SCREEN COMPATIBLE BOTTOM NAVIGATION BAR ==================== */}
      {!isAdminPortalOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-safe flex justify-center pointer-events-none">
          <motion.nav 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="pointer-events-auto flex items-center justify-between w-full max-w-xl sm:max-w-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border border-gray-100 dark:border-stone-800/80 rounded-3xl p-2 shadow-2xl transition-all"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
          >
            {[
              { id: "home", label: "Home", icon: Home, action: () => { setActiveTab("home"); setCatalogCategory("all"); } },
              { id: "food", label: "Gourmet Food", icon: Utensils, action: () => { setActiveTab("food"); setCatalogCategory("burgers"); } },
              { id: "drinks", label: "Craft Drinks", icon: CupSoda, action: () => { setActiveTab("drinks"); setCatalogCategory("drinks"); } },
              { id: "favorites", label: "Favorites", icon: Heart, action: () => { setActiveTab("favorites"); } },
              { id: "cart", label: "Cart", icon: ShoppingBag, action: () => { setActiveTab("cart"); } }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              const totalCartItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    tab.action();
                    // Smooth scroll to catalog
                    if (tab.id !== "cart" && tab.id !== "favorites") {
                      setTimeout(() => {
                        const element = document.getElementById("menu-grid-anchor");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }, 80);
                    }
                  }}
                  className="relative flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 sm:px-4 rounded-2xl transition-all duration-300 cursor-pointer text-center flex-1 hover:scale-105 active:scale-95"
                >
                  {/* Sliding Background Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavActiveTab"
                      className="absolute inset-0 bg-red-600/10 dark:bg-red-500/15 rounded-2xl -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <div className="relative">
                    <IconComponent className={`w-5 h-5 transition-colors duration-300 ${isActive ? "text-red-600 dark:text-red-500" : "text-gray-400 dark:text-gray-500"}`} />
                    
                    {/* Badge count for Saved Favorites */}
                    {tab.id === "favorites" && favorites.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full leading-none flex items-center justify-center animate-pulse">
                        {favorites.length}
                      </span>
                    )}

                    {/* Badge count for Cart items */}
                    {tab.id === "cart" && totalCartItemsCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full leading-none flex items-center justify-center animate-pulse">
                        {totalCartItemsCount}
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                    isActive ? "text-red-600 dark:text-red-500" : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </motion.nav>
        </div>
      )}

    </div>
  );
}
