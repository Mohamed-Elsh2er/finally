import React, { useContext, useEffect, useState } from 'react'
import Style from './Navbar.module.css'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'; 
import { authContext } from '../../context/AuthContextProvider';
import { CartContext } from '../../context/CartContextProvider';
import { WishListContext } from '../../context/WishListContextProvider';
export default function Navbar() {
let {Token ,setToken}=useContext(authContext)
let {numOfCartItems} = useContext(CartContext)
let {numOfWishlistItems} = useContext(WishListContext)
let navigate = useNavigate();
function logout() {
  setToken(null);
  localStorage.removeItem('userToken');
  navigate('/login');
}
    return (<>
    <nav className="bg-[var(--navbar-bg)] shadow text-[var(--text-primary)] fixed w-full z-[999] top-0">
  <div className="container mx-auto flex items-center justify-between">
    <div className="flex items-center gap-2 py-2">
      <img src={logo} alt="Logo" className="h-8 w-8" />
      <span className="font-bold text-xl text-[var(--text-primary)]">Fresh Cart</span>
    </div>
    <div className="flex items-center gap-6">
      <Link to="/home" className="hover:text-[var(--accent)] transition">Home</Link>
      <Link to="/Cart" className="hover:text-[var(--accent)] transition flex items-center">
        <i className="fa fa-shopping-cart mr-1"></i> Cart
        {numOfCartItems > 0 && <span className="ml-1 bg-[var(--accent)] text-white rounded-full px-2 text-xs">{numOfCartItems}</span>}
      </Link>
      <Link to="/Wish" className="hover:text-[var(--accent)] transition flex items-center">
        <i className="fa fa-heart mr-1"></i> Wish
        {numOfWishlistItems > 0 && <span className="ml-1 bg-[var(--accent)] text-white rounded-full px-2 text-xs">{numOfWishlistItems}</span>}
      </Link>
      <Link to="/Products" className="hover:text-[var(--accent)] transition">Products</Link>
      <Link to="/Categories" className="hover:text-[var(--accent)] transition">Categories</Link>
      <Link to="/Brands" className="hover:text-[var(--accent)] transition">Brands</Link>
    </div>
    <div>
      {Token ? (
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-xl shadow-md transition">Logout</button>
      ) : null}
    </div>
  </div>
</nav>
    </>)
}
