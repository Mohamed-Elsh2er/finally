import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fortawesome/fontawesome-free/css/all.min.css"
import './index.css'
import App from './App.jsx'
import AuthContextProvider from './context/AuthContextProvider.jsx'
import CartContextProvider from './context/CartContextProvider.jsx'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById('root')).render(
  
    <StrictMode>
    <AuthContextProvider>
      <CartContextProvider>
      <App />
    </CartContextProvider>
    </AuthContextProvider>
  </StrictMode>
)
