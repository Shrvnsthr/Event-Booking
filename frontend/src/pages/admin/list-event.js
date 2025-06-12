import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ADMINNAV from "@/Components/admin-nav";
import toast from "react-hot-toast";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/events");
        const data = await res.json();

        console.log("Fetched Events Array:", data); // 🔍 Debug line
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const res = await fetch(`http://localhost:5000/events/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setEvents(events.filter((event) => event._id !== id));
          toast.success("Event deleted successfully!");
        } else {
          toast.error("Error deleting event");
        }
      } catch (err) {
        console.error("Error during delete:", err);
        toast.error("Delete failed");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading events...</p>;

  return (
    <>
      <ADMINNAV />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Events List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.map((event) => {
              console.log("Event:", event); // 👀 Yeh line check karegi _id aayi ya nahi

              return (
                <div
                  key={event._id}
                  className="bg-white border rounded-xl shadow-sm p-4 hover:shadow-lg transition-transform duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{event.description}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>Location:</strong> {event.location}
                  </p>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => {
                        if (event && event._id) {
                          router.push(`/event/${event._id}`);
                        } else {
                          console.error("Invalid event:", event);
                          toast.error("Galat event data hai");
                        }
                      }}
                      className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                      View More
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;
