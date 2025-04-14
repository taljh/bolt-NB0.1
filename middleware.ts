import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;

    // فقط امنع غير المسجلين من دخول لوحة التحكم
    if (!isAuth && req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(
        new URL(`/login?from=${req.nextUrl.pathname}`, req.url)
      );
    }

    // لو المستخدم مسجل دخول، وداخل عالصفحة الرئيسية فقط (مثلاً /)، ووده للدashboard
    if (isAuth && req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// ❌ حذفنا "/login" من هنا
export const config = {
  matcher: ["/dashboard/:path*"],
};