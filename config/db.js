const mongoose=require("mongoose");

const connectDb = async () => {
    try {
      const uri = process.env.MONGO_URI;
      if (!uri) {
        console.error("MongoDB URI is missing in .env file.");
        return;
      }
      
  
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, 
      });
  
      console.log("Connected to MongoDB successfully!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  };
  module.exports=connectDb;