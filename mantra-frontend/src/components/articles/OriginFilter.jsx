import { useOrigins } from "../../hooks/useData";

export default function OriginFilter({ selected, onChange }) {
  const { data: origins, isLoading } = useOrigins();

  if (isLoading) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
          ${!selected
            ? "bg-mantra-600 text-white shadow-sm"
            : "bg-white text-ink-600 border border-ink-200 hover:border-mantra-300 hover:text-mantra-700"
          }`}
      >
        🌍 All Origins
      </button>
      {origins?.map((origin) => (
        <button
          key={origin.id}
          onClick={() => onChange(origin.id === selected ? null : origin.id)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
            ${origin.id === selected
              ? "bg-mantra-600 text-white shadow-sm"
              : "bg-white text-ink-600 border border-ink-200 hover:border-mantra-300 hover:text-mantra-700"
            }`}
        >
          {origin.flag} {origin.name}
        </button>
      ))}
    </div>
  );
}
