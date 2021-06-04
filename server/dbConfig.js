const mongoose = require("mongoose");

const dbConnection = async () => {
    mongoose.connect(process.env.DB_CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const connection = mongoose.connection;
    connection.on("error", console.error.bind(console, "Connection error:"));
    connection.once("open", () => {
        console.log("Connected to MongoDB");
    });

    // Product schema
    const productSchema = new mongoose.Schema({
        name: String
    });

    // Product model
    const Product = mongoose.model("products", productSchema);

    // Create a new record
    const product1 = new Product({ name: "Keyboard" });

    // Insert records
    try {
        await product1.save();
        console.log("Saved");
    } catch (e) {
        console.log(e);
    }

    // Read records
    try {
        const products = await Product.find({});
        console.log(products);
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    dbConnection
};
