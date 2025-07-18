import { LoginForm } from "./components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md md:p-8">
        <h1 className="mb-4 text-center text-2xl font-bold">
          登录 GoMail 系统
        </h1>
        <LoginForm />
      </div>
    </div>
  );
} 