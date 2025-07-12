import React, { useEffect, useState, useContext } from 'react'
import Style from './Wish.module.css'
import { WishListContext } from '../../context/WishListContextProvider'
import { CartContext } from '../../context/CartContextProvider'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Wish() {
  const { wishlistItems, removeFromWishlist, getWishlist } = useContext(WishListContext)
  const { addToCart } = useContext(CartContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getWishlist()
  }, [])

  async function addToCartProduct(id) {
    let flag = await addToCart(id)
    if (flag) {
      toast.success('Product added to cart successfully')
    } else {
      toast.error('Failed to add product to cart')
    }
  }

  async function removeFromWishlistProduct(id) {
    setLoading(true)
    let flag = await removeFromWishlist(id)
    if (flag) {
      toast.success('Product removed from wishlist')
    } else {
      toast.error('Failed to remove product from wishlist')
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Wishlist</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your saved items that you love. Add them to cart when you're ready to purchase!
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {wishlistItems.map((product) => (
              <div
                key={product._id}
                className="cursor-pointer group overflow-hidden shadow-xl p-4 pb-20 relative transition-transform duration-300 border border-transparent hover:border-red-500 rounded-xl hover:scale-105 bg-white"
              >
                <Link to={`/productDetails/${product._id}`}>
                  <img
                    src={product.imageCover || 'https://via.placeholder.com/300x300?text=No+Image'}
                    alt={product.title || 'Product'}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
                    }}
                  />
                  <h3 className="mt-3 text-sm text-gray-500">{product.category?.name || 'Unknown Category'}</h3>
                  <h3 className="font-bold text-base mb-2 line-clamp-2">{product.title || 'Untitled Product'}</h3>
                  <div className="flex justify-between items-center mb-2">
                    {product.priceAfterDiscount ? (
                      <>
                        <p className="text-red-500 line-through text-sm">{product.price} EGP</p>
                        <p className="font-bold text-red-600">{product.priceAfterDiscount} EGP</p>
                      </>
                    ) : (
                      <p className="font-bold text-red-600">{product.price} EGP</p>
                    )}
                    <span className="text-yellow-500 text-sm">
                      {product.ratingsAverage || 0} <i className="fa-solid fa-star"></i>
                    </span>
                  </div>
                  {product.priceAfterDiscount && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      Sale
                    </span>
                  )}
                </Link>
                
                <button 
                  onClick={() => removeFromWishlistProduct(product._id)}
                  className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 bg-red-500 text-white hover:bg-red-600 shadow-lg"
                >
                  <i className="fas fa-heart"></i>
                </button>

                <div className="flex gap-2 absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button 
                    onClick={() => addToCartProduct(product._id)}
                    className="group-hover:translate-y-0 translate-y-[200%] group-hover:opacity-100 opacity-0 transition duration-500 ease-out bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => removeFromWishlistProduct(product._id)}
                    className="group-hover:translate-y-0 translate-y-[200%] group-hover:opacity-100 opacity-0 transition duration-500 ease-out bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-heart text-5xl text-red-400"></i>
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start adding products to your wishlist by browsing our collection and clicking the heart icon on products you love.
            </p>
            <Link 
              to="/Products"
              className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg"
            >
              <i className="fas fa-shopping-bag mr-2"></i>
              Browse Products
            </Link>
          </div>
        )}

        {wishlistItems.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Actions</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => {
                  wishlistItems.forEach(item => addToCartProduct(item._id))
                }}
                className="flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg"
              >
                <i className="fas fa-cart-plus mr-2"></i>
                Add All to Cart
              </button>
              <button 
                onClick={() => {
                  wishlistItems.forEach(item => removeFromWishlistProduct(item._id))
                }}
                className="flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg"
              >
                <i className="fas fa-trash mr-2"></i>
                Clear Wishlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
