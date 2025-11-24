import mongoose from "mongoose";

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not set in environment variables");
      console.error("Please create a .env file with MONGO_URI=your_connection_string");
      process.exit(1);
    }

    const connectionOptions = {
      serverSelectionTimeoutMS: 30000, // 30 seconds for initial connection
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
      maxPoolSize: 10,
      minPoolSize: 1,
    };

    console.log("🔄 Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    console.log("✅ Connected to MongoDB successfully");
    
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
    });
  } catch (error) {
    console.error("\n❌ Error connecting to MongoDB:");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    
    if (error.message.includes("Server selection timed out")) {
      console.error("\n💡 Common fixes:");
      console.error("1. Check MongoDB Atlas IP Whitelist:");
      console.error("   - Go to MongoDB Atlas → Network Access");
      console.error("   - Add your current IP address (or 0.0.0.0/0 for development)");
      console.error("2. Verify your connection string includes:");
      console.error("   - Correct username and password");
      console.error("   - Correct cluster name");
      console.error("   - ?retryWrites=true&w=majority at the end");
      console.error("3. Check if your cluster is paused (free tier):");
      console.error("   - Go to MongoDB Atlas → Clusters");
      console.error("   - Resume if paused");
      console.error("4. Test connection string format:");
      console.error("   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority");
    }
    
    if (error.message.includes("authentication failed")) {
      console.error("\n💡 Authentication issue:");
      console.error("   - Check username and password in connection string");
      console.error("   - Verify database user exists in MongoDB Atlas");
    }

    // Don't exit in development - allow server to start without DB
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      console.warn("\n⚠️  Continuing without database connection (development mode)");
      console.warn("   Server will start but API endpoints may fail");
    }
  }
};

export default connectDb;