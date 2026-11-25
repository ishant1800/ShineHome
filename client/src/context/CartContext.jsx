import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'shinehome_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(window.__shineToastTimer);
    window.__shineToastTimer = window.setTimeout(() => setToast(null), 2600);
  }

  function addToCart(product, quantity = 1) {
    if (!product) return;
    const qty = Math.max(1, Number(quantity) || 1);
    setItems((prev) => {
      const idx = prev.findIndex((i) => i._id === product._id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty };
        return updated;
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          department: product.department,
          category: product.category,
          style: product.style,
          quantity: qty,
        },
      ];
    });
    showToast(`Added "${product.name}" to your bag`);
  }

  function updateQuantity(productId, delta) {
    setItems((prev) =>
      prev
        .map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((item) => item._id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = Number(items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2));
  const shipping = items.length === 0 ? 0 : subtotal >= 1000 ? 0 : 45;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        shipping,
        tax,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
