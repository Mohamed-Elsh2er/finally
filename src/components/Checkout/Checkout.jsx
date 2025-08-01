import React, { useContext, useEffect, useState } from 'react';
import Style from './Checkout.module.css';
import axios from 'axios';
import { CartContext } from '../../context/CartContextProvider';

export default function Checkout() {
  const { cartId } = useContext(CartContext);

  const [address, setAddress] = useState({
    details: '',
    phone: '',
    city: '',
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCOD = async () => {
    try {
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
        { shippingAddress: address },
        {
          headers: {
            token: localStorage.getItem('userToken'),
          },
        }
      );
      alert('✅ Order placed successfully with COD!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to place order.');
    }
  };

  const handleStripe = async () => {
    try {
      const { data } = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:3000`,
        {
          headers: {
            token: localStorage.getItem('userToken'),
          },
        }
      );
      window.location.href = data.session.url;
    } catch (err) {
      console.error(err);
      alert('❌ Failed to start payment session.');
    }
  };

  return (
    <div className={`${Style.checkoutWrapper} container mx-auto py-10`}>
      <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <input
          type="text"
          name="details"
          placeholder="Address Details"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          value={address.details}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          value={address.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          value={address.city}
          onChange={handleChange}
          required
        />

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleCOD}
            className="w-1/2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-2 rounded-lg"
          >
            Cash on Delivery
          </button>
          <button
            type="button"
            onClick={handleStripe}
            className="w-1/2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-2 rounded-lg"
          >
            Pay with Card
          </button>
        </div>
      </form>
    </div>
  );
}
