const TONES = {
  maroon: "bg-maroon-50 text-maroon-500",
  teal: "bg-teal-50 text-teal-600",
  purple: "bg-purple-50 text-purple-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

export default function StatCard({ icon: Icon, label, value, tone = "teal" }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card transition-shadow duration-150 hover:shadow-card-hover sm:p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-extrabold leading-tight text-ink">{value}</p>
          <p className="truncate text-xs font-medium text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
