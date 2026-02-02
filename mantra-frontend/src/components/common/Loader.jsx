export default function Loader({ className = "", size = "md" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${sizes[size]} border-2 border-ink-200 border-t-mantra-600 rounded-full animate-spin`} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <Loader size="lg" />
        <p className="mt-4 text-sm text-ink-500">Loading...</p>
      </div>
    </div>
  );
}
