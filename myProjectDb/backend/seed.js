const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product"); // Adjust path as necessary
const User = require("./models/users"); // Adjust path as necessary
const Order = require("./models/order"); // Adjust path as necessary
const Cart = require("./models/cart"); // Adjust path as necessary

dotenv.config();

const MONGO_URI = "mongodb+srv://tajkiratulabida:aH10290811@dbcluster.thaht.mongodb.net/eCommerceDb?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .then(seedDatabase)
  .catch(err => console.error("Error connecting to database:", err));

async function seedDatabase() {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    // Seed Products
    const products = [
      { name: "Product 1", price: 100, category: "Electronics", description: "Description for Product 1", imageUrl: "https://example.com/images/product1.jpg" },
      { name: "Product 2", price: 150, category: "Electronics", imageUrl: "https://example.com/images/product2.jpg", description: "Description for Product 2" },
      { name: "Product 3", price: 200, category: "Clothing", description: "Description for Product 3", imageUrl: "https://example.com/images/product3.jpg" },
      { name: "Product 4", price: 250, category: "Clothing", description: "Description for Product 4", imageUrl: "https://example.com/images/product4.jpg"},
      { name: "Product 5", price: 300, category: "Books", description: "Description for Product 5", imageUrl: "https://example.com/images/product5.jpg"},
    ];

    const createdProducts = await Product.insertMany(products);
    console.log("Products seeded!");

    // Seed Users
    const users = [
    {
      username: "user1",
      email: "user1@example.com",
      password: "password1",
      role: "user",
      profile: {
        firstName: "John",
        lastName: "Doe",
        phone: "1234567890",
        address: "123 Main St"
      }
    },
    {
      username: "user2",
      email: "user2@example.com",
      password: "password2",
      role: "admin",
      profile: {
        firstName: "Jane",
        lastName: "Smith",
        phone: "0987654321",
        address: "456 Elm Ave"
      }
    }
  ];

    const createdUsers = await User.insertMany(users);
    console.log("Users seeded!");

    // Get the ObjectId of the first user
    const userId = createdUsers[0]._id; // assuming you want to link the first user

    // Seed Orders
    const orders = [
      { userId: userId, items: [ { productId: createdProducts[0]._id, quantity: 2, price: 100 }, { productId: createdProducts[1]._id, quantity: 1, price: 50 } ], totalAmount: 250, shippingAddress: { city: "City A", district: "District A", address: "123 Main St", phone: "01900000000" }, status: "Pending" },
      { userId: userId, items: [ { productId: createdProducts[2]._id, quantity: 1, price: 200 } ], totalAmount: 200, shippingAddress: { city: "City B", district: "District B", address: "456 Another St", phone: "01900000001" }, status: "Shipped" }
    ];
    

    await Order.insertMany(orders);
    console.log("Orders seeded!");

    // Seed Carts
    const carts = [
      { userId: userId, products: [{ productId: createdProducts[0]._id, quantity: 1 }, { productId: createdProducts[1]._id, quantity: 2 }] },
      { userId: createdUsers[1]._id, products: [{ productId: createdProducts[2]._id, quantity: 1 }] },
    ];

    await Cart.insertMany(carts);
    console.log("Carts seeded!");

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
}
