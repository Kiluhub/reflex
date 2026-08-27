type Props = {
  pending: number;
  assigned: number;
  pickedUp: number;
  delivered: number;
};

export function DispatcherStats({
  pending,
  assigned,
  pickedUp,
  delivered,
}: Props) {
  return (
    <section>
      {/* Operational counters give the dispatcher an immediate overview. */}
      <div>
        <span>Pending</span>
        <strong>{pending}</strong>
      </div>

      <div>
        <span>Assigned</span>
        <strong>{assigned}</strong>
      </div>

      <div>
        <span>Picked up</span>
        <strong>{pickedUp}</strong>
      </div>

      <div>
        <span>Delivered</span>
        <strong>{delivered}</strong>
      </div>
    </section>
  );
}
