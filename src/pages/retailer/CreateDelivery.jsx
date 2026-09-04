import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, User, Phone, MapPin, Package } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { retailerNav } from "../../utils/navConfig";
import { useDeliveries } from "../../context/DeliveryContext";
import { useToast } from "../../components/ui/Toast";
import { useAuth } from "../../hooks/useAuth";

export default function CreateDelivery() {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    item: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const { createDelivery } = useDeliveries();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.value,
    }));

  const validate = () => {
    const e = {};

    if (!form.customerName.trim()) {
      e.customerName = "Enter the customer's name";
    }

    if (!form.customerPhone.trim()) {
      e.customerPhone = "Enter a phone number";
    } else if (!/^[0-9+\s]{7,}$/.test(form.customerPhone)) {
      e.customerPhone = "Enter a valid phone number";
    }

    if (!form.address.trim()) {
      e.address = "Enter the delivery address";
    }

    if (!form.item.trim()) {
      e.item = "Describe the item";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!validate()) return;

    if (!user?.id) {
      showToast("Unable to identify the logged-in retailer");
      return;
    }

    setSubmitting(true);

    try {
      const delivery = await createDelivery({
        retailerId: user.id,
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        deliveryAddress: form.address.trim(),
        itemDescription: form.item.trim(),
      });

      setCreated(delivery);

      showToast("Delivery created successfully");

      setForm({
        customerName: "",
        customerPhone: "",
        address: "",
        item: "",
      });
    } catch (error) {
      console.error("Failed to create delivery:", error);
      showToast(error.message || "Failed to create delivery");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      navItems={retailerNav}
      greeting="Create New Delivery"
      subtitle="Enter customer and delivery details."
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card sm:p-7">
          <h2 className="text-lg font-bold text-ink">
            Create New Delivery
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter customer and delivery details.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <Input
              label="Customer Name"
              icon={User}
              placeholder="e.g. Jane Wanjiku"
              value={form.customerName}
              error={errors.customerName}
              onChange={set("customerName")}
            />

            <Input
              label="Customer Phone"
              icon={Phone}
              placeholder="e.g. 0712 345 678"
              value={form.customerPhone}
              error={errors.customerPhone}
              onChange={set("customerPhone")}
            />

            <Input
              label="Delivery Address"
              icon={MapPin}
              placeholder="e.g. Kiambu Road, Nairobi"
              value={form.address}
              error={errors.address}
              onChange={set("address")}
            />

            <Input
              label="Item Description"
              icon={Package}
              placeholder="e.g. Wireless earbuds"
              value={form.item}
              error={errors.item}
              onChange={set("item")}
            />

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                className="w-full sm:w-auto"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                loading={submitting}
                className="w-full sm:w-auto"
              >
                Create Delivery
              </Button>
            </div>
          </form>

          {created && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-teal-100 bg-teal-50/60 p-4 animate-slideUp">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-teal-600"
                aria-hidden="true"
              />

              <div className="text-sm">
                <p className="font-semibold text-teal-700">
                  Delivery created successfully
                </p>

                <p className="mt-1 text-teal-700/80">
                  Delivery ID:{" "}
                  <span className="font-semibold">
                    REF-{created.id}
                  </span>{" "}
                  &bull; Status:{" "}
                  <span className="font-semibold">
                    REQUESTED
                  </span>
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/retailer/deliveries/${created.id}`
                    )
                  }
                  className="mt-2 text-sm font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
                >
                  View delivery details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
