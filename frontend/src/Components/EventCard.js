import Link from "next/link";
import { useEffect } from "react";

const EventCard = ({ event, onDelete }) => {
  useEffect(() => {
    console.log("Image URL:", event.imgUrl);
  }, [event.imgUrl]);

  return (
    <div
      className="main"
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        width: "300px",
        marginBottom: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img
        src={
          event.imgUrl && event.imgUrl.startsWith("http")
            ? event.imgUrl
            : "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={event.title || "Event Image"}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "6px",
          marginBottom: "10px",
        }}
      />

      <h2 style={{ marginBottom: "5px", fontSize: "18px" }}>{event.title}</h2>
      <p style={{ marginBottom: "10px", color: "#555" }}>{event.date}</p>

      <Link href={`/event/${event._id}`}>
        <button
          style={{
            padding: "5px 10px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          View Details
        </button>
      </Link>

      <button
        onClick={() => onDelete(event._id)}
        style={{
          padding: "5px 10px",
          backgroundColor: "red",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default EventCard;
