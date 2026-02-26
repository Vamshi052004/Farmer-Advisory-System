// MongoDB initialization script
// Run using: mongosh mongo_init.js

use farmer_advisory;

// Users collection
db.users.insertMany([
  {
    name: "Ramesh",
    mobile: "9999999999",
    role: "farmer"
  },
  {
    name: "Admin",
    mobile: "8888888888",
    role: "admin"
  }
]);

// Farmers collection
db.farmers.insertMany([
  {
    name: "Ramesh",
    mobile: "9999999999",
    location: "Kolar",
    crop: "Tomato",
    land_size: 2,
    soil_type: "Red"
  }
]);

// Crops collection
db.crops.insertMany([
  {
    crop_name: "Tomato",
    season: "Kharif",
    ideal_ph: "6.0 - 6.8",
    water_requirement: "Medium"
  },
  {
    crop_name: "Rice",
    season: "Kharif",
    ideal_ph: "5.5 - 6.5",
    water_requirement: "High"
  }
]);

// Advisory collection
db.advisory.insertOne({
  crop: "Tomato",
  irrigation: "Irrigate within 2 days",
  fertilizer: "Apply Urea 50kg/acre",
  pest_alert: "Leaf miner risk",
  date: new Date()
});

print("✅ MongoDB initialized with sample data");