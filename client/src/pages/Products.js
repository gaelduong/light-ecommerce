import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config";

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get(`${serverUrl}/products`);
            setProducts(data);
        };
        fetchProducts();
    }, []);

    return (
        <div className="Products">
            <h2>My products: </h2>
            <ol>
                {products.map(({ _id, name }) => {
                    return (
                        <li key={_id}>
                            <span> {name} </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default Products;
