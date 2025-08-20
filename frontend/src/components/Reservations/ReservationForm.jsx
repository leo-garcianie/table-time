import { useState } from "react";
import { validateEmail, validatePhone } from "../../utils/helpers.js";

const ReservationForm = ({ onSubmit, isLoading = false, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter valid email address";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="card z-999">
      <h3 className="text-lg font-semibold text-dark mb-4">
        Customer Information
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex w-full gap-4">
          <div className="w-full">
            <label className="flex items-center text-sm font-medium text-dark mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${
                errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="w-full">
            <label className="flex items-center text-sm font-medium text-dark mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${
                errors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-dark mb-2">
            Phone number (optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`input-field ${
              errors.phone
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            placeholder="+123 456 789"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-dark mb-2">
            Additional notes (optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="input-field resize-none"
            placeholder="Any special requests, allergies, celebrations, etc."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full btn-primary ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Creating reservation..." : "Confirm Reservation"}
        </button>
      </form>
    </div>
  );
};
export default ReservationForm;
