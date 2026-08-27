type DeliveryStatusProps = {
  status: string;
};

export function DeliveryStatus({ status }: DeliveryStatusProps) {
  // Keep status rendering centralized so every delivery
  // displays its lifecycle state consistently.
  const label = status.replaceAll("_", " ");

  return (
    <span>
      {label}
    </span>
  );
}
