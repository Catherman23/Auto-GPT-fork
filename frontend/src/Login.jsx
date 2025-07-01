import React from 'react'

export default function Login() {
  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Log In (Under Construction)</h1>
      <p className="text-gray-600 mb-6">
        This page is being built—thanks for your patience!
      </p>
      <form>
        <input
          type="text"
          placeholder="Username"
          className="block w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full mb-4 p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          Log In
        </button>
      </form>
    </div>
  )
}
