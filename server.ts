import express from "express";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { Database } from "./server/db";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "wow-secret-key-18731362";

// Ensure upload directory exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded assets
app.use("/uploads", express.static(UPLOADS_DIR));

// --- Security & JWT Authentication Middleware ---
interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
    username: string;
    role: "Super Admin" | "Manager" | "Employee";
  };
}

const authenticateToken = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token missing" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }
    req.user = decoded as AuthenticatedRequest["user"];
    next();
  });
};

// RBAC Middleware
const requireRole = (allowedRoles: ("Super Admin" | "Manager" | "Employee")[]) => {
  return (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden: Insufficient privileges" });
      return;
    }
    next();
  };
};

// --- Multer Image Upload Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and WEBP image formats are supported!"));
    }
  }
});

// --- API ROUTES ---

// 1. Auth & Password Management
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const user = Database.getUserByUsername(username);
  if (!user || user.status === "Inactive") {
    res.status(401).json({ error: "Invalid username or password, or account inactive." });
    return;
  }

  const validPassword = bcrypt.compareSync(password, user.passwordHash);
  if (!validPassword) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Log successful login
  const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
  Database.addActivityLog(user.username, ip, "User Login", "Success");

  res.json({
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      role: user.role,
      status: user.status,
      avatar: user.avatar
    }
  });
});

// Password change with secure strength validation
app.post("/api/auth/change-password", authenticateToken, (req: AuthenticatedRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Current and new passwords are required" });
    return;
  }

  const userId = req.user!.id;
  const user = Database.getUserById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Verify current password
  const valid = bcrypt.compareSync(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(400).json({ error: "Current password does not match" });
    return;
  }

  // Password rules validation
  // Minimum length: 8 characters, uppercase, lowercase, number, special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    res.status(400).json({
      error: "New password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
    });
    return;
  }

  Database.updateUser(userId, { passwordPlain: newPassword });
  
  // Log password change
  const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
  Database.addActivityLog(user.username, ip, "Password Changed", "Success");

  res.json({ success: true, message: "Password updated successfully. Please log in again." });
});

// 2. Menu Items CRUD with Pagination, Searching, Filtering, and Sorting
app.get("/api/menu", (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string || "").toLowerCase();
  const category = req.query.category as string || "all";
  const minPrice = parseFloat(req.query.minPrice as string) || 0;
  const maxPrice = parseFloat(req.query.maxPrice as string) || Infinity;
  const isAvailable = req.query.isAvailable as string;
  const isFeatured = req.query.isFeatured as string;
  const sortBy = req.query.sortBy as string || "dateAdded"; // name, price, viewCount, dateAdded
  const sortOrder = req.query.sortOrder as string || "desc"; // asc, desc

  let items = Database.getMenuItems();

  // 1. Advanced Search (by name, description, category)
  if (search) {
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.shortDescription.toLowerCase().includes(search) ||
        item.fullDescription.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
    );
  }

  // 2. Filters
  if (category && category !== "all") {
    items = items.filter((item) => item.category === category);
  }

  items = items.filter((item) => item.price >= minPrice && item.price <= maxPrice);

  if (isAvailable === "true") {
    items = items.filter((item) => item.isAvailable);
  } else if (isAvailable === "false") {
    items = items.filter((item) => !item.isAvailable);
  }

  if (isFeatured === "true") {
    items = items.filter((item) => item.isPopular || item.isNew);
  }

  // 3. Sorting
  items.sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "price") {
      comparison = a.price - b.price;
    } else if (sortBy === "viewCount") {
      comparison = a.viewCount - b.viewCount;
    } else if (sortBy === "dateAdded") {
      comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    } else {
      comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // 4. Server-Side Pagination
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIndex = (currentPage - 1) * limit;
  const paginatedItems = items.slice(startIndex, startIndex + limit);

  res.json({
    data: paginatedItems,
    totalItems,
    totalPages,
    currentPage,
    limit
  });
});

// Single Menu Item detail (increments item view count analytics)
app.get("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  const item = Database.getMenuItemById(id);
  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }

  // Increment view count analytics safely
  Database.incrementViewCount(id);

  // Return item details with all uploaded images
  const images = Database.getItemImages(id);
  res.json({
    ...item,
    images
  });
});

