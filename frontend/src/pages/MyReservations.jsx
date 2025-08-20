import { useState, useEffect } from "react";
import { Calendar, Clock, Users, MapPin, X } from "lucide-react";
import {
  myReservations,
  cancelReservation,
  getReservation,
} from "../utils/api.js";
import { formatDate } from "../utils/helpers.js";
import { RESERVATION_STATUS } from "../utils/constants.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/UI/Loading.jsx";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [viewingReservation, setViewingReservation] = useState(null);
  const [error, setError] = useState("");

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadReservations();
    }
  }, [isAuthenticated]);

  const loadReservations = async () => {
    try {
      const response = await myReservations();
      setReservations(response.data);
    } catch (error) {
      setError("Error loading reservations");
      console.error("Error loading reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!confirm("Are you sure you’d like to cancel this reservation?")) {
      return;
    }

    setCancellingId(reservationId);

    try {
      await cancelReservation(reservationId);
      await loadReservations(); // Reload reservations
    } catch (error) {
      setError("Error cancelling the reservation");
      console.error("Error cancelling reservation:", error);
    } finally {
      setCancellingId(null);
    }
  };

  const handleViewDetails = async (reservationId) => {
    try {
      const response = await getReservation(reservationId);
      setViewingReservation(response.data);
    } catch (error) {
      setError("Error loading reservation details");
      console.error("Error loading reservation details:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      "no-show": "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const canCancelReservation = (reservation) => {
    return ["pending", "confirmed"].includes(reservation.status);
  };

  const isUpcoming = (reservation) => {
    const reservationDateTime = new Date(
      `${reservation.date}T${reservation.time}`,
    );
    return reservationDateTime > new Date();
  };

  if (loading) {
    return (
      <div className="text-center mt-20 z-99">
        <Loading text="Loading your reservations..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 z-999">
      <div className="flex items-center mb-8 justify-center z-99">
        <h1 className="text-2xl font-semibold text-dark">My Reservations</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 z-999">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="text-center py-12 z-999">
          <h2 className="text-xl font-semibold text-dark mb-2">
            You have no reservations yet
          </h2>
          <p className="text-gray-600 mb-6">
            Make your first reservation and enjoy a unique experience!
          </p>
          <a href="/reservations" className="btn-primary">
            Make Reservation
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 z-999">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="card">
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(
                        reservation.status,
                      )}`}
                    >
                      {RESERVATION_STATUS[reservation.status]}
                    </span>
                    {isUpcoming(reservation) && (
                      <span className="px-2 py-1 font-semibold bg-blue-50 text-blue-700 rounded text-xs">
                        Upcoming
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="bg-gray-200 h-px w-full"></div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(new Date(reservation.date))}
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {reservation.time}
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {reservation.partySize} people
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      Table {reservation.table?.id} ({reservation.table?.type})
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(reservation._id)}
                      className="new-btn"
                      title="View details"
                    >
                      See details
                    </button>

                    {canCancelReservation(reservation) &&
                      isUpcoming(reservation) && (
                        <button
                          onClick={() =>
                            handleCancelReservation(reservation._id)
                          }
                          disabled={cancellingId === reservation._id}
                          className="py-1 px-3 text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                          title="Cancel reservation"
                        >
                          {cancellingId === reservation._id ? (
                            <Loading />
                          ) : (
                            <div className="flex items-center justify-center gap-2 ">
                              <X className="size-4" />
                              Cancel
                            </div>
                          )}
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reservation Details Modal */}
      {viewingReservation && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-999">
          <div className="bg-white max-w-md w-full card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-dark">
                Reservation Details
              </h3>
              <button
                onClick={() => setViewingReservation(null)}
                className="text-gray-400 hover:text-red-600 hover:bg-red-200 cursor-pointer bg-gray-200 p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(
                    viewingReservation.status,
                  )}`}
                >
                  {RESERVATION_STATUS[viewingReservation.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Date:</span>
                  <p className="font-medium">
                    {formatDate(new Date(viewingReservation.date))}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Time</span>
                  <p className="font-medium">{viewingReservation.time}</p>
                </div>
                <div>
                  <span className="text-gray-500">Party Size:</span>
                  <p className="font-medium">
                    {viewingReservation.partySize} people
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Table:</span>
                  <p className="font-medium">
                    Table {viewingReservation.table?.id}
                  </p>
                </div>
              </div>

              {viewingReservation.table?.description && (
                <div>
                  <span className="text-gray-500 text-sm">Table:</span>
                  <p className="font-medium">
                    {viewingReservation.table.description}
                  </p>
                </div>
              )}

              {viewingReservation.customer && (
                <div>
                  <span className="text-gray-500 text-sm">Customer:</span>
                  <p className="font-medium">
                    {viewingReservation.customer.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {viewingReservation.customer.email}
                  </p>
                  {viewingReservation.customer.phone && (
                    <p className="text-sm text-gray-600">
                      {viewingReservation.customer.phone}
                    </p>
                  )}
                </div>
              )}

              {viewingReservation.notes && (
                <div>
                  <span className="text-gray-500">Notes:</span>
                  <p className="text-sm">{viewingReservation.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingReservation(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
