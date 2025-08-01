import React, { useEffect, useState, useContext } from 'react';
import Style from './ProductDetails.module.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContextProvider';
import { WishListContext } from '../../context/WishListContextProvider';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  let { id } = useParams();
  const [productDetails, setProductDetails] = useState();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlist } = useContext(WishListContext);

  async function getProductDetails(id) {
    setLoading(true);
    let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
    console.log('Product Details:', data);
    setProductDetails(data.data);
    setLoading(false);
  }

  async function getRelatedProducts(categoryName) {
    let { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
    console.log('API response:', data.data);
    const newProducts = data.data.filter(product => product.category.name === categoryName);
    setRelatedProducts(newProducts);
  }

  useEffect(() => {
    getProductDetails(id);
  }, [id]);

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

  useEffect(() => {
    if (productDetails?.category?.name) {
      getRelatedProducts(productDetails.category.name);
    }
  }, [productDetails]);

  if (loading || !productDetails) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className='grid grid-cols-[1fr_2fr] gap-3 items-center p-5'>
        <div>
          <img 
            src={productDetails?.imageCover || 'https://via.placeholder.com/400x400?text=No+Image'} 
            alt={productDetails?.title || 'Product'} 
            className='w-full h-[400px] object-cover rounded-lg'
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'
            }}
          />
        </div>
        <div>
          <h2 className='text-2xl font-bold'>{productDetails?.title}</h2>
          <p className='text-secondary'>{productDetails?.category?.name}</p>
          <p className='text-secondary mt-2'>{productDetails?.description}</p>
          <p className='text-lg font-semibold mt-2'>{productDetails?.price} EGP</p>
          <p className='text-red-500 mt-2'>
            {productDetails?.priceAfterDiscount ? `Discounted Price: ${productDetails?.priceAfterDiscount} EGP` : 'No Discount'}
          </p>
          <p className='text-secondary mt-2'>
            Rating: <i className="fa-solid fa-star text-yellow-400"></i> {productDetails?.ratingsAverage} ({productDetails?.ratingsQuantity} reviews)
          </p>
        </div>
        <div></div>
        <div className="flex gap-4">
          <button 
            onClick={async () => {
              let flag = await addToCart(productDetails._id);
              if (flag) {
                toast.success('Product added to cart successfully');
              } else {
                toast.error('Failed to add product to cart');
              }
            }}
            className='mt-4 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition flex items-center'
          >
            <i className="fas fa-shopping-cart mr-2"></i>
            Add to Cart
          </button>
          <button 
            onClick={async () => {
              const inWishlist = isInWishlist(productDetails._id);
              let flag;
              
              if (inWishlist) {
                flag = await removeFromWishlist(productDetails._id);
                if (flag) {
                  toast.success('Product removed from wishlist');
                } else {
                  toast.error('Failed to remove product from wishlist');
                }
              } else {
                flag = await addToWishlist(productDetails._id);
                if (flag) {
                  toast.success('Product added to wishlist');
                } else {
                  toast.error('Failed to add product to wishlist');
                }
              }
            }}
            className={`mt-4 px-6 py-3 rounded-lg transition flex items-center ${
              isInWishlist(productDetails._id) 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <i className={`fa-heart mr-2 ${isInWishlist(productDetails._id) ? 'fas' : 'far'}`}></i>
            {isInWishlist(productDetails._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold mb-3">Related Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map(product => (
             <div
            className="cursor-pointer group overflow-hidden shadow p-3 pb-12 relative group transition-transform duration-300 border border-transparent hover:border-green-500 rounded-lg hover:scale-105"
            key={product._id}
          >
            <Link to={`/productDetails/${product._id}`}>
            <img
              src={product.imageCover || 'https://via.placeholder.com/300x300?text=No+Image'}
              alt={product.title || 'Product'}
              className="w-48 h-48 object-cover mx-auto rounded"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
              }}
            />
            <h3 className="mt-2 text-sm text-gray-500">{product.category?.name || 'Unknown Category'}</h3>
            <h3 className="font-bold text-base mb-2">{product.title ? product.title.split(" ", 2).join(" ") : 'Untitled Product'}</h3>
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
                const inWishlist = isInWishlist(product._id);
                if (inWishlist) {
                  removeFromWishlist(product._id);
                } else {
                  addToWishlist(product._id);
                }
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
            <div className="flex gap-2 absolute bottom-4 left-1/2 -translate-x-1/2">
              <button
                onClick={async () => {
                  let flag = await addToCart(product._id);
                  if (flag) {
                    toast.success('Product added to cart successfully');
                  } else {
                    toast.error('Failed to add product to cart');
                  }
                }}
                className="group-hover:translate-y-0 translate-y-[200%] group-hover:opacity-100 opacity-0 transition duration-500 ease-out bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-2 rounded shadow-lg text-sm"
              >
                Add to Cart
              </button>
              <button
                onClick={async () => {
                  const inWishlist = isInWishlist(product._id);
                  let flag;
                  
                  if (inWishlist) {
                    flag = await removeFromWishlist(product._id);
                    if (flag) {
                      toast.success('Product removed from wishlist');
                    } else {
                      toast.error('Failed to remove product from wishlist');
                    }
                  } else {
                    flag = await addToWishlist(product._id);
                    if (flag) {
                      toast.success('Product added to wishlist');
                    } else {
                      toast.error('Failed to add product to wishlist');
                    }
                  }
                }}
                className={`group-hover:translate-y-0 translate-y-[200%] group-hover:opacity-100 opacity-0 transition duration-500 ease-out font-semibold px-3 py-2 rounded shadow-lg text-sm ${
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
    </>
  );
}
