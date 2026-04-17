export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src="/bad-logo-transparent.png" alt="BAD" className="h-20 mx-auto mb-4" />
        </div>
        {children}
      </div>
    </div>
  );
}
