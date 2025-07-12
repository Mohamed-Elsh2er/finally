import axios from 'axios';
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [numOfCartItems, setnumOfCartItems] = useState(0);
  const [totalCartPrice, settotalCartPrice] = useState(0);
  const [cartId, setCartId] = useState();

  async function addToCart(productId) {
    try {
    
      await getCart();
      const alreadyInCart = products.find(p => p.product._id === productId);

      if (alreadyInCart) {
        const newQuantity = Number(alreadyInCart.quantity) + 1;
        return await updateCartItemQuantity(productId, newQuantity);
      }

   
      await axios.post(
        'https://ecommerce.routemisr.com/api/v1/cart',
        { productId },
        {
          headers: {
            token: localStorage.getItem('userToken'),
          },
        }
      );

      await getCart();
      setCartId(data.data._id);
      return true;
    } catch (error) {
      console.error('Error adding product to cart:', error);
      return false;
    }
  }

  function getCart() {
    return axios
      .get('https://ecommerce.routemisr.com/api/v1/cart', {
        headers: {
          token: localStorage.getItem('userToken'),
        },
      })
      .then((response) => response.data)
      .then((data) => {
        
        const uniqueProducts = [];
        const seen = new Set();
        for (let item of data.data.products) {
          if (!seen.has(item.product._id)) {
            seen.add(item.product._id);
            uniqueProducts.push(item);
          }
        }

        setProducts(uniqueProducts);
        setnumOfCartItems(data.data.numOfCartItems);
        settotalCartPrice(data.data.totalCartPrice);
        return uniqueProducts;
      })
      .catch((error) => {
        console.error('Error fetching cart:', error);
        return [];
      });
  }

  async function updateCartItemQuantity(productId, count) {
    try {
      const response = await axios.put(
        'https://ecommerce.routemisr.com/api/v1/cart/' + productId,
        { count },
        {
          headers: {
            token: localStorage.getItem('userToken'),
          },
        }
      );

      
      const uniqueProducts = [];
      const seen = new Set();
      for (let item of response.data.data.products) {
        if (!seen.has(item.product._id)) {
          seen.add(item.product._id);
          uniqueProducts.push(item);
        }
      }

      setProducts(uniqueProducts);
      setnumOfCartItems(response.data.numOfCartItems);
      settotalCartPrice(response.data.data.totalCartPrice);
      return true;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      return false;
    }
  }

  async function removeCartItem(productId) {
    try {
      const response = await axios.delete(
        'https://ecommerce.routemisr.com/api/v1/cart/' + productId,
        {
          headers: {
            token: localStorage.getItem('userToken'),
          },
        }
      );

      const uniqueProducts = [];
      const seen = new Set();
      for (let item of response.data.data.products) {
        if (!seen.has(item.product._id)) {
          seen.add(item.product._id);
          uniqueProducts.push(item);
        }
      }

      setProducts(uniqueProducts);
      setnumOfCartItems(response.data.numOfCartItems);
      settotalCartPrice(response.data.data.totalCartPrice);
      return true;
    } catch (error) {
      console.error('Error removing product from cart:', error);
      return false;
    }
  }

  return (
    <CartContext.Provider
      value={{
        addToCart,
        getCart,
        products,
        numOfCartItems,
        totalCartPrice,
        updateCartItemQuantity,
        removeCartItem,
        cartId
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
