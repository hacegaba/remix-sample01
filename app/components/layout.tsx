export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-screen w-full font-mono bg-slate-600">
        <div className="px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
}
