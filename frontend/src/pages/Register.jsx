import RegisterForm from "@/components/Auth/RegisterForm";
import { REFRESH_TOKEN } from "@/lib/constants";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

export default function Register() {
  if (localStorage.getItem(REFRESH_TOKEN)) {
    const refreshToken = jwtDecode(localStorage.getItem(REFRESH_TOKEN));
    const tokenExp = refreshToken.exp;
    const now = Math.floor(Date.now() / 1000); // Get time in seconds
    console.log(tokenExp, now, tokenExp < now);

    if (tokenExp >= now) return <Navigate to="/"></Navigate>;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2 absolute inset-0 -z-1">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/products/registerimg.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
