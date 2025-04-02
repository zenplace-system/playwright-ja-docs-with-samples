'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  try {
    const loginId = formData.get('login_id');
    const password = formData.get('password');
    
    // サーバーサイドでのAPI呼び出し
    const response = await fetch("http://127.0.0.1:8001/employee-auth/v1/auth/login", {
      method: "POST",
      body: formData,
      headers: {
        'X-Requested-With': 'server-action'
      }
    });
    
    const data = await response.json();
    
    if (data.token) {
      // トークンをクッキーに保存
      const cookieStore = cookies();
      cookieStore.set('access_token', data.token.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1日
        path: '/',
      });
      
      cookieStore.set('refresh_token', data.token.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30日
        path: '/',
      });
      
      return { success: true };
    } else if (data.error) {
      return { success: false, error: "ログインに失敗しました。ログイン情報が間違っています。" };
    }
    
    return { success: false, error: "不明なエラーが発生しました。" };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: "サーバーとの通信に失敗しました。" };
  }
}
