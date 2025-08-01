import React, { useEffect, useState } from 'react'
import Style from './Layout.module.css'
import Home from '../Home/Home'
import Navbar from '../Navbar/Navbar'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { Outlet } from 'react-router-dom'

export default function Layout() {

    return ( <>
    <Navbar />
<div className="container mx-auto mt-16">

    <Outlet />
</div>
    
    <ThemeToggle />
    </>
)}
