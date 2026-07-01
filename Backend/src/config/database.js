import mongoose from "mongoose";

const connexionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connecté");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connexionDB;