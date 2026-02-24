import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';
import AdminLayout from './components/admin/AdminLayout';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <ProfileSetupModal />
    </div>
  );
}

function AdminLayoutWrapper() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
const shopRoute = createRoute({ getParentRoute: () => rootRoute, path: '/shop', component: Shop });
const productRoute = createRoute({ getParentRoute: () => rootRoute, path: '/product/$id', component: ProductDetails });
const cartRoute = createRoute({ getParentRoute: () => rootRoute, path: '/cart', component: Cart });
const checkoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/checkout', component: Checkout });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: About });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: Contact });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: Login });
const wishlistRoute = createRoute({ getParentRoute: () => rootRoute, path: '/wishlist', component: Wishlist });

const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminLayoutWrapper });
const adminDashboardRoute = createRoute({ getParentRoute: () => adminRoute, path: '/', component: AdminDashboard });
const adminProductsRoute = createRoute({ getParentRoute: () => adminRoute, path: '/products', component: ProductManagement });
const adminUsersRoute = createRoute({ getParentRoute: () => adminRoute, path: '/users', component: UserManagement });
const adminOrdersRoute = createRoute({ getParentRoute: () => adminRoute, path: '/orders', component: OrderManagement });

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  aboutRoute,
  contactRoute,
  loginRoute,
  wishlistRoute,
  adminRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminUsersRoute,
    adminOrdersRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
