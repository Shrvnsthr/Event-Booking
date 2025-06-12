const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb+srv://sharvansuthar771:Shravansuthar775@event.flbbkbf.mongodb.net/bookyourevent", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },
});

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("svnstr775", 10); // password: 
  const admin = new User({
    name: "Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("Admin user created!");
  mongoose.disconnect();
}

createAdmin().catch((err) => console.error(" Error:", err));
