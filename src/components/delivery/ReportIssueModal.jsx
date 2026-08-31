import { useState } from "react";
import { AlertCircle } from "lucide-react";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import Button from "../ui/Button";

const REASONS = [
    { value: "unreachable", label: "Customer unreachable" },
    { value: "wrong_address", label: "Wrong address" },
    { value: "no_access", label: "Can't access location" },
    { value: "damaged", label: "Item damaged" },
    { value: "other", label: "Other" },
];

export default function ReportIssueModal({ open, onClose, delivery, onSubmit }) {
    const [reason, setReason] = useState("");

    if (!delivery) return null;

    const handleSubmit = () => {
        if (!reason) return;
        onSubmit(delivery.id, reason);
        setReason("");
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Report an Issue"
            subtitle={`Delivery #${delivery.id}`}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!reason}>
                        Report Issue
                    </Button>
                </>
            }
        >
            <div className="mb-4 flex items-start gap-3 rounded-xl bg-amber-50/60 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
                <p className="text-sm text-amber-700">
                    This will notify the dispatcher so they can resolve it — it won&apos;t cancel the delivery yourself.
                </p>
            </div>

            <Select
                label="What's the issue?"
                placeholder="Select a reason"
                options={REASONS}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
        </Modal>
    );
}