import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FavoritesDrawer from './components/FavoritesDrawer';

import DesignGalleryPage from './pages/DesignGalleryPage';
import CustomizationPage from './pages/CustomizationPage';
import FurniturePage from './pages/FurniturePage';
import AppliancesPage from './pages/AppliancesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';

function AppShell() {
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const { toast } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-cream text-charcoal">
      <Navbar onOpenFavorites={() => setFavoritesOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<DesignGalleryPage />} />
          <Route path="/customize" element={<CustomizationPage />} />
          <Route path="/furniture" element={<FurniturePage />} />
          <Route path="/appliances" element={<AppliancesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      <Footer />

      <FavoritesDrawer open={favoritesOpen} onClose={() => setFavoritesOpen(false)} />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-charcoal px-5 py-3 text-xs font-semibold text-cream shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-terracotta" />
          {toast}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
