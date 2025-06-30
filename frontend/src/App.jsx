import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return <h1 className="text-3xl font-bold">Welcome to Crate Nexus Home</h1>
}

function Dashboard() {
  return <h1 className="text-3xl font-bold">Owner Dashboard (coming soon)</h1>
}

function Products() {
  return <h1 className="text-3xl font-bold">Products Page (coming soon)</h1>
}

function Orders() {
  return <h1 className="text-3xl font-bold">Orders Page (coming soon)</h1>
}

function Insights() {
  return <h1 className="text-3xl font-bold">Insights Dashboard (coming soon)</h1>
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex space-x-6">
        <Link to="/" className="text-indigo-600 font-semibold">Home</Link>
        <Link to="/dashboard" className="hover:text-indigo-500">Dashboard</Link>
        <Link to="/products" className="hover:text-indigo-500">Products</Link>
        <Link to="/orders" className="hover:text-indigo-500">Orders</Link>
        <Link to="/insights" className="hover:text-indigo-500">Insights</Link>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </main>
    </div>
  )
}
