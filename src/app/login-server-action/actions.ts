"use server";

export async function loginAction(formData: FormData) {
  try {
    const response = await fetch(
      "http://127.0.0.1:8001/employee-auth/v1/auth/login",
      {
        method: "POST",
        body: formData,
        headers: {
          "X-Requested-With": "server-action",
        },
      }
    );

    const data = await response.json();

    if (data.token) {
      return {
        success: true,
        token: {
          access_token: data.token.access_token,
          refresh_token: data.token.refresh_token,
        },
      };
    } else if (data.error) {
      return {
        success: false,
        error: "ログインに失敗しました。ログイン情報が間違っています。",
      };
    }

    return { success: false, error: "不明なエラーが発生しました。" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "サーバーとの通信に失敗しました。" };
  }
}
