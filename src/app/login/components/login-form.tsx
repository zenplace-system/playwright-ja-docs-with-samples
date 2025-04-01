"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (loginId.length > 0 && password.length > 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [loginId, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("login_id", loginId);
      formData.append("password", password);

      const { error, token } = await (
        await fetch("http://127.0.0.1:8001/employee-auth/v1/auth/login", {
          method: "POST",
          body: formData,
        })
      ).json();

      if (token) {
        alert("ログインに成功しました。");
        router.push("/phoenix");
      } else if (error) {
        setError("ログインに失敗しました。ログイン情報が間違っています。");
      }
    } catch (error) {
      setError("サーバーとの通信に失敗しました。");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="row">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            ID
          </span>
          <input
            type="text"
            name="login_id"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="ログインID(社員番号)を入力してください"
            required
            autoFocus
          />
        </label>
      </div>

      <div className="row">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </span>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="パスワードを入力してください"
            required
          />
        </label>
      </div>

      {error && <p className="error text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="signin-btn w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition duration-200"
        disabled={isButtonDisabled}
      >
        ログイン
      </button>
    </form>
  );
}
