import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'

import Home from './Home'
import Dashboard from './Dashboard'
import Products from './Products'
import Orders from './Orders'
import Insights from './Insights'
import Login from './Login'

export default function App() {
  return (
    <div>
      {/* DEBUG: confirm React is mounting */}
      <h1 className="text-2xl font-bold mb-4">🚀 App is mounted!</h1>

      <BrowserRouter>
        <nav className="bg-white shadow p-4 flex space-x-6">
          <Link to="/"          className="text-indigo-600 font-semibold">Home</Link>
          <Link to="/dashboard" className="hover:text-indigo-500">Dashboard</Link>
          <Link to="/products"  className="hover:text-indigo-500">Products</Link>
          <Link to="/orders"    className="hover:text-indigo-500">Orders</Link>
          <Link to="/insights"  className="hover:text-indigo-500">Insights</Link>
          <Link to="/login"     className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded">
            Log In
          </Link>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products"  element={<Products />} />
            <Route path="/orders"    element={<Orders />} />
            <Route path="/insights"  element={<Insights />} />
            <Route path="/login"     element={<Login />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}
