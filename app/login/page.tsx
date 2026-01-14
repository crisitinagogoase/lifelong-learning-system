'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log('Auth status:', status, session?.user?.email)
  }, [session, status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      console.log('Attempting to sign in with:', email)
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      console.log('Sign-in result:', result)

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password. Please try again.")
        } else {
          setError(result.error)
        }
      } else if (result?.ok) {
        console.log('Login successful, redirecting...')
        window.location.href = '/'
      } else {
        setError("An unknown error occurred while trying to log in.")
      }
    } catch (err) {
      console.error('Login error:', err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Login</h1>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Auth Status: {status}
          {status === 'authenticated' && (
            <div className="mt-2">
              <p>Logged in as: {session?.user?.email}</p>
              <button
                onClick={handleLogout}
                className="mt-2 px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
              >
                Log Out
              </button>
              <button
                onClick={() => router.push('/')}
                className="mt-2 ml-2 px-4 py-2 text-sm text-white bg-green-500 hover:bg-green-600 rounded"
              >
                Go to Home
              </button>
            </div>
          )}
        </div>
        
        {status !== 'authenticated' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
                {error}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600'}`}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-green-600 dark:text-green-400 font-medium">You are already logged in!</p>
          </div>
        )}
        
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
} 