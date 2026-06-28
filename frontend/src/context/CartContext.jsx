import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, weight = null) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item._id === product._id &&
          (!weight || (item.weight && item.weight.weight === weight.weight))
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success('Cart updated!');
        return updatedItems;
      } else {
        const newItem = {
          ...product,
          quantity,
          weight,
          price: weight ? weight.price : product.price,
        };
        toast.success('Added to cart!');
        return [...prevItems, newItem];
      }
    });
  };

  const buyNow = (product, quantity = 1, weight = null, navigate) => {
    // Add product to cart
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item._id === product._id &&
          (!weight || (item.weight && item.weight.weight === weight.weight))
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success('Item added to cart!');
        return updatedItems;
      } else {
        const newItem = {
          ...product,
          quantity,
          weight,
          price: weight ? weight.price : product.price,
        };
        toast.success('Proceeding to checkout!');
        return [...prevItems, newItem];
      }
    });
    
    // Navigate to checkout
    if (navigate) {
      setTimeout(() => {
        navigate('/checkout');
      }, 500);
    }
  };

  const removeFromCart = (productId, weight = null) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter(
        (item) =>
          !(
            item._id === productId &&
            (!weight || (item.weight && item.weight.weight === weight.weight))
          )
      );
      toast.success('Item removed from cart');
      return updatedItems;
    });
  };

  const updateQuantity = (productId, quantity, weight = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }

    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (
          item._id === productId &&
          (!weight || (item.weight && item.weight.weight === weight.weight))
        ) {
          return { ...item, quantity };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.weight ? item.weight.price : item.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    buyNow,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
