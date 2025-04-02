"use client"

import LoginForm from './components/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-yellow-100 to-pink-100">
      <div className="mb-8">
        <div className="text-center text-cyan-500">
          <span className="text-2xl font-light">ZEN PLACE</span>
        </div>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-center text-lg font-medium mb-6">管理画面 ログイン</h2>
          <LoginForm />
        </div>
      </div>
      
      <div className="mt-6 text-xs text-center text-gray-500">
        <p>© 予約管理システム利用の方はこちら</p>
      </div>
    </div>
  )
}
