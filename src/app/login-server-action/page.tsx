import LoginForm from "./components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">ZEN PLACE</h1>
          <h2 className="mt-2 text-lg font-medium text-gray-600">ログイン</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
