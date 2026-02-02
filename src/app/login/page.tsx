import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--theme-bg)] px-4">
      <div className="w-full max-w-sm space-y-8">
        <h1 className="text-center text-[var(--text-xl)] font-medium text-[var(--theme-text)]">
          Sign in to Dailies
        </h1>
        <LoginForm />
        <p className="text-center text-[var(--text-base)] text-[var(--theme-muted)]">
          No account?{" "}
          <a href="/signup" className="font-medium text-[var(--theme-accent)] underline transition-colors duration-150 hover:text-[var(--theme-text)]">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
