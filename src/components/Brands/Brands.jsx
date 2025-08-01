import React, { useEffect, useState, useContext } from 'react'
import Style from './Brands.module.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { CartContext } from '../../context/CartContextProvider'
import { WishListContext } from '../../context/WishListContextProvider'
import toast from 'react-hot-toast'

export default function Brands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [brandProducts, setBrandProducts] = useState([])
  const [error, setError] = useState(null)
  const { addToCart } = useContext(CartContext)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishListContext)

  async function getBrands() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/brands')
      if (data && data.data) {
        setBrands(data.data)
      } else {
        setBrands([])
        setError('No brands data received')
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
      setError('Failed to load brands')
      setBrands([])
      toast.error('Failed to load brands')
    }
    setLoading(false)
  }

  async function getBrandProducts(brandId) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products?brand=${brandId}`)
      if (data && data.data) {
        setBrandProducts(data.data)
        setSelectedBrand(brandId)
      } else {
        setBrandProducts([])
        setError('No products found for this brand')
      }
    } catch (error) {
      console.error('Error fetching brand products:', error)
      setError('Failed to load brand products')
      setBrandProducts([])
      toast.error('Failed to load brand products')
    }
    setLoading(false)
  }

  async function addToCartProduct(id) {
    let flag = await addToCart(id)
    if (flag) {
      toast.success('Product added to cart successfully')
    } else {
      toast.error('Failed to add product to cart')
    }
  }

  async function toggleWishlist(id) {
    const inWishlist = isInWishlist(id)
    let flag
    
    if (inWishlist) {
      flag = await removeFromWishlist(id)
      if (flag) {
        toast.success('Product removed from wishlist')
      } else {
        toast.error('Failed to remove product from wishlist')
      }
    } else {
      flag = await addToWishlist(id)
      if (flag) {
        toast.success('Product added to wishlist')
      } else {
        toast.error('Failed to add product to wishlist')
      }
    }
  }

  useEffect(() => {
    getBrands()
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error && brands.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Brands</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={getBrands}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Shop by Brands</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore products from your favorite brands. Quality and style guaranteed!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {brands.map((brand) => (
            <div
              key={brand._id}
              onClick={() => getBrandProducts(brand._id)}
              className={`brand-card cursor-pointer group relative overflow-hidden rounded-xl shadow-lg border transition-all duration-300 transform hover:scale-105 ${
                selectedBrand === brand._id ? 'ring-4 ring-purple-500' : ''
              }`}
            >
              <div className="aspect-square bg-[var(--card-bg)] flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-gray-100">
                    <img
                      src={brand.image || 'https://via.placeholder.com/100x100?text=Brand'}
                      alt={brand.name}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=Brand';
                      }}
                    />
                  </div>
                  <h3 className="text-primary font-semibold text-sm md:text-base">
                    {brand.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedBrand && brandProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Products from {brands.find(b => b._id === selectedBrand)?.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {brandProducts.map((product) => (
                <div
                  key={product._id}
                  className="cursor-pointer group overflow-hidden shadow-lg p-4 pb-16 relative transition-transform duration-300 border border-transparent hover:border-purple-500 rounded-xl hover:scale-105 bg-white"
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
                    <h3 className="mt-3 text-sm text-gray-500">{product.brand?.name || 'Unknown Brand'}</h3>
                    <h3 className="font-bold text-base mb-2 line-clamp-2">{product.title || 'Untitled Product'}</h3>
                    <div className="flex justify-between items-center mb-2">
                      {product.priceAfterDiscount ? (
                        <>
                          <p className="text-red-500 line-through text-sm">{product.price} EGP</p>
                          <p className="font-bold text-purple-600">{product.priceAfterDiscount} EGP</p>
                        </>
                      ) : (
                        <p className="font-bold text-purple-600">{product.price} EGP</p>
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
                    onClick={(e) => {
                      e.preventDefault()
                      toggleWishlist(product._id)
                    }}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                      isInWishlist(product._id) 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                    } shadow-lg`}
                  >
                    <i className={`fa-heart ${isInWishlist(product._id) ? 'fas' : 'far'}`}></i>
                  </button>

                  <div className="flex gap-2 absolute bottom-4 left-1/2 -translate-x-1/2">
                    <button 
                      onClick={() => addToCartProduct(product._id)}
                      className="group-hover:translate-y-0 translate-y-[200%] group-hover:opacity-100 opacity-0 transition duration-500 ease-out bg-purple-500 hover:bg-purple-600 text-white font-semibold px-3 py-2 rounded-lg shadow-lg text-sm"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => toggleWishlist(product._id)}
                      className={`group-hover:translate-y-0 translate-y-[200%] group-hover:opacity-100 opacity-0 transition duration-500 ease-out font-semibold px-3 py-2 rounded-lg shadow-lg text-sm ${
                        isInWishlist(product._id) 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-gray-500 hover:bg-gray-600 text-white'
                      }`}
                    >
                      {isInWishlist(product._id) ? 'Remove' : 'Wishlist'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedBrand && brandProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="fas fa-box-open text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">This brand doesn't have any products yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
