const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const products = [{ name: "Apple" }, { name: "Orange" }, { name: "Banana" }];

app.get("/products", (req, res) => {
    res.json(products);
});

app.post("/products", (req, res) => {
    console.log(req.body);
    res.send("Success");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
