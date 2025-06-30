import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'

// Placeholder pages—you'll swap these for real ones soon
function Home() {
  return <h1>Welcome to CrateNexus3PL WMS</h1>
}
function Dashboard() {
  return <h1>Dashboard (protected)</h1>
}
function Products() {
  return <h1>Products</h1>
}
function Orders() {
  return <h1>Orders</h1>
}
function Insights() {
  return <h1>Insights</h1>
}
function Login() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Log In</h2>
      {/* TODO: insert your login form */}
    </div>
  )
}

// Simple guard—checks for a dummy “session=” cookie
function ProtectedRoute({ children }) {
  const isAuthed = document.cookie.includes('session=')
  return isAuthed ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-white shadow p-4 flex space-x-6">
        <Link to="/" className="text-indigo-600 font-semibold">Home</Link>
        <Link to="/dashboard" className="hover:text-indigo-500">Dashboard</Link>
        <Link to="/products" className="hover:text-indigo-500">Products</Link>
        <Link to="/orders" className="hover:text-indigo-500">Orders</Link>
        <Link to="/insights" className="hover:text-indigo-500">Insights</Link>

        {/* YOUR LOGIN LINK */}
        <a
          href="https://app.CrateNexus3PL.com/login"
          className="ml-auto text-red-600 font-medium"
          rel="noopener"
          target="_blank"
        >
          Log In
        </a>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

