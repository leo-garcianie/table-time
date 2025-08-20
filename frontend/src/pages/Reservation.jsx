import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle } from "lucide-react";

import Calendar from "../components/UI/Calendar.jsx";
import Loading from "../components/UI/Loading.jsx";

import PartySizeSelector from "../components/Reservations/PartySizeSelector.jsx";
import TimeSelector from "../components/Reservations/TimeSelector.jsx";
import TableSelector from "../components/Reservations/TableSelector.jsx";
import ReservationForm from "../components/Reservations/ReservationForm.jsx";

import { getAvailability, postReservation } from "../utils/api.js";
import { formatDateForAPI, formatDate } from "../utils/helpers.js";
import { useAuth } from "../context/AuthContext.jsx";

const Reservation = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPartySize, setSelectedPartySize] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [availableData, setAvailableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // useEffect - It depends on the date and group size
  useEffect(() => {
    if (selectedDate && selectedPartySize) {
      checkAvailability();
    }
  }, [selectedDate, selectedPartySize]);

  const checkAvailability = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        date: formatDateForAPI(selectedDate),
        partySize: selectedPartySize,
      };

      const response = await getAvailability(params);

      if (response?.data?.availability) {
        setAvailableData(response.data);
      } else {
        setAvailableData({ availability: {} });
      }

      // Reset subsequent selections
      setSelectedTime(null);
      setSelectedTable(null);
    } catch (error) {
      setError("Error checking availability");
      console.error("Error checking availability:", error);
      setAvailableData({ availability: {} });
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // If we already have a group size, go to step 3, if not to 2
    setStep(selectedPartySize ? 3 : 2);
    // Reset subsequent selections
    setSelectedTime(null);
    setSelectedTable(null);
  };

  const handlePartySizeSelect = (size) => {
    setSelectedPartySize(size);
    // If we already have a date, go to step 3, if not, stay at step 2.
    if (selectedDate) {
      setStep(3);
    }
    // Reset subsequent selections
    setSelectedTime(null);
    setSelectedTable(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(4);
    setSelectedTable(null);
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setStep(5);
  };

  const handleReservationSubmit = async (customerData) => {
    setSubmitting(true);
    setError("");

    try {
      const reservationData = {
        tableId: selectedTable.id,
        date: formatDateForAPI(selectedDate),
        time: selectedTime,
        partySize: selectedPartySize,
        customer: customerData,
      };

      await postReservation(reservationData);
      setSuccess(true);
      setStep(6);
    } catch (error) {
      setError(error.response?.data?.error || "Error creating the reservation");
    } finally {
      setSubmitting(false);
    }
  };

  const resetReservation = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedPartySize(null);
    setSelectedTable(null);
    setAvailableData({});
    setSuccess(false);
    setError("");
  };

  const getAvailableTimes = () => {
    if (!availableData?.availability) return [];
    return Object.keys(availableData.availability);
  };

  const getAvailableTables = () => {
    if (!availableData?.availability || !selectedTime) return [];
    return availableData.availability[selectedTime] || [];
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Select the Date";
      case 2:
        return "Number of Guests";
      case 3:
        return "Available Time";
      case 4:
        return "Choose Your Table";
      case 5:
        return "Confirm Your Reservation";
      case 6:
        return "Reservation Confirmed!";
      default:
        return "New Reservation";
    }
  };

  // Correct navigation logic
  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return selectedDate;
      case 2:
        return selectedPartySize;
      case 3:
        return selectedTime && getAvailableTimes().length > 0;
      case 4:
        return selectedTable;
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    if (step === 1 && selectedDate) {
      // If we already have party size, skip to step 3
      setStep(selectedPartySize ? 3 : 2);
    } else if (step === 2 && selectedPartySize && selectedDate) {
      setStep(3);
    } else if (step === 3 && selectedTime) {
      setStep(4);
    } else if (step === 4 && selectedTable) {
      setStep(5);
    }
  };

  const goToPreviousStep = () => {
    if (step === 3 && selectedDate && selectedPartySize) {
      setStep(2);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="card">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark mb-2">
            Reservation Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Your reservation has been successfully created
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-dark mb-2">
              Reservation Details:
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Date:</strong> {formatDate(selectedDate)}
              </p>
              <p>
                <strong>Time:</strong> {selectedTime}
              </p>
              <p>
                <strong>Table:</strong> Table {selectedTable?.id} (
                {selectedTable?.type})
              </p>
              <p>
                <strong>Guests:</strong> {selectedPartySize} people
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/my-reservations")}
              className="btn-primary"
            >
              My Reservations
            </button>
            <button onClick={resetReservation} className="btn-secondary">
              New Reservation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center mb-8 z-999">
        <div>
          <p className="text-xs font-semibold py-0.5 px-3 bg-gray-100 rounded-full justify-self-center">
            New Reservation
          </p>
        </div>

        <h1 className="text-4xl font-semibold text-dark mb-4">
          {getStepTitle()}
        </h1>

        {/* Progress Bar */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium
                                ${
                                  step >= i
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-gray-400"
                                }`}
              >
                {i}
              </div>
              {i < 5 && (
                <div
                  className={`
                  w-8 h-0.5 mx-1
                  ${step > i ? "bg-primary" : "bg-gray-200"}
                `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        {step > 1 && (
          <div className="flex flex-wrap justify-center gap-4 text-sm text-dark">
            {selectedDate && (
              <span className="label">📅 {formatDate(selectedDate)}</span>
            )}
            {selectedPartySize && (
              <span className="label">👥 {selectedPartySize} people</span>
            )}
            {selectedTime && <span className="label">🕐 {selectedTime}</span>}
            {selectedTable && (
              <span className="label">🪑 Table {selectedTable.id}</span>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="space-y-6 z-999">
        {/* Step 1 & 2: Date and Party Size */}
        {step >= 1 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Calendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
            <PartySizeSelector
              selectedSize={selectedPartySize}
              onSizeSelected={handlePartySizeSelect}
            />
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step >= 3 && selectedDate && selectedPartySize && (
          <div>
            {loading ? (
              <div className="card">
                <Loading text="Verifying availability..." />
              </div>
            ) : getAvailableTimes().length > 0 ? (
              <TimeSelector
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
                availableTimes={getAvailableTimes()}
              />
            ) : (
              <div className="bg-white rounded-xl border border-gray-300 p-4 border-b-3">
                <p className="text-dark">
                  No available times for the selected date and number of guests.
                  Please choose another date or reduce the number of guests
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Table Selection */}
        {step >= 4 && selectedTime && getAvailableTables().length > 0 && (
          <TableSelector
            tables={getAvailableTables()}
            selectedTable={selectedTable}
            onTableSelect={handleTableSelect}
            partySize={selectedPartySize}
          />
        )}

        {/* Step 5: Customer Form */}
        {step >= 5 && selectedTable && (
          <ReservationForm
            onSubmit={handleReservationSubmit}
            loading={submitting}
            initialData={isAuthenticated ? user : {}}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      {step > 1 && step < 5 && (
        <div className="flex justify-between mt-8 z-999">
          <button
            onClick={goToPreviousStep}
            className="btn-secondary"
            disabled={loading}
          >
            Prev
          </button>

          {canProceedToNextStep() && (
            <button
              onClick={goToNextStep}
              className="btn-primary"
              disabled={loading}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Reservation;
