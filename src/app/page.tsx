import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Email Intelligence
          </h1>
          <p className="text-gray-600 mb-8">
            Enterprise platform for email analysis and contract opportunities
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/dashboard"
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors block text-center"
            >
              Go to Dashboard
            </Link>
            
            <Link 
              href="/login"
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors block text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}