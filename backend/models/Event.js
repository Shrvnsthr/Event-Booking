// models/Event.js

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  ticketsAvailable: { type: Number, required: true },
  price: { type: Number, required: true },
  imageUrl: String,
});

eventSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString(); // readable id
    // ✅ _id रहने दो
    delete ret.__v;
  },
});



module.exports = mongoose.model("Event", eventSchema);