// Create menu item (Super Admin, Manager, Employee allowed)
app.post("/api/menu", authenticateToken, requireRole(["Super Admin", "Manager", "Employee"]), (req, res) => {
  const { name, price, category, shortDescription, fullDescription, image, ingredients, allergens, dietaryBadges, isAvailable, isPopular, isNew, calories } = req.body;
  if (!name || !price || !category) {
    res.status(400).json({ error: "Name, price, and category are required" });
    return;
  }

  const newItem = Database.createMenuItem({
    name,
    price: parseFloat(price),
    category,
    shortDescription: shortDescription || "",
    fullDescription: fullDescription || "",
    image: image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    allergens: Array.isArray(allergens) ? allergens : [],
    dietaryBadges: Array.isArray(dietaryBadges) ? dietaryBadges : [],
    isAvailable: isAvailable ?? true,
    isPopular: isPopular ?? false,
    isNew: isNew ?? true,
    calories: parseInt(calories) || 500
  });

  res.status(201).json(newItem);
});

// Update menu item (Super Admin, Manager, Employee allowed)
app.put("/api/menu/:id", authenticateToken, requireRole(["Super Admin", "Manager", "Employee"]), (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  if (updates.price) updates.price = parseFloat(updates.price);
  if (updates.calories) updates.calories = parseInt(updates.calories);

  const updated = Database.updateMenuItem(id, updates);
  if (!updated) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  res.json(updated);
});

// Delete menu item (Super Admin and Manager only, Employee cannot delete)
app.delete("/api/menu/:id", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const { id } = req.params;
  const success = Database.deleteMenuItem(id);
  if (!success) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  res.json({ success: true, message: "Item deleted successfully (cascade images cleared)" });
});

// 3. Multiple Images Support & Carousel Endpoints
app.get("/api/menu/:id/images", (req, res) => {
  const { id } = req.params;
  const images = Database.getItemImages(id);
  res.json(images);
});

// Upload and add multiple images to menu item
app.post("/api/menu/:id/images", authenticateToken, requireRole(["Super Admin", "Manager"]), upload.single("image"), (req, res) => {
  const { id } = req.params;
  const isPrimary = req.body.isPrimary === "true";

  if (!req.file) {
    res.status(400).json({ error: "Image file is required" });
    return;
  }

  const item = Database.getMenuItemById(id);
  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }

  const imagePath = `/uploads/${req.file.filename}`;
  const newImg = Database.addImageToItem(id, imagePath, isPrimary);

  res.status(201).json(newImg);
});

// Set specific image as primary
app.put("/api/menu/:id/images/:imageId/primary", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const { id, imageId } = req.params;
  const success = Database.setPrimaryImage(id, imageId);
  if (!success) {
    res.status(404).json({ error: "Image or Menu Item not found" });
    return;
  }
  res.json({ success: true, message: "Primary image updated successfully" });
});

// Delete specific image of item
app.delete("/api/menu/:id/images/:imageId", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const { id, imageId } = req.params;
  const success = Database.deleteItemImage(id, imageId);
  if (!success) {
    res.status(404).json({ error: "Image or Menu Item not found" });
    return;
  }
  res.json({ success: true, message: "Image deleted successfully" });
});

// General independent secure image upload (with preview on UI)
app.post("/api/upload", authenticateToken, requireRole(["Super Admin", "Manager"]), upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Image file is required" });
    return;
  }
  const imagePath = `/uploads/${req.file.filename}`;
  res.json({ imagePath });
});

// 4. Employee Management Module (Super Admin only)
app.get("/api/employees", authenticateToken, requireRole(["Super Admin"]), (req, res) => {
  const search = (req.query.search as string || "").toLowerCase();
  let users = Database.getUsers();

  if (search) {
    users = users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(search) ||
        u.lastName.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.phone.includes(search) ||
        u.username.toLowerCase().includes(search) ||
        u.role.toLowerCase().includes(search)
    );
  }

  res.json(users);
});

app.post("/api/employees", authenticateToken, requireRole(["Super Admin"]), (req, res) => {
  const { firstName, lastName, email, phone, username, password, role, status, avatar } = req.body;
  if (!firstName || !lastName || !email || !username || !password || !role) {
    res.status(400).json({ error: "First Name, Last Name, Email, Username, Password, and Role are required." });
    return;
  }

  // Validate password rules before saving
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      error: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
    });
    return;
  }

  // Check duplicate username
  const existing = Database.getUserByUsername(username);
  if (existing) {
    res.status(400).json({ error: "Username is already registered." });
    return;
  }

  const newUser = Database.createUser({
    firstName,
    lastName,
    email,
    phone: phone || "",
    username,
    role,
    status: status || "Active",
    avatar: avatar || "",
    passwordPlain: password
  });

  res.status(201).json(newUser);
});

