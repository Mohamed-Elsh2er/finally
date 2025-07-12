import React, { useContext, useEffect } from 'react';
import { CartContext } from '../../context/CartContextProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Cart() {
  const navigate = useNavigate();
  const {
    getCart,
    products,
    updateCartItemQuantity,
    removeCartItem,
  } = useContext(CartContext);

  useEffect(() => {
    getCart();
  }, []);

  const deleteAllProducts = async () => {
    if (products.length > 0) {
      const confirmDelete = window.confirm('⚠️ Are you sure you want to delete all products?');
      if (confirmDelete) {
        for (let item of products) {
          await removeCartItem(item.product._id);
        }
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-700 font-semibold">
          Total Items: {products.reduce((sum, p) => sum + p.count, 0)}
        </p>

        <p className="text-gray-700 font-semibold">
          Total Price: ${products.reduce((sum, p) => sum + (p.price * p.count), 0)}
        </p>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-2 px-5 rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105"
        >
          Payment
        </button>
        <button
          onClick={deleteAllProducts}
          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-2 px-5 rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105"
        >
          Delete All Products
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-16 py-3"><span className="sr-only">Image</span></th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Qty</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id} className="bg-white border-b hover:bg-gray-50">
                <td className="p-4">
                  <img
                    src={product.product.imageCover || 'https://via.placeholder.com/300x300?text=No+Image'}
                    className="w-16 md:w-32 max-w-full max-h-full"
                    alt={product.product.title || 'Product'}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
                    }}
                  />
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {product.product.title}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <button
                      className="text-white bg-red-500 hover:bg-red-600 rounded-full px-2 py-1 text-sm"
                      onClick={() => {
                        const newCount = Number(product.count || 0) - 1;
                        if (newCount >= 1) {
                          updateCartItemQuantity(product.product._id, newCount);
                        }
                      }}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="1"
                      placeholder={product.count || 1}
                      value={Number(product.count) || 1}
                      onChange={(e) => {
                        const value = Math.max(1, parseInt(e.target.value) || 1);
                        updateCartItemQuantity(product.product._id, value);
                      }}
                      className="w-16 text-center mx-2 border border-gray-300 rounded-md py-1"
                    />

                    <button
                      className="text-white bg-green-500 hover:bg-green-600 rounded-full px-2 py-1 text-sm"
                      onClick={() => {
                        const newCount = Number(product.count || 0) + 1;
                        updateCartItemQuantity(product.product._id, newCount);
                      }}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  ${product.price * product.count}
                  <span className="text-sm text-gray-500"> (${product.price} each)</span>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md"
                    onClick={() => {
                      removeCartItem(product.product._id);
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
