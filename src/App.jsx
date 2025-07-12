import { useState, useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/Layout/Layout' 
import Home from './components/Home/Home'
import Cart from './components/Cart/Cart'
import Wish from './components/Wish/Wish'
import Products from './components/Products/Products'
import Categories from './components/Categories/Categories'
import Brands from './components/Brands/Brands'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import NotFoundPage from './components/NotFoundPage/NotFoundPage'
import { createBrowserRouter, createHashRouter, RouterProvider, Navigate } from 'react-router-dom'
import AuthContextProvider, { authContext } from './context/AuthContextProvider'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import ProductDetails from './components/ProductDetails/ProductDetails'
import CartContextProvider from './context/CartContextProvider'
import WishListContextProvider from './context/WishListContextProvider'
import ThemeProvider from './context/ThemeContextProvider'
import Checkout from './components/Checkout/Checkout'
import { Toaster } from 'react-hot-toast'

function App() {
 const router = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      { path: '', element: <AuthRedirect /> }, 
      { path: '/home', element: <ProtectedRoute><Home /></ProtectedRoute> }, 
      { path: 'Cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: 'Wish', element: <ProtectedRoute><Wish /></ProtectedRoute> },
      { path: 'Products', element: <ProtectedRoute><Products /></ProtectedRoute> },
      { path: 'ProductDetails/:id', element: <ProtectedRoute><ProductDetails /></ProtectedRoute> },
      { path: 'Categories', element: <ProtectedRoute><Categories /></ProtectedRoute> },
      { path: 'Brands', element: <ProtectedRoute><Brands /></ProtectedRoute> },
      { path: 'Checkout', element: <ProtectedRoute><Checkout /></ProtectedRoute> },
      { path: 'Login', element: <Login /> },         
      { path: 'Register', element: <Register /> },   
      { path: '*', element: <NotFoundPage /> },
    ]
  }
]);
   return (
  <>
  <ThemeProvider>
  <AuthContextProvider>
<CartContextProvider>
<WishListContextProvider>
    <RouterProvider router={router} />
<Toaster/>
</WishListContextProvider>
</CartContextProvider>
  </AuthContextProvider>
  </ThemeProvider>
  </>
)

}

function AuthRedirect() {
  const { Token, loading } = useContext(authContext);
  if (loading) return <div>Loading...</div>;
  if (Token) return <Navigate to="/home" replace />;
  return <Navigate to="/login" replace />;
}

export default App
