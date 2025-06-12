const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const http = require("http"); // ✅ socket.io के लिए
const { Server } = require("socket.io"); // ✅ socket.io के लिए

const app = express();
const port = 5000;
const secretKey = "hohdind_ndond_ndoidf";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas Connection
mongoose
  .connect(
    "mongodb+srv://sharvansuthar771:Shravansuthar775@event.flbbkbf.mongodb.net/bookyourevent?retryWrites=true&w=majority&appName=event",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB Atlas से कनेक्शन सफल रहा"))
  .catch((err) => console.error("❌ MongoDB कनेक्शन में समस्या:", err));

// Models
const Event = require("./models/Event");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
});
const User = mongoose.model("User", userSchema);

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  tickets: Number,
  seat_number: String,
  created_at: { type: Date, default: Date.now },
});
const Booking = mongoose.model("Booking", bookingSchema);

// Routes
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  const validRoles = ["admin", "user"];
  const userRole = role && validRoles.includes(role) ? role : "user";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: userRole });
    await user.save();
    res.status(201).json({ message: "User registered successfully", userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

app.post("/events", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error creating event", error: err.message });
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err.message });
  }
});

app.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error fetching event", error: err.message });
  }
});

app.put("/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Error updating event", error: err.message });
  }
});

app.delete("/events/:id", async (req, res) => {
  try {
    await Booking.deleteMany({ event_id: req.params.id });
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event and related bookings deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event", error: err.message });
  }
});

app.post("/book", async (req, res) => {
  const { userId, eventId, tickets } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event || event.ticketsAvailable < tickets) return res.status(400).json({ message: "Not enough tickets" });

    const bookingCount = await Booking.countDocuments({ event_id: eventId });
    const seatNumber = `S${bookingCount + 1}`;

    const booking = new Booking({ user_id: userId, event_id: eventId, tickets, seat_number: seatNumber });
    await booking.save();

    event.ticketsAvailable -= tickets;
    await event.save();

    res.status(201).json({
      message: "Event booked successfully",
      bookedTickets: tickets,
      seatNumber,
      totalAmount: tickets * event.price,
    });
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

app.get("/my-bookings", async (req, res) => {
  const userId = req.query.user_id;
  try {
    const bookings = await Booking.find({ user_id: userId }).populate("event_id");
    const result = bookings.map((b) => ({
      event_id: b.event_id._id,
      title: b.event_id.title,
      date: b.event_id.date,
      price: b.event_id.price,
      booked_tickets: b.tickets,
      seat_number: b.seat_number,
      total_amount: b.tickets * b.event_id.price,
      booking_date: b.created_at,
    }));
    res.json({
      message: result.length > 0 ? "Bookings retrieved successfully" : "No bookings found",
      bookings: result,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
});

app.get("/userTickets/:userId/:eventId", async (req, res) => {
  const { userId, eventId } = req.params;
  try {
    const result = await Booking.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(userId), event_id: new mongoose.Types.ObjectId(eventId) } },
      { $group: { _id: null, tickets: { $sum: "$tickets" } } },
    ]);
    res.json({ tickets: result[0]?.tickets || 0 });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user tickets", error: err.message });
  }
});

// ✅ Final: Use HTTP server with socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("✅ A user connected via socket:", socket.id);
});

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
