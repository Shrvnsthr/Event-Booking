import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";

// Enhanced EventCard Component
const EventCard = ({ event }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewMore = () => {
    router.push(`/event/${event.id}`);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div 
      className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-full h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.2s ease-in-out'
      }}
    >
      {/* Image Section with Badge for Price */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-300"
          src={event.imageUrl || "https://via.placeholder.com/560x315"}
          alt={event.title}
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s ease-in-out'
           

          }}
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          ₹{event.price}
        </div>
        
        {/* Date Badge */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          {formatDate(event.date)}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 space-y-3 flex flex-col flex-grow">
        {/* Title with dot indicator for available tickets */}
        <div className="flex items-start gap-2">
          <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${
            event.ticketsAvailable > 10 ? 'bg-green-500' : 
            event.ticketsAvailable > 0 ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white hover:text-indigo-600 transition-colors duration-200">
            {event.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-neutral-400 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details - Responsive Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-neutral-400">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span>
              {event.ticketsAvailable} {event.ticketsAvailable === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>
        </div>

        {/* Bottom Section with Last Updated and Button */}
        <div className="mt-auto pt-4">
          {/* Last Updated */}
          {/* <p className="text-xs text-gray-400 dark:text-neutral-500 mb-3">
            Updated: {new Date(event.updatedAt || event.createdAt).toLocaleDateString()}
          </p> */}

          {/* View More Button */}
          <button
            onClick={handleViewMore}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
            style={{
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Event List Component with Improved Loading State
const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://event-booking-4k6b.onrender.com/events");
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();

    const socket = io("https://event-booking-4k6b.onrender.com");
    socket.on("eventsUpdated", () => {
      console.log("Events have been updated, refetching...");
      fetchEvents();
    });

    return () => socket.disconnect();
  }, []);

  // Animation for fade-in effect
  const fadeInAnimation = {
    opacity: 0,
    animation: 'fadeIn 0.5s ease-in-out forwards',
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50  py-4 sm:py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl font-bold dark:text-gray-800 text-white text-center mb-8 sm:mb-10"
            style={{
              opacity: 0,
              animation: 'fadeInDown 0.5s ease-in-out forwards',
            }}
          >
            Upcoming Events
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="space-y-8">
                {/* Skeleton Loader */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-md w-full h-full">
                      <div className="h-48 w-full bg-gray-200 dark:bg-neutral-700 animate-pulse"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded mt-4 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : events.length > 0 ? (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              style={fadeInAnimation}
            >
              {events.map((event, index) => (
                <div 
                  key={event._id} 
                  style={{
                    opacity: 0,
                    animation: `fadeIn 0.5s ease-in-out forwards ${index * 0.1}s`,
                  }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="flex flex-col justify-center items-center h-64"
              style={fadeInAnimation}
            >
              <svg className="w-16 h-16 text-gray-400 dark:text-neutral-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-600 dark:text-neutral-400 text-lg">
                No events available at the moment
              </p>
              <p className="text-gray-500 dark:text-neutral-500 text-sm mt-2">
                Check back later for upcoming events
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInDown {
          from { 
            opacity: 0;
            transform: translateY(-20px);
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

export default EventList;