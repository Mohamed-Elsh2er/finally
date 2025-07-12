import React, { useContext, useEffect, useState } from 'react'
import Style from './DisplayProductss.module.css'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContextProvider';
import { WishListContext } from '../../context/WishListContextProvider';
import toast from 'react-hot-toast';

export default function DisplayProductss() {
  let { addToCart } = useContext(CartContext);
  let { addToWishlist, removeFromWishlist, isInWishlist, getWishlist } = useContext(WishListContext);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  async function grtProducts() {
    setLoading(true);
    setError(null);
    let token = localStorage.getItem('userToken');
    try {
      let { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/products', {
        headers: { token }
      });
      if (data && data.data && Array.isArray(data.data)) {
        setProduct(data.data);
      } else {
        setProduct([]);
        setError('No products data received');
      }
    } catch (err) {
      setProduct([]);
      setError('Failed to fetch products');
      toast.error('Failed to load products');
    }
    setLoading(false);
  }

  async function addToCartProduct(id) {
    let flag = await addToCart(id)
    if (flag) {
      toast.success('Product added to cart successfully');
    } else {
      toast.error('Failed to add product to cart');
    }
  }

  async function toggleWishlist(id) {
    const inWishlist = isInWishlist(id);
    let flag;

    if (inWishlist) {
      flag = await removeFromWishlist(id);
      if (flag) {
        toast.success('Product removed from wishlist');
      } else {
        toast.error('Failed to remove product from wishlist');
      }
    } else {
      flag = await addToWishlist(id);
      if (flag) {
        toast.success('Product added to wishlist');
      } else {
        toast.error('Failed to add product to wishlist');
      }
    }
  }

  useEffect(() => {
    grtProducts();
  }, []);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        await getWishlist();
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    };
    loadWishlist();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && product.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Products</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={grtProducts}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='praent grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {Array.isArray(product) && product.length > 0 ? (
        product.map((product) => (
          <div
            className="card cursor-pointer group overflow-hidden p-3 pb-12 relative rounded-lg transition-all duration-300 bg-white
              border-2 border-white
              outline outline-1 outline-[var(--border)]
              hover:outline-[var(--accent)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]
              hover:scale-[1.03] hover:bg-[rgba(245,245,245,0.5)]"
            key={product._id}
          >
            <Link to={`/productDetails/${product._id}`}>
              <img
                src={product.imageCover || 'https://via.placeholder.com/300x300?text=No+Image'}
                alt={product.title || 'Product'}
                className="w-48 h-48 object-cover mx-auto rounded transition duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
                }}
              />
              <h3 className="mt-2 text-sm text-secondary">{product.category?.name || 'Unknown Category'}</h3>
              <h3 className="font-bold text-base mb-2 text-primary">{product.title ? product.title.split(" ", 2).join(" ") : 'Untitled Product'}</h3>
              <div className='flex justify-between items-center mb-2'>
                {product.priceAfterDiscount ? (
                  <>
                    <p className='text-red-500 line-through'>{product.price} EGP</p>
                    <p className="font-bold">{product.priceAfterDiscount} EGP</p>
                  </>
                ) : (
                  <p className="font-bold">{product.price} EGP</p>
                )}
                <span>
                  {product.ratingsAverage || 0} <i className="fa-solid fa-star text-yellow-400"></i>
                </span>
              </div>
              {product.priceAfterDiscount ? (
                <span className="absolute top-5 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                  SALE
                </span>
              ) : null}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product._id);
                }}
                className={`absolute top-5 right-2 p-2 rounded-full transition-all duration-300 ${
                  isInWishlist(product._id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                } shadow-lg`}
              >
                <i className={`fa-heart ${isInWishlist(product._id) ? 'fas' : 'far'}`}></i>
              </button>
            </Link>
            <div className="flex gap-2 absolute bottom-4 left-1/2 -translate-x-1/2 w-full justify-center">
              <button
                onClick={() => addToCartProduct(product._id)}
                className="group-hover:translate-y-0 translate-y-[200%] group-hover:opacity-100 opacity-0 transition-all duration-500 ease-in-out bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold px-4 py-2 rounded shadow-lg hover:scale-105 hover:shadow-xl"
              >
                Add to Cart
              </button>
              {location.pathname.startsWith('/ProductDetails') && (
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`group-hover:translate-y-0 translate-y-[200%] group-hover:opacity-100 opacity-0 transition-all duration-500 ease-in-out font-semibold px-4 py-2 rounded shadow-lg ${
                    isInWishlist(product._id)
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-500 text-gray-900 hover:text-white'
                  }`}
                >
                  {isInWishlist(product._id) ? 'Remove' : 'Wishlist'}
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <i className="fas fa-box-open text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">No products are available at the moment.</p>
        </div>
      )}
    </div>
  );
}