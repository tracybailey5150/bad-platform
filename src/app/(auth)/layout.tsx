export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">BAD</h1>
          <p className="mt-2 text-sm text-zinc-500">Business Automation & Development</p>
        </div>
        {children}
      </div>
    </div>
  );
}
