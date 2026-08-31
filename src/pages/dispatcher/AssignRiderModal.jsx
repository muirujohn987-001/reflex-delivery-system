import { useState } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";

export default function AssignRiderModal({ open, onClose, delivery, riders, onAssign }) {
  const [selected, setSelected] = useState(null);

  if (!delivery) return null;

  const handleAssign = () => {
    if (!selected) return;
    onAssign(delivery.id, selected);
    setSelected(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign Rider"
      subtitle={`Delivery #${delivery.id}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selected}>
            Assign Rider
          </Button>
        </>
      }
    >
      <div className="rounded-xl bg-gray-50 p-3.5">
        <p className="text-sm font-semibold text-ink">{delivery.customer.name}</p>
        <p className="text-xs text-gray-500">{delivery.customer.address}</p>
        <p className="mt-0.5 text-xs text-gray-500">{delivery.item}</p>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2.5 text-sm font-semibold text-ink">Select available rider</legend>
        <div className="space-y-2">
          {riders.map((rider) => (
            <label
              key={rider.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                selected === rider.id ? "border-teal-400 bg-teal-50/50" : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="rider"
                value={rider.id}
                checked={selected === rider.id}
                onChange={() => setSelected(rider.id)}
                className="h-4 w-4 shrink-0 text-teal-500 focus:ring-teal-400"
              />
              <Avatar name={rider.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{rider.name}</p>
                <p className="text-xs text-gray-500">{rider.phone}</p>
              </div>
              {rider.available && (
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  Available
                </span>
              )}
            </label>
          ))}
        </div>
      </fieldset>
    </Modal>
  );
}
