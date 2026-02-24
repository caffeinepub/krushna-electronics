import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    imageFile: string;
    name: string;
    description: string;
    stock: bigint;
    category: string;
    price: number;
}
export interface Category {
    id: bigint;
    name: string;
}
export interface ContactMessage {
    name: string;
    email: string;
    message: string;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface DashboardStats {
    totalProducts: bigint;
    totalOrders: bigint;
    totalSales: number;
    totalUsers: bigint;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    total: number;
    userId: Principal;
    createdAt: bigint;
    items: Array<CartItem>;
}
export interface UserProfile {
    name: string;
    role: string;
    email: string;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(name: string): Promise<Category>;
    addProduct(name: string, description: string, price: number, stock: bigint, category: string, imageFile: string): Promise<Product>;
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    addToWishlist(productId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createOrder(items: Array<CartItem>, total: number): Promise<Order>;
    deleteCategory(id: bigint): Promise<boolean>;
    deleteProduct(id: bigint): Promise<boolean>;
    getAllOrders(): Promise<Array<Order>>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getCategories(): Promise<Array<Category>>;
    getCategory(id: bigint): Promise<Category | null>;
    getContactMessages(): Promise<Array<[bigint, ContactMessage]>>;
    getDashboardStats(): Promise<DashboardStats>;
    getMyOrders(): Promise<Array<Order>>;
    getOrder(id: bigint): Promise<Order | null>;
    getProduct(id: bigint): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(): Promise<Array<bigint>>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCart(productId: bigint): Promise<void>;
    removeFromWishlist(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactMessage(name: string, email: string, message: string): Promise<bigint>;
    updateCartItem(productId: bigint, quantity: bigint): Promise<void>;
    updateCategory(id: bigint, name: string): Promise<Category | null>;
    updateOrderStatus(id: bigint, status: OrderStatus): Promise<Order | null>;
    updateProduct(id: bigint, name: string, description: string, price: number, stock: bigint, category: string, imageFile: string): Promise<Product | null>;
    updateProductStock(id: bigint, stock: bigint): Promise<Product | null>;
}
