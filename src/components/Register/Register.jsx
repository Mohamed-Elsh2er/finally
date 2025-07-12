import React, { useState, useContext } from 'react'
import Style from './Register.module.css'
import { useFormik } from 'formik';
import * as Yup from 'yup'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/AuthContextProvider';

export default function Register() {
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useContext(authContext);

  async function handledRegister(values) {
    setMessage(null);
    setStatus(null);
    setLoading(true);
    try {
      const res = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', values);
      
      if (res.data.token) setToken(res.data.token);
            localStorage.setItem('userToken', res.data.token); 

      setMessage('Registration successful! Redirecting to login...');
      setStatus('success');
      setTimeout(() => {
        setLoading(false);
        navigate('/home');
      }, 100); 
    } catch (error) {
      setLoading(false);
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
      setStatus('error');
    }
  }

  const register = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      rePassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
      phone: Yup.string().required('Phone is required')
    }),
    onSubmit: handledRegister,
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
        <h2 className="text-3xl font-bold mb-8 text-green-700 uppercase tracking-wider">register now</h2>
        <form
          onSubmit={register.handleSubmit}
          className="w-4/5 2xl:w-4/5 xl:w-4/5 lg:w-4/5 md:w-4/5 sm:w-4/5 max-w-4xl bg-white p-8 rounded-lg shadow-md mx-auto"
        >
          {message && (
            <div className={`mb-4 p-3 rounded ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
              First name
            </label>
            <input
              name='name'
              value={register.values.name}
              onChange={register.handleChange}
              onBlur={register.handleBlur}
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="YOUR"
            />
            {register.touched.name && register.errors.name && (
              <div className="text-red-500 text-xs mt-1">mandatory</div>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Email address
            </label>
            <input
              name='email'
              value={register.values.email}
              onChange={register.handleChange}
              onBlur={register.handleBlur}
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="YOUR.doe@company.com"
            />
            {register.touched.email && register.errors.email && (
              <div className="text-red-500 text-xs mt-1">mandatory</div>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              name='password'
              value={register.values.password}
              onChange={register.handleChange}
              onBlur={register.handleBlur}
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="•••••••••"
            />
            {register.touched.password && register.errors.password && (
              <div className="text-red-500 text-xs mt-1">mandatory</div>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="rePassword" className="block mb-2 text-sm font-medium text-gray-900">
              Confirm password
            </label>
            <input
              name='rePassword'
              value={register.values.rePassword}
              onChange={register.handleChange}
              onBlur={register.handleBlur}
              type="password"
              id="rePassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="•••••••••"
            />
            {register.touched.rePassword && register.errors.rePassword && (
              <div className="text-red-500 text-xs mt-1">mandatory</div>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
              Phone number
            </label>
            <input
              name='phone'
              value={register.values.phone}
              onChange={register.handleChange}
              onBlur={register.handleBlur}
              type="tel"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="123-45-678"
            />
            {register.touched.phone && register.errors.phone && (
              <div className="text-red-500 text-xs mt-1">mandatory</div>
            )}
          </div>
          <button
            type="submit"
            className={`
              mt-8 w-full border border-green-700 font-bold rounded-lg text-lg px-5 py-2.5 transition
              ${register.values.name && register.values.email && register.values.password && register.values.rePassword && register.values.phone
                ? 'bg-[#4fa74f] text-white hover:bg-green-700'
                : 'bg-white text-[#4fa74f]'}
              ${register.values.name && register.values.email && register.values.password && register.values.rePassword && register.values.phone
                ? ''
                : 'opacity-60 cursor-not-allowed'}
            `}
            disabled={
              !register.values.name ||
              !register.values.email ||
              !register.values.password ||
              !register.values.rePassword ||
              !register.values.phone
            }
          >
            Register Now
          </button>
        </form>
        {loading && (
          <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </>
  );
}
