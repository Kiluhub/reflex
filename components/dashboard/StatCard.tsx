type StatCardProps = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div>
      {/* Small reusable dashboard metric component. */}
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
