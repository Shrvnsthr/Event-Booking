import ADMINNAV from "@/Components/admin-nav";
import React, { useState } from "react";
import toast from "react-hot-toast";

// Reusable input component
const InputField = ({ label, type, id, value, onChange, required, min, placeholder }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
      />
    ) : (
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        placeholder={placeholder}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
      />
    )}
  </div>
);

const AddEventForm = () => {
  // State declarations
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [ticketsAvailable, setTicketsAvailable] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // URL validation function
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return url.startsWith("http://") || url.startsWith("https://");
    } catch {
      return false;
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    // Basic validation
    if (title.length < 3) return setError("Title must be at least 3 characters.");
    if (description.length < 10) return setError("Description must be at least 10 characters.");
    if (!ticketsAvailable || ticketsAvailable < 1) return setError("Ticket count must be positive.");
    if (!date) return setError("Event date is required.");
    if (!price || price < 0) return setError("Price cannot be negative.");
    if (!location) return setError("Location is required.");
    if (imageUrl && !isValidUrl(imageUrl)) return setError("Please enter a valid image URL (starting with https://).");

    setIsLoading(true); // Start loading

    const eventData = {
      title,
      description,
      date,
      ticketsAvailable,
      price,
      location,
      imageUrl,
    };

    try {
      const res = await fetch("https://event-booking-4k6b.onrender.com/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Event added successfully!");
        // Reset form
        setTitle("");
        setDescription("");
        setDate("");
        setTicketsAvailable("");
        setPrice("");
        setLocation("");
        setImageUrl("");
      } else {
        setError(result.message || "Failed to add event.");
      }
    } catch (err) {
      setError("Something went wrong while submitting the form.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <>
      <ADMINNAV />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full m-4">
          <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">Add Event</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Image URL input + preview */}
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Event Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter full URL (https://...)"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
              {imageUrl && (
                <div className="mt-3">
                  <p className="text-gray-600 text-sm mb-1">Preview:</p>
                  {isValidUrl(imageUrl) ? (
                    <img
                      src={imageUrl}
                      alt="Event Preview"
                      className="rounded-lg h-40 w-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150?text=Image+Not+Found"; // Fallback image
                      }}
                    />
                  ) : (
                    <p className="text-red-500 text-sm mt-1">
                      Please enter a valid URL (starting with https://)
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Other input fields */}
            <InputField
              label="Event Title"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter event name"
            />
            <InputField
              label="Description"
              type="textarea"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter event description (at least 10 characters)"
            />
            <InputField
              label="Event Date"
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <InputField
              label="Available Tickets"
              type="number"
              id="tickets"
              value={ticketsAvailable}
              onChange={(e) => setTicketsAvailable(e.target.value)}
              min="1"
              required
              placeholder="Enter ticket count"
            />
            <InputField
              label="Price"
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              required
              placeholder="Enter price"
            />
            <InputField
              label="Location"
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Enter event location"
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-200 ${
                isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Adding..." : "Add Event"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEventForm;
