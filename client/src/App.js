import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const serverUrl = process.env.NODE_ENV === "development" ? "http://localhost:5000" : process.env.REACT_APP_API_BASE_URL;

const App = () => {
    const [products, setProducts] = useState([]);
    const [productNameInput, setProductNameInput] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            // console.log(process.env.NODE_ENV);
            const { data } = await axios.get(`${serverUrl}/products`);
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setProductNameInput(e.target.value);
    };
    const handleAddProduct = async (e) => {
        e.preventDefault();

        const { data } = await axios.post(`${serverUrl}/products`, {
            name: productNameInput
        });
        const newProducts = [...products];
        newProducts.push(data);
        setProducts(newProducts);
        setProductNameInput("");
    };

    const handleDeleteProduct = async (id) => {};
    return (
        <div className="App">
            <form onSubmit={handleAddProduct}>
                <label>
                    Name:
                    <input type="text" value={productNameInput} onChange={handleChange} />
                </label>
                <input type="submit" value="Add product" />
            </form>
            <h2>My products: </h2>
            <ol>
                {products.map(({ _id, name }) => {
                    return (
                        <li key={_id}>
                            <span> {name} </span>
                            <button onClick={(_id) => handleDeleteProduct(_id)}> X </button>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default App;
