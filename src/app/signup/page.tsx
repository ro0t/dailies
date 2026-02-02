import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--theme-bg)] px-4">
      <div className="w-full max-w-sm space-y-8">
        <h1 className="text-center text-[var(--text-xl)] font-medium text-[var(--theme-text)]">
          Create your account
        </h1>
        <SignupForm />
        <p className="text-center text-[var(--text-base)] text-[var(--theme-muted)]">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-[var(--theme-accent)] underline transition-colors duration-150 hover:text-[var(--theme-text)]">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
