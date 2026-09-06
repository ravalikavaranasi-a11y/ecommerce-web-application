require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User, Product } = require("./src/models");

const products = [
  {
    name: "Aurora Wireless Headphones",
    description: "Immersive over-ear headphones with active noise cancellation and 30-hour battery life.",
    price: 79.99, category: "Electronics", stock: 24,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Urban Backpack",
    description: "Water-resistant everyday backpack with laptop sleeve and organized storage.",
    price: 49.50, category: "Fashion", stock: 32,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Smart Fitness Watch",
    description: "Fitness tracking, heart-rate monitoring, notifications and a bright AMOLED display.",
    price: 119.00, category: "Electronics", stock: 18,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Minimal Desk Lamp",
    description: "Modern LED desk lamp with adjustable brightness for work and study spaces.",
    price: 35.75, category: "Home", stock: 40,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Everyday Running Shoes",
    description: "Lightweight cushioned shoes designed for comfortable daily training and walks.",
    price: 64.25, category: "Fashion", stock: 27,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Stainless Steel Bottle",
    description: "Double-wall insulated bottle that keeps drinks cold or hot for hours.",
    price: 22.00, category: "Home", stock: 55,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"
  }
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce_app");
  await User.deleteMany({});
  await Product.deleteMany({});
  await User.create([
    { name: "Admin User", email: "admin@example.com", password: await bcrypt.hash("Admin@123", 10), role: "Admin" },
    { name: "Demo User", email: "user@example.com", password: await bcrypt.hash("User@123", 10), role: "User" }
  ]);
  await Product.insertMany(products);
  console.log("Seed complete.");
  console.log("Admin: admin@example.com / Admin@123");
  console.log("User:  user@example.com / User@123");
  await mongoose.disconnect();
}
run().catch(err => { console.error(err); process.exit(1); });
