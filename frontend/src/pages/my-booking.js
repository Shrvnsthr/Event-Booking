import { useState, useEffect, useRef } from "react";
import Navbar from "@/Components/Navbar";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Calendar, Ticket, CreditCard, Clock, FileText, ChevronRight, AlertCircle, ArrowRight } from "lucide-react";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const tableRef = useRef(null);

  // Scroll to table smoothly when data loads
  useEffect(() => {
    if (!loading && bookings.length > 0 && tableRef.current) {
      setTimeout(() => {
        tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 600);
    }
  }, [loading, bookings.length]);

  // Fetch user and bookings on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please login to view your bookings");
      window.location.href = "/admin/Login";
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser.role !== "user") {
      toast.error("Only users can view bookings");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/my-bookings?user_id=${parsedUser.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error(`Failed to load bookings: ${error.message}`);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center"
        >
          <motion.div
            animate={{
              rotate: 360,
              borderRadius: ["50% 50%", "40% 60%", "60% 40%", "50% 50%"],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              borderRadius: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="text-blue-600 mb-4"
          >
            <Loader2 size={48} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-base sm:text-lg text-gray-700 font-medium">Retrieving your bookings</p>
            <div className="flex justify-center mt-2">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="h-2 w-2 bg-blue-600 rounded-full mr-1"
              />
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="h-2 w-2 bg-blue-600 rounded-full mr-1"
              />
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="h-2 w-2 bg-blue-600 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              My Bookings
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 bg-blue-600 mx-auto rounded-full"
            />
          </motion.div>

          {user && user.role === "user" ? (
            bookings.length > 0 ? (
              <>
                <AnimatePresence>
                  {selectedBooking && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                      onClick={() => setSelectedBooking(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-gray-800">Booking Details</h3>
                          <button
                            onClick={() => setSelectedBooking(null)}
                            className="text-gray-500 hover:text-gray-700 text-lg"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h4 className="text-lg font-semibold text-blue-900 mb-1">
                            {selectedBooking.title}
                          </h4>
                          <p className="text-blue-700 text-sm mb-2">
                            <Calendar size={14} className="inline mr-1" />
                            {new Date(selectedBooking.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Number of Tickets</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {selectedBooking.booked_tickets}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Seat Number</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {selectedBooking.seat_number}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                            <p className="text-lg font-semibold text-blue-800">
                              ₹{selectedBooking.total_amount}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Booking Date</p>
                            <p className="text-sm font-medium text-gray-800">
                              {new Date(selectedBooking.booking_date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
                            View Full Details
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  ref={tableRef}
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
                  }}
                  initial="hidden"
                  animate="show"
                  className="w-full"
                >
                  <motion.div
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      show: { y: 0, opacity: 1, transition: { duration: 0.6 } },
                    }}
                    className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4"
                  >
                    <div className="flex items-center">
                      <FileText size={18} className="text-blue-600 mr-2" />
                      <span className="text-base sm:text-lg font-medium text-gray-700">
                        {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"} Found
                      </span>
                    </div>
                    <div className="flex space-x-2">
                     
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      show: { y: 0, opacity: 1, transition: { duration: 0.6, delay: 0.2 } },
                    }}
                    className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                            <th className="p-3 sm:p-4 font-semibold rounded-tl-lg">Event Title</th>
                            <th className="p-3 sm:p-4 font-semibold">
                              <Calendar size={16} className="inline mr-1" /> Date
                            </th>
                            <th className="p-3 sm:p-4 font-semibold">
                              <Ticket size={16} className="inline mr-1" /> Tickets
                            </th>
                            <th className="p-3 sm:p-4 font-semibold">Seat</th>
                            <th className="p-3 sm:p-4 font-semibold">
                              <CreditCard size={16} className="inline mr-1" /> Amount
                            </th>
                            <th className="p-3 sm:p-4 font-semibold rounded-tr-lg">
                              <Clock size={16} className="inline mr-1" /> Booking Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking, index) => (
                            <motion.tr
                              key={booking.event_id + booking.booking_date}
                              className="border-b hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                              variants={{
                                hidden: { opacity: 0, y: 10 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                              }}
                              whileHover={{ backgroundColor: "#EFF6FF" }}
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <td className="p-3 sm:p-4">
                                <div className="font-medium text-blue-900">{booking.title}</div>
                              </td>
                              <td className="p-3 sm:p-4">{new Date(booking.date).toLocaleDateString()}</td>
                              <td className="p-3 sm:p-4">
                                <span className="font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded-md">
                                  {booking.booked_tickets}
                                </span>
                              </td>
                              <td className="p-3 sm:p-4">{booking.seat_number}</td>
                              <td className="p-3 sm:p-4 font-medium">₹{booking.total_amount}</td>
                              <td className="p-3 sm:p-4 text-gray-600">
                                {new Date(booking.booking_date).toLocaleString()}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-gray-50 p-4 text-center text-sm text-gray-500">
                      Click on any booking to view more details
                    </div>
                  </motion.div>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 sm:p-10 rounded-xl shadow-xl text-center max-w-md mx-auto border border-gray-100"
              >
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    No Bookings Found
                  </h2>
                  <p className="text-gray-600 mb-6">
                    It looks like you haven’t made any bookings yet.
                  </p>
                  <Link href="/events">
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center mx-auto">
                      Explore Events
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </Link>
                </motion.div>
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 sm:p-10 rounded-xl shadow-xl text-center max-w-md mx-auto border border-gray-100"
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                  Access Denied
                </h2>
                <p className="text-gray-600 mb-6">
                  Only users can view bookings. Please log in with a user account.
                </p>
                <Link href="/admin/Login">
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center mx-auto">
                    Go to Login
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBooking;