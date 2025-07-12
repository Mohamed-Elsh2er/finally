import axios from 'axios';
import React, { createContext, useState } from 'react';

export const WishListContext = createContext();

export default function WishListContextProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [numOfWishlistItems, setNumOfWishlistItems] = useState(0);

  async function addToWishlist(productId) {
    try {
      await axios.post(
        'https://ecommerce.routemisr.com/api/v1/wishlist',
        { productId },
        {
          headers: {
            token: localStorage.getItem('userToken'),
          },
        }
      );
      await getWishlist();
      return true;
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      return false;
    }
  }

  async function removeFromWishlist(productId) {
    try {
      await axios.delete(
        'https://ecommerce.routemisr.com/api/v1/wishlist/' + productId,
        {
          headers: {
            token: localStorage.getItem('userToken'),
          },
        }
      );
      await getWishlist();
      return true;
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      return false;
    }
  }

  async function getWishlist() {
    try {
      const response = await axios.get('https://ecommerce.routemisr.com/api/v1/wishlist', {
        headers: {
          token: localStorage.getItem('userToken'),
        },
      });
      setWishlistItems(response.data.data);
      setNumOfWishlistItems(response.data.data.length);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistItems([]);
      setNumOfWishlistItems(0);
      return [];
    }
  }

  function isInWishlist(productId) {
    return wishlistItems.some(item => item._id === productId);
  }

  return (
    <WishListContext.Provider
      value={{
        addToWishlist,
        removeFromWishlist,
        getWishlist,
        wishlistItems,
        numOfWishlistItems,
        isInWishlist
      }}
    >
      {children}
    </WishListContext.Provider>
  );
} 