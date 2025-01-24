import mongoose from "mongoose";

const mongodbURi = ""

console.log("mongodbURi" , mongodbURi);


const connectDB = async () => {

    try {
        const connectionInstance = await mongoose.connect(mongodbURi)

        console.log("MongoDb Connected");

        mongoose.connection.on(
            "error",
            console.error.bind(console, "Connection error:"),
        );

        process.on("SIGINT", () => {
            mongoose.connection.close();

            console.log("Mongoose connection closed due to application termination");
            process.exit(0);

        });
    } catch (error) {
        console.error("MongoDb connection Failed", error);
        process.exit(1);
    }
};

try {
    await connectDB();

} catch (err) {
    console.log("🚀 ~ main file ~ err:", err);
}

