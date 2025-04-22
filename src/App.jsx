import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router'
import RootLayout from './layout/RootLayout'
import { EmailVerification, SignIn, SignUp } from './features/auth'
import { ProductList } from './features/products'
import { CartList } from './features/cart'
import { Hero } from './features/hero'
import ProtectedLayout from './layout/ProtectedLayout'
import PublicLayout from './layout/PublicLayout'

const App = () => {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route element={<RootLayout/>}>
      <Route path='/' element={<Hero/>}/>
      <Route element={<ProtectedLayout/>}>
        <Route path='/products' element={<ProductList/>}/>
        <Route path='/cart' element={<CartList/>}/>
      </Route>
      <Route element={<PublicLayout/>}>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/email-verification' element={<EmailVerification/>}/>
      </Route>{/* 🔥 Catch-all for unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />


    </Route>
  ))
  return (
    <RouterProvider router={router}/>
  )
}

export default App