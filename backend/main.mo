import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Order "mo:core/Order";
import List "mo:core/List";
import Option "mo:core/Option";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // ─── Types ────────────────────────────────────────────────────────────────

  public type UserProfile = {
    name : Text;
    email : Text;
    role : Text;
  };

  public type Category = {
    id : Nat;
    name : Text;
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    stock : Nat;
    category : Text;
    imageFile : Text;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  public type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : Nat;
    userId : Principal;
    items : [CartItem];
    total : Float;
    status : OrderStatus;
    createdAt : Int;
  };

  public type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
  };

  // ─── State ────────────────────────────────────────────────────────────────

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextProductId : Nat = 1;
  var nextCategoryId : Nat = 1;
  var nextOrderId : Nat = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let categories = Map.empty<Nat, Category>();
  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Principal, [CartItem]>();
  let wishlists = Map.empty<Principal, [Nat]>();
  let orders = Map.empty<Nat, Order>();
  let contactMessages = Map.empty<Nat, ContactMessage>();
  var nextContactId : Nat = 1;

  // ─── Seed helpers (called once at init) ───────────────────────────────────

  func seedData() {
    // Categories
    let smartphones : Category = { id = nextCategoryId; name = "Smartphones" };
    categories.add(nextCategoryId, smartphones);
    nextCategoryId += 1;

    let laptops : Category = { id = nextCategoryId; name = "Laptops" };
    categories.add(nextCategoryId, laptops);
    nextCategoryId += 1;

    let tablets : Category = { id = nextCategoryId; name = "Tablets" };
    categories.add(nextCategoryId, tablets);
    nextCategoryId += 1;

    // Products
    let p1 : Product = {
      id = nextProductId; name = "iPhone 15 Pro";
      description = "Apple iPhone 15 Pro with A17 Pro chip, 48MP camera system.";
      price = 999.99; stock = 50; category = "Smartphones"; imageFile = "iphone15pro.jpg";
    };
    products.add(nextProductId, p1); nextProductId += 1;

    let p2 : Product = {
      id = nextProductId; name = "Samsung Galaxy S24 Ultra";
      description = "Samsung flagship with 200MP camera and S Pen.";
      price = 1199.99; stock = 40; category = "Smartphones"; imageFile = "s24ultra.jpg";
    };
    products.add(nextProductId, p2); nextProductId += 1;

    let p3 : Product = {
      id = nextProductId; name = "Google Pixel 8 Pro";
      description = "Google Pixel 8 Pro with Tensor G3 chip and AI features.";
      price = 899.99; stock = 35; category = "Smartphones"; imageFile = "pixel8pro.jpg";
    };
    products.add(nextProductId, p3); nextProductId += 1;

    let p4 : Product = {
      id = nextProductId; name = "MacBook Pro 16\"";
      description = "Apple MacBook Pro 16 with M3 Pro chip, 18GB RAM.";
      price = 2499.99; stock = 20; category = "Laptops"; imageFile = "macbookpro16.jpg";
    };
    products.add(nextProductId, p4); nextProductId += 1;

    let p5 : Product = {
      id = nextProductId; name = "Dell XPS 15";
      description = "Dell XPS 15 with Intel Core i9, OLED display, 32GB RAM.";
      price = 1899.99; stock = 25; category = "Laptops"; imageFile = "dellxps15.jpg";
    };
    products.add(nextProductId, p5); nextProductId += 1;

    let p6 : Product = {
      id = nextProductId; name = "Lenovo ThinkPad X1 Carbon";
      description = "Business ultrabook with Intel Core i7, 16GB RAM, 1TB SSD.";
      price = 1599.99; stock = 30; category = "Laptops"; imageFile = "thinkpadx1.jpg";
    };
    products.add(nextProductId, p6); nextProductId += 1;
  };

  seedData();

  // ─── User Profile ─────────────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Admin: list all user profiles
  public query ({ caller }) func getAllUsers() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list all users");
    };
    userProfiles.entries().toArray();
  };

  // ─── Categories ───────────────────────────────────────────────────────────

  // Public read
  public query func getCategories() : async [Category] {
    categories.values().toArray();
  };

  public query func getCategory(id : Nat) : async ?Category {
    categories.get(id);
  };

  // Admin write
  public shared ({ caller }) func addCategory(name : Text) : async Category {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };
    let cat : Category = { id = nextCategoryId; name = name };
    categories.add(nextCategoryId, cat);
    nextCategoryId += 1;
    cat;
  };

  public shared ({ caller }) func updateCategory(id : Nat, name : Text) : async ?Category {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };
    switch (categories.get(id)) {
      case (null) { null };
      case (?_) {
        let updated : Category = { id = id; name = name };
        categories.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func deleteCategory(id : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };
    switch (categories.get(id)) {
      case (null) { false };
      case (?_) {
        categories.remove(id); true;
      };
    };
  };

  // ─── Products ─────────────────────────────────────────────────────────────

  // Public read
  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    let all = products.values().toArray();
    all.filter(func(p : Product) : Bool { p.category == category });
  };

  // Admin write
  public shared ({ caller }) func addProduct(
    name : Text,
    description : Text,
    price : Float,
    stock : Nat,
    category : Text,
    imageFile : Text,
  ) : async Product {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let p : Product = {
      id = nextProductId; name; description; price; stock; category; imageFile;
    };
    products.add(nextProductId, p);
    nextProductId += 1;
    p;
  };

  public shared ({ caller }) func updateProduct(
    id : Nat,
    name : Text,
    description : Text,
    price : Float,
    stock : Nat,
    category : Text,
    imageFile : Text,
  ) : async ?Product {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { null };
      case (?_) {
        let updated : Product = { id; name; description; price; stock; category; imageFile };
        products.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func updateProductStock(id : Nat, stock : Nat) : async ?Product {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update product stock");
    };
    switch (products.get(id)) {
      case (null) { null };
      case (?p) {
        let updated : Product = {
          id = p.id; name = p.name; description = p.description;
          price = p.price; stock = stock; category = p.category; imageFile = p.imageFile;
        };
        products.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    switch (products.get(id)) {
      case (null) { false };
      case (?_) {
        products.remove(id); true;
      };
    };
  };

  // ─── Cart ─────────────────────────────────────────────────────────────────

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };
    switch (carts.get(caller)) {
      case (?items) { items };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    let current = switch (carts.get(caller)) {
      case (?items) { items };
      case (null) { [] };
    };
    // Update quantity if already in cart, otherwise append
    let existing = current.find(func(i : CartItem) : Bool { i.productId == productId });
    let updated = switch (existing) {
      case (?item) {
        current.map(func(i : CartItem) : CartItem {
          if (i.productId == productId) { { productId = i.productId; quantity = i.quantity + quantity } }
          else { i };
        });
      };
      case (null) {
        current.concat([{ productId = productId; quantity = quantity }]);
      };
    };
    carts.add(caller, updated);
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their cart");
    };
    let current = switch (carts.get(caller)) {
      case (?items) { items };
      case (null) { [] };
    };
    let updated = if (quantity == 0) {
      current.filter(func(i : CartItem) : Bool { i.productId != productId });
    } else {
      current.map(func(i : CartItem) : CartItem {
        if (i.productId == productId) { { productId = i.productId; quantity = quantity } }
        else { i };
      });
    };
    carts.add(caller, updated);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };
    let current = switch (carts.get(caller)) {
      case (?items) { items };
      case (null) { [] };
    };
    let updated = current.filter(func(i : CartItem) : Bool { i.productId != productId });
    carts.add(caller, updated);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear their cart");
    };
    carts.add(caller, []);
  };

  // ─── Wishlist ─────────────────────────────────────────────────────────────

  public query ({ caller }) func getWishlist() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their wishlist");
    };
    switch (wishlists.get(caller)) {
      case (?items) { items };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addToWishlist(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to wishlist");
    };
    let current = switch (wishlists.get(caller)) {
      case (?items) { items };
      case (null) { [] };
    };
    if (current.find(func(id : Nat) : Bool { id == productId }).isSome()) {
      Runtime.trap("Product already in wishlist");
    };
    wishlists.add(caller, current.concat([productId]));
  };

  public shared ({ caller }) func removeFromWishlist(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from wishlist");
    };
    let current = switch (wishlists.get(caller)) {
      case (?items) { items };
      case (null) { [] };
    };
    let updated = current.filter(func(id : Nat) : Bool { id != productId });
    wishlists.add(caller, updated);
  };

  // ─── Orders ───────────────────────────────────────────────────────────────

  public shared ({ caller }) func createOrder(items : [CartItem], total : Float) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    let o : Order = {
      id = nextOrderId;
      userId = caller;
      items = items;
      total = total;
      status = #pending;
      createdAt = Time.now();
    };
    orders.add(nextOrderId, o);
    nextOrderId += 1;
    // Clear cart after order
    carts.add(caller, []);
    o;
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };
    let all = orders.values().toArray();
    all.filter(func(o : Order) : Bool { o.userId == caller });
  };

  public query ({ caller }) func getOrder(id : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    switch (orders.get(id)) {
      case (null) { null };
      case (?o) {
        // Users can only see their own orders; admins can see all
        if (o.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot view another user's order");
        };
        ?o;
      };
    };
  };

  // Admin: list all orders
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list all orders");
    };
    orders.values().toArray();
  };

  // Admin: update order status
  public shared ({ caller }) func updateOrderStatus(id : Nat, status : OrderStatus) : async ?Order {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(id)) {
      case (null) { null };
      case (?o) {
        let updated : Order = {
          id = o.id;
          userId = o.userId;
          items = o.items;
          total = o.total;
          status = status;
          createdAt = o.createdAt;
        };
        orders.add(id, updated);
        ?updated;
      };
    };
  };

  // ─── Contact Form ─────────────────────────────────────────────────────────

  // Anyone (including guests) can submit a contact message
  public shared func submitContactMessage(name : Text, email : Text, message : Text) : async Nat {
    let msg : ContactMessage = { name; email; message };
    contactMessages.add(nextContactId, msg);
    let id = nextContactId;
    nextContactId += 1;
    id;
  };

  // Admin: read contact messages
  public query ({ caller }) func getContactMessages() : async [(Nat, ContactMessage)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can read contact messages");
    };
    contactMessages.entries().toArray();
  };

  // ─── Admin Dashboard ──────────────────────────────────────────────────────

  public type DashboardStats = {
    totalUsers : Nat;
    totalProducts : Nat;
    totalOrders : Nat;
    totalSales : Float;
  };

  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view dashboard stats");
    };
    let allOrders = orders.values().toArray();
    var totalSales : Float = 0.0;
    for (o in allOrders.values()) {
      totalSales += o.total;
    };
    {
      totalUsers = userProfiles.size();
      totalProducts = products.size();
      totalOrders = allOrders.size();
      totalSales = totalSales;
    };
  };

  // ─── Role assignment (admin only, guarded inside AccessControl) ───────────

  public shared ({ caller }) func assignUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // AccessControl.assignRole already enforces admin-only internally,
    // but we add an explicit guard for clarity.
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };
    AccessControl.assignRole(accessControlState, caller, user, role);
  };
};