app.put("/api/employees/:id", authenticateToken, requireRole(["Super Admin"]), (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, role, status, password, avatar } = req.body;

  const existingUser = Database.getUserById(id);
  if (!existingUser) {
    res.status(404).json({ error: "Employee not found" });
    return;
  }

  const updates: any = {};
  if (firstName !== undefined) updates.firstName = firstName;
  if (lastName !== undefined) updates.lastName = lastName;
  if (email !== undefined) updates.email = email;
  if (phone !== undefined) updates.phone = phone;
  if (role !== undefined) updates.role = role;
  if (status !== undefined) updates.status = status;
  if (avatar !== undefined) updates.avatar = avatar;
  if (password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        error: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
      });
      return;
    }
    updates.passwordPlain = password;
  }

  const updated = Database.updateUser(id, updates);
  res.json(updated);
});

app.delete("/api/employees/:id", authenticateToken, requireRole(["Super Admin"]), (req, res) => {
  const { id } = req.params;
  if (id === "usr-1") {
    res.status(400).json({ error: "Cannot delete primary Super Admin account" });
    return;
  }

  const success = Database.deleteUser(id);
  if (!success) {
    res.status(404).json({ error: "Employee not found" });
    return;
  }
  res.json({ success: true, message: "Employee deleted successfully" });
});

// 5. Active Offers management
app.get("/api/offers", (req, res) => {
  res.json(Database.getOffers());
});

app.post("/api/offers", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const { title, subtitle, promoCode, discountPercent, validity, isActive } = req.body;
  const newOffer = Database.createOffer({
    title,
    subtitle,
    promoCode,
    discountPercent: parseInt(discountPercent) || 10,
    validity,
    isActive: isActive ?? true
  });
  res.status(201).json(newOffer);
});

app.put("/api/offers/:id", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const id = parseInt(req.params.id);
  const updated = Database.updateOffer(id, req.body);
  if (!updated) {
    res.status(404).json({ error: "Offer not found" });
    return;
  }
  res.json(updated);
});

app.delete("/api/offers/:id", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const id = parseInt(req.params.id);
  const success = Database.deleteOffer(id);
  if (!success) {
    res.status(404).json({ error: "Offer not found" });
    return;
  }
  res.json({ success: true });
});

// 6. Home Banners Management
app.get("/api/banners", (req, res) => {
  res.json(Database.getBanners());
});

app.post("/api/banners", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const { title, kicker, imageUrl, ctaText, isLive } = req.body;
  const newBanner = Database.createBanner({
    title,
    kicker,
    imageUrl,
    ctaText,
    isLive: isLive ?? true
  });
  res.status(201).json(newBanner);
});

app.put("/api/banners/:id", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const id = parseInt(req.params.id);
  const updated = Database.updateBanner(id, req.body);
  if (!updated) {
    res.status(404).json({ error: "Banner not found" });
    return;
  }
  res.json(updated);
});

app.delete("/api/banners/:id", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const id = parseInt(req.params.id);
  const success = Database.deleteBanner(id);
  if (!success) {
    res.status(404).json({ error: "Banner not found" });
    return;
  }
  res.json({ success: true });
});

// 7. Ingredients Inventory API
app.get("/api/ingredients", authenticateToken, (req, res) => {
  res.json(Database.getIngredients());
});

app.post("/api/ingredients", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const { name, quantity, minStock, unit, supplier } = req.body;
  const newIng = Database.createIngredient({
    name,
    quantity: parseInt(quantity) || 100,
    minStock: parseInt(minStock) || 30,
    unit: unit || "pcs",
    supplier: supplier || "Kitchen Supply Co."
  });
  res.status(201).json(newIng);
});

app.put("/api/ingredients/:id/restock", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const id = parseInt(req.params.id);
  const quantityToAdd = parseInt(req.body.quantity);
  if (isNaN(quantityToAdd)) {
    res.status(400).json({ error: "Quantity to add must be a valid number" });
    return;
  }

  const updated = Database.updateIngredient(id, quantityToAdd);
  if (!updated) {
    res.status(404).json({ error: "Ingredient not found" });
    return;
  }
  res.json(updated);
});

