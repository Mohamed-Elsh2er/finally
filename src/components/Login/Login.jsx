import React, { useContext, useState } from 'react'
import Style from './Login.module.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { authContext } from '../../context/AuthContextProvider';

export default function Login() {
  const { setToken } = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    validationSchema,
    onSubmit: handleLogin
  });

  async function handleLogin(values) {
    setMessage(null);
    setStatus(null);
    setLoading(true);

    try {
      const res = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin', {
        email: values.email,
        password: values.password
      });
      setToken(res.data.token); 
      localStorage.setItem('userToken', res.data.token); 
      setStatus('success');
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 100);
    } catch (error) {
      setLoading(false);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  }

  const [showResetForm, setShowResetForm] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStep, setResetStep] = useState(1);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  function validateResetPassword() {
    if (!newPassword) return 'New password is required.';
    if (!passwordRules.test(newPassword)) return 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
    if (newPassword !== confirmPassword) return 'Passwords do not match.';
    return '';
  }

  async function handleForgotPassword() {
    setForgotMsg(null);
    setForgotLoading(true);
    try {
      await axios.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', {
        email: formik.values.email
      });
      setForgotMsg('Password reset code sent to your email. Please check your inbox.');
      setResetStep(2);
    } catch (error) {
      setForgotMsg(error.response?.data?.message || 'Failed to send reset instructions.');
    }
    setForgotLoading(false);
  }

  async function handleVerifyResetCode() {
    setForgotMsg(null);
    setForgotLoading(true);
    try {
      await axios.post('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', {
        resetCode: resetCode
      });
      setForgotMsg('Code verified successfully. Please enter your new password.');
      setResetStep(3);
    } catch (error) {
      setForgotMsg(error.response?.data?.message || 'Invalid reset code.');
    }
    setForgotLoading(false);
  }

  async function handleResetPassword() {
    if (newPassword !== confirmPassword) {
      setForgotMsg('Passwords do not match.');
      return;
    }
    
    setForgotMsg(null);
    setForgotLoading(true);
    try {
      await axios.put('https://ecommerce.routemisr.com/api/v1/auth/resetPassword', {
        email: formik.values.email,
        newPassword: newPassword
      });
      setForgotMsg('Password reset successfully! You can now login with your new password.');
      setResetStep(1);
      setShowResetForm(false);
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setForgotMsg(error.response?.data?.message || 'Failed to reset password.');
    }
    setForgotLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
      <h2 className="text-3xl font-bold mb-8 text-green-700 uppercase tracking-wider">login</h2>
      <form
        onSubmit={formik.handleSubmit}
        className="w-4/5 2xl:w-4/5 xl:w-4/5 lg:w-4/5 md:w-4/5 sm:w-4/5 max-w-4xl bg-white p-8 rounded-lg shadow-md mx-auto"
      >
        {message && (
          <div className={`mb-4 p-3 rounded ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@flowbite.com"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-xs mt-1">mandatory</div>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="your"
          />
          {formik.touched.username && formik.errors.username && (
            <div className="text-red-500 text-xs mt-1">mandatory</div>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="•••••••••"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-xs mt-1">mandatory</div>
          )}
        </div>
        <button
          type="submit"
          className={`
            mt-8 w-full border border-green-700 font-bold rounded-lg text-lg px-5 py-2.5 transition
            ${formik.values.email && formik.values.username && formik.values.password
              ? 'bg-[#4fa74f] text-white hover:bg-green-700'
              : 'bg-white text-[#4fa74f]'}
            ${formik.values.email && formik.values.username && formik.values.password
              ? ''
              : 'opacity-60 cursor-not-allowed'}
          `}
          disabled={
            !formik.values.email ||
            !formik.values.username ||
            !formik.values.password
          }
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setShowResetForm(!showResetForm)}
          className="mt-4 w-full border border-green-700 rounded-lg text-lg px-5 py-2.5 transition bg-white text-green-700 hover:bg-green-50"
        >
          Forgot Password?
        </button>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account?</span>
          <button type="button" className="ml-2 text-[var(--accent)] underline" onClick={() => navigate('/register')}>
            Register
          </button>
        </div>

        {showResetForm && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reset Password</h3>
            
            {resetStep === 1 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your email address to receive a reset code.
                </p>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={!formik.values.email || forgotLoading}
                  className={`
                    w-full border border-green-700 rounded-lg px-4 py-2 transition
                    bg-green-700 text-white hover:bg-green-800
                    ${!formik.values.email || forgotLoading ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </div>
            )}

            {resetStep === 2 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the reset code sent to your email.
                </p>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter reset code"
                  className="w-full mb-4 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 p-2.5"
                />
                <button
                  type="button"
                  onClick={handleVerifyResetCode}
                  disabled={!resetCode || forgotLoading}
                  className={`
                    w-full border border-green-700 rounded-lg px-4 py-2 transition
                    bg-green-700 text-white hover:bg-green-800
                    ${!resetCode || forgotLoading ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                >
                  {forgotLoading ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>
            )}

            {resetStep === 3 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your new password.
                </p>
                <div className="relative mb-4">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 p-2.5"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-2 text-gray-500 text-xs"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative mb-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 p-2.5"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-2 text-gray-500 text-xs"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {validateResetPassword() && (
                  <div className="text-red-500 text-xs mb-2">{validateResetPassword()}</div>
                )}
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={!newPassword || !confirmPassword || forgotLoading || !!validateResetPassword()}
                  className={`
                    w-full border border-green-700 rounded-lg px-4 py-2 transition
                    bg-green-700 text-white hover:bg-green-800
                    ${!newPassword || !confirmPassword || forgotLoading || !!validateResetPassword() ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                >
                  {forgotLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            )}

            {forgotMsg && (
              <div className={`mt-4 p-3 rounded text-center text-sm ${
                forgotMsg.includes('successfully') || forgotMsg.includes('verified') 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {forgotMsg}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setShowResetForm(false);
                setResetStep(1);
                setResetCode('');
                setNewPassword('');
                setConfirmPassword('');
                setForgotMsg(null);
              }}
              className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
