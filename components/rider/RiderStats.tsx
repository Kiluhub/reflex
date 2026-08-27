type Props = {
  assigned: number;
  pickedUp: number;
  delivered: number;
};

export function RiderStats({ assigned, pickedUp, delivered }: Props) {
  return (
    <section>
      {/* Quick operational summary for the rider. */}
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