app.delete("/api/ingredients/:id", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const id = parseInt(req.params.id);
  const success = Database.deleteIngredient(id);
  if (!success) {
    res.status(404).json({ error: "Ingredient not found" });
    return;
  }
  res.json({ success: true });
});

// 8. Administrative Access Logs
app.get("/api/logs", authenticateToken, requireRole(["Super Admin"]), (req, res) => {
  res.json(Database.getActivityLogs());
});

// 9. Dashboard Analytics Endpoint (Rich analytical views)
app.get("/api/analytics", authenticateToken, requireRole(["Super Admin", "Manager"]), (req, res) => {
  const items = Database.getMenuItems();
  const users = Database.getUsers();
  const offers = Database.getOffers();

  const totalMenuItems = items.length;
  const categoriesCount = new Set(items.map((i) => i.category)).size;
  const totalEmployees = users.length;
  const activeOffersCount = offers.filter((o) => o.isActive).length;
  const totalViews = items.reduce((sum, i) => sum + i.viewCount, 0);

  // Sorting for top viewed and least viewed
  const mostViewed = [...items].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
  const leastViewed = [...items].sort((a, b) => a.viewCount - b.viewCount).slice(0, 5);
  const topPopular = [...items].filter((i) => i.isPopular).slice(0, 10);

  // Category distribution
  const categoryDistribution = items.reduce((acc: any, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {});

  // Emulate daily and monthly view charts
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

  // Recent activity log merging
  const logs = Database.getActivityLogs();
  
  res.json({
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
      categoryDistribution: Object.keys(categoryDistribution).map((k) => ({
        name: k.toUpperCase(),
        value: categoryDistribution[k]
      })),
      mostPopularItems: mostViewed.map((i) => ({
        name: i.name,
        views: i.viewCount
      }))
    },
    lists: {
      mostViewed: mostViewed.map((i) => ({ id: i.id, name: i.name, price: i.price, category: i.category, viewCount: i.viewCount })),
      leastViewed: leastViewed.map((i) => ({ id: i.id, name: i.name, price: i.price, category: i.category, viewCount: i.viewCount })),
      topPopular: topPopular.map((i) => ({ id: i.id, name: i.name, price: i.price, category: i.category, rating: i.rating })),
      recentActivity: logs.slice(0, 10)
    }
  });
});

// Post review (customer facing)
app.post("/api/menu/:id/reviews", (req, res) => {
  const { id } = req.params;
  const { customerName, rating, comment } = req.body;
  
  if (!customerName || !rating) {
    res.status(400).json({ error: "Customer Name and Rating are required" });
    return;
  }

  const review = Database.createReview(id, customerName, parseInt(rating), comment || "");
  res.status(201).json(review);
});

// List reviews (customer facing)
app.get("/api/menu/:id/reviews", (req, res) => {
  const { id } = req.params;
  res.json(Database.getReviews(id));
});

// --- Orders API Endpoints ---

// Create Order (customer facing)
app.post("/api/orders", (req, res) => {
  const { customerName, phone, tableNumber, items, totalPrice, notes } = req.body;

  if (!customerName || typeof customerName !== "string" || customerName.trim() === "") {
    res.status(400).json({ error: "Customer Name is required" });
    return;
  }
  if (!phone || typeof phone !== "string" || phone.trim() === "") {
    res.status(400).json({ error: "Phone number is required" });
    return;
  }
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Order must contain at least one item" });
    return;
  }

  // Validate items
  for (const item of items) {
    if (!item.menuItemId || typeof item.quantity !== "number" || item.quantity <= 0 || typeof item.price !== "number") {
      res.status(400).json({ error: "Each order item must have a valid menuItemId, positive quantity, and price" });
      return;
    }
  }

  try {
    const newOrder = Database.createOrder({
      customerName,
      phone,
      tableNumber: tableNumber || "Takeaway",
      totalPrice: Number(totalPrice),
      notes: notes || "",
      items
    });
    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to place order" });
  }
});

// List all orders (admin/dashboard facing)
app.get("/api/orders", authenticateToken, requireRole(["Super Admin", "Manager", "Employee"]), (req, res) => {
  res.json(Database.getOrders());
});

// Update order status (admin/dashboard facing)
app.put("/api/orders/:id/status", authenticateToken, requireRole(["Super Admin", "Manager", "Employee"]), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "Accepted", "Preparing", "Ready", "Completed", "Cancelled"];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    return;
  }

  const updatedOrder = Database.updateOrderStatus(id, status);
  if (!updatedOrder) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(updatedOrder);
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
