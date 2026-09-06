export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-gray-900">EggDirect</h1>
        <p className="text-xl text-gray-600">Your trusted egg marketplace</p>
        <div className="flex gap-4 justify-center mt-8">
          <a
            href="/auth/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </a>
          <a
            href="/auth/signup"
            className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
