import { AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function CancelDeliveryModal({ open, onClose, delivery, onConfirm }) {
    if (!delivery) return null;

    const handleConfirm = () => {
        onConfirm(delivery.id);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Cancel Delivery"
            subtitle={`Delivery #${delivery.id}`}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Go Back
                    </Button>
                    <Button variant="danger" onClick={handleConfirm}>
                        Yes, Cancel Delivery
                    </Button>
                </>
            }
        >
            <div className="flex items-start gap-3 rounded-xl bg-red-50/60 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
                <p className="text-sm text-red-700">
                    Are you sure you want to cancel this delivery for{" "}
                    <span className="font-semibold">{delivery.customer.name}</span>? This action cannot be undone.
                </p>
            </div>
        </Modal>
    );
}