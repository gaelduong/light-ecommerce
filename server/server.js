const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const products = [{ name: "Apple" }, { name: "Orange" }, { name: "Banana" }];

app.get("/products", (req, res) => {
    res.json(products);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
