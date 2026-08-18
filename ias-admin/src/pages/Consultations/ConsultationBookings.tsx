import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchAdminBookings } from "../../store/slices/consultationSlice";
const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/";

const ConsultationBookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading, error } = useSelector((state: RootState) => state.consultation);

  useEffect(() => {
    dispatch(fetchAdminBookings());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Consultation Bookings</h1>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {error && <div className="mb-4 text-red-500">{error}</div>}
        
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">User</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Slot Details</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Institution Info</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Query & File</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-stroke dark:border-strokedark">
                  <td className="py-5 px-4">
                    <p className="text-black dark:text-white font-medium">{booking.fullName}</p>
                    <p className="text-sm text-gray-500">{booking.userId?.email}</p>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-black dark:text-white text-sm">
                      {new Date(booking.slotId?.startTime).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.slotId?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                      {new Date(booking.slotId?.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {booking.slotId?.duration} Min
                    </span>
                  </td>
                  <td className="py-5 px-4 text-sm">
                    <p><strong>Desig:</strong> {booking.designation}</p>
                    <p><strong>Dept:</strong> {booking.department}</p>
                    <p><strong>Inst:</strong> {booking.institute}</p>
                  </td>
                  <td className="py-5 px-4 text-sm">
                    <p className="mb-2 max-w-xs truncate" title={booking.query}>{booking.query}</p>
                    {booking.fileUpload && (
                      <a
                        href={`${API_BASE_URL}uploads/${booking.fileUpload}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline text-xs flex items-center"
                      >
                        📄 View Document
                      </a>
                    )}
                  </td>
                  <td className="py-5 px-4">
                    <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      booking.paymentStatus === 'paid' ? 'bg-success text-success' : 
                      booking.paymentStatus === 'free' ? 'bg-primary text-primary' : 
                      'bg-warning text-warning'
                    }`}>
                      {booking.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsultationBookings;
