import Navbar from "@/Components/Navbar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Footer from "@/Components/Footer";

const EventDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const isReady = router.isReady;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketsToBook, setTicketsToBook] = useState(1);
  const [message, setMessage] = useState("");
  const [userTickets, setUserTickets] = useState(0);
  const [bookingDetails, setBookingDetails] = useState(null); // To store seat number and total amount
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get user info once on mount
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Get user ID from localStorage
    const storedUserId = localStorage.getItem("id");
    const parsedUserId = storedUserId ? JSON.parse(storedUserId) : null;
    setUserId(parsedUserId);
    setIsLoggedIn(!!parsedUserId);
    console.log("User ID:", parsedUserId, "Is Logged In:", !!parsedUserId);
  }, []);

  // Fetch event and user tickets
 useEffect(() => {
 if (!isReady || !id || id === "undefined") return;

  const fetchEvent = async () => {
    try {
      setLoading(true);
      console.log("✅ Fetching event for ID:", id);
      const response = await fetch(`http://localhost:5000/events/${id}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error("❌ Error fetching event details:", error);
      setMessage(`Failed to load event details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTickets = async () => {
    if (!isLoggedIn || !userId?.id) {
      setUserTickets(0);
      return;
    }

    try {
      console.log("✅ Fetching user tickets for:", userId?.id, id);
      const response = await fetch(`http://localhost:5000/userTickets/${userId.id}/${id}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setUserTickets(data.tickets || 0);
    } catch (error) {
      console.error("❌ Error fetching user tickets:", error);
      setMessage(`Failed to load user tickets: ${error.message}`);
    }
  };

  fetchEvent();
  fetchUserTickets();
}, [isReady, id, userId?.id, isLoggedIn]);


  // Format date in a nice way
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBookTickets = async () => {
    if (!isLoggedIn) {
      setMessage("Please login first to book tickets.");
      toast.error("Please login to book tickets");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId?.id,
          eventId: id,
          tickets: ticketsToBook,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Booking response:", data);

      // Update state with booking details
      toast.success("Tickets booked successfully!");
      setEvent((prev) => ({
        ...prev,
        ticketsAvailable: prev.ticketsAvailable - ticketsToBook,
      }));
      setUserTickets((prev) => prev + ticketsToBook);
      setBookingDetails({
        bookedTickets: data.bookedTickets,
        seatNumber: data.seatNumber,
        totalAmount: data.totalAmount,
      });
      setMessage(`Booked ${data.bookedTickets} tickets! Seat: ${data.seatNumber}, Total: ₹${data.totalAmount}`);
      setTicketsToBook(1); // Reset ticket input
    } catch (error) {
      toast.error("Tickets booking failed");
      console.error("Error booking tickets:", error);
      setMessage(`An error occurred while booking tickets: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center">
        {loading ? (
          <div className="w-full max-w-5xl animate-pulse">
            <div className="bg-white dark:bg-neutral-900 shadow-md rounded-lg p-6">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 w-full h-96 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
                <div className="lg:w-1/2 w-full mt-6 lg:mt-0 lg:pl-6">
                  <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded-lg w-3/4"></div>
                  <div className="mt-6 space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
                  </div>
                  <div className="mt-8 h-10 bg-gray-200 dark:bg-neutral-700 rounded w-40"></div>
                </div>
              </div>
            </div>
          </div>
        ) : event ? (
          <div 
            className="w-full max-w-5xl"
            style={{
              opacity: 0,
              animation: 'fadeIn 0.6s ease-in-out forwards',
            }}
          >
            <div className="bg-white dark:bg-neutral-900 shadow-lg rounded-xl overflow-hidden">
              {/* Event Header Card with Gradient Overlay */}
              <div className="relative h-48 md:h-64 w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                <img
                  src={event.imageUrl || "/default-event-image.jpg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onLoad={() => setImageLoaded(true)}
                  style={{
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                  }}
                />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h1 className="text-3xl font-bold">{event.title}</h1>
                  <div className="flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex flex-col md:flex-row">
                {/* Left Column - Event Details */}
                <div className="w-full md:w-2/3 p-6">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">DATE</p>
                        <div className="flex items-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-800 dark:text-gray-200 font-medium">{formatDate(event.date)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">PRICE</p>
                        <div className="flex items-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-800 dark:text-gray-200 font-medium">₹{event.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex-grow md:flex-grow-0">
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">TICKETS AVAILABLE</p>
                        <div className="flex items-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          <p className="text-gray-800 dark:text-gray-200 font-medium">{event.ticketsAvailable}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="mb-6"
                    style={{
                      opacity: 0,
                      animation: 'fadeIn 0.6s ease-in-out 0.3s forwards',
                    }}
                  >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">About This Event</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {event.description || "Join us for an unforgettable experience at this amazing event. Don't miss out on this opportunity to be part of something special!"}
                    </p>
                  </div>

                  {/* User's Ticket Information */}
                  {isLoggedIn && (
                    <div 
                      className="mb-6 bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 border border-gray-200 dark:border-neutral-700"
                      style={{
                        opacity: 0,
                        animation: 'fadeIn 0.6s ease-in-out 0.5s forwards',
                      }}
                    >
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Your Tickets</h3>
                      <p className="text-gray-600 dark:text-gray-300">You currently have <span className="font-semibold text-indigo-600 dark:text-indigo-400">{userTickets}</span> ticket(s) for this event.</p>
                      
                      {bookingDetails && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-neutral-700">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-2">Last Booking Details</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Seat Number:</span>
                              <p className="font-medium text-gray-800 dark:text-white">{bookingDetails.seatNumber}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Total Amount:</span>
                              <p className="font-medium text-gray-800 dark:text-white">₹{bookingDetails.totalAmount}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Display */}
                  {message && (
                    <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-4 text-indigo-700 dark:text-indigo-300 text-sm border-l-4 border-indigo-500">
                      {message}
                    </div>
                  )}
                </div>

                {/* Right Column - Booking Widget */}
                <div className="w-full md:w-1/3 p-6 bg-gray-50 dark:bg-neutral-800">
                  <div 
                    className="sticky top-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md p-5 border border-gray-100 dark:border-neutral-700"
                    style={{
                      opacity: 0,
                      animation: 'fadeIn 0.6s ease-in-out 0.6s forwards',
                    }}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Book Your Tickets</h3>
                    
                    {isLoggedIn ? (
                      <>
                        <div className="mb-4">
                          <label htmlFor="tickets" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Number of Tickets:
                          </label>
                          <div className="flex items-center">
                            <button 
                              onClick={() => setTicketsToBook(prev => Math.max(1, prev - 1))}
                              className="bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 h-10 w-10 rounded-l-md flex items-center justify-center hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <input
                              id="tickets"
                              type="number"
                              value={ticketsToBook}
                              min="1"
                              max={event.ticketsAvailable}
                              onChange={(e) => setTicketsToBook(Number(e.target.value))}
                              className="border-y border-gray-300 dark:border-neutral-600 h-10 w-16 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-neutral-800 dark:text-white"
                            />
                            <button 
                              onClick={() => setTicketsToBook(prev => Math.min(event.ticketsAvailable, prev + 1))}
                              className="bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 h-10 w-10 rounded-r-md flex items-center justify-center hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-neutral-700 py-4 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-300">Price per ticket:</span>
                            <span className="text-gray-800 dark:text-gray-200 font-medium">₹{event.price}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-600 dark:text-gray-300">Quantity:</span>
                            <span className="text-gray-800 dark:text-gray-200 font-medium">{ticketsToBook}</span>
                          </div>
                          <div className="flex justify-between items-center mt-4 text-lg font-semibold">
                            <span className="text-gray-800 dark:text-white">Total:</span>
                            <span className="text-indigo-600 dark:text-indigo-400">₹{event.price * ticketsToBook}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={handleBookTickets}
                          disabled={ticketsToBook > event.ticketsAvailable || ticketsToBook <= 0}
                          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                          style={{
                            transform: 'scale(1)',
                            transition: 'transform 0.2s ease-in-out'
                          }}
                          onMouseEnter={(e) => {
                            if (!(ticketsToBook > event.ticketsAvailable || ticketsToBook <= 0)) {
                              e.currentTarget.style.transform = 'scale(1.02)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {ticketsToBook > event.ticketsAvailable ? 'Not Enough Tickets Available' : 'Book Now'}
                        </button>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Please login to book tickets for this event.</p>
                        <button 
                          onClick={() => router.push('/admin/Login')}
                          className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                        >
                          Login
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Back Button */}
            <div className="mt-8 mb-6">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Events
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Event Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">The event you are looking for might have been removed or is temporarily unavailable.</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-6 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Browse Events
            </button>
          </div>
        )}
      </div>
      <Footer />

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default EventDetails;