import LoginScreen from "@/components/auth/LoginScreen";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata = { title: "Login | Forma" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f2] text-stone-900">
      <SiteHeader active="/login" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight">
          Xush kelibsiz
        </h1>
        <LoginScreen />
      </main>
      <SiteFooter />
    </div>
  );
}
