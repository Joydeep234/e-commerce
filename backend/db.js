import mongoose from "mongoose";


const connectDB = async()=>{
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("DB connection", connect.connection.host);
    } catch (error) {
        console.log("Database-error",error);
        process.exit();
    }
}
export default connectDB;