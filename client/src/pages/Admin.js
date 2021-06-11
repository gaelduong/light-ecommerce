import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config";

const Admin = ({ history }) => {
    const [products, setProducts] = useState([]);
    const [productNameInput, setProductNameInput] = useState("");
    const [productNameEdit, setProductNameEdit] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [currentProductEditId, setCurrentProductEditId] = useState("");

    useEffect(() => {
        const redirectToLogin = () => history.push("/login");
        const getCookieValue = (name) => document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
        const accessToken = getCookieValue("accessToken");
        if (!accessToken) redirectToLogin();

        const verifyLoggedIn = async (accessToken) => {
            try {
                await axios.get(`${serverUrl}/isloggedin`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            } catch (e) {
                console.log(e);
                redirectToLogin();
            }
        };
        verifyLoggedIn(accessToken);
    }, [history]);

    const logoutHandler = () => {
        const delete_cookie = (name) => {
            document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        };
        delete_cookie("accessToken");
        history.push("/login");
    };

    useEffect(() => {
        const fetchProducts = async () => {
            // console.log(process.env.NODE_ENV);
            const { data } = await axios.get(`${serverUrl}/products_admin`);
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const handleNameInputChange = (e) => {
        setProductNameInput(e.target.value);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const { data } = await axios.post(`${serverUrl}/products_admin`, {
            name: productNameInput
        });
        const newProducts = [...products];
        newProducts.push(data);
        setProducts(newProducts);
        setProductNameInput("");
    };

    const handleDeleteProduct = async (e, id) => {
        const { data } = await axios.delete(`${serverUrl}/products_admin/${id}`);
        const newProducts = [...products].filter((product) => product._id !== data._id);
        setProducts(newProducts);
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        const { data } = await axios.put(`${serverUrl}/products_admin/${currentProductEditId}`, { name: productNameEdit });
        const newProducts = products.map((product) => {
            return product._id === currentProductEditId ? data : product;
        });
        setProducts(newProducts);
        setIsEdit(false);
        setCurrentProductEditId("");
    };

    const handleNameEditChange = (e) => {
        setProductNameEdit(e.target.value);
    };

    const handleEnableProductEdit = (e, id) => {
        setCurrentProductEditId(id);
        setIsEdit(true);
        const product = products.find((product) => product._id === id);
        setProductNameEdit(product.name);
    };

    const editForm = (
        <form onSubmit={handleEditProduct}>
            <label>
                New name:
                <input type="text" value={productNameEdit} onChange={handleNameEditChange} />
            </label>
            <input type="submit" value="Update" />
            <button
                onClick={() => {
                    setIsEdit(false);
                    setCurrentProductEditId("");
                }}
            >
                Cancel
            </button>
        </form>
    );

    return (
        <div className="Admin">
            <button onClick={logoutHandler}> Log out </button>
            <form onSubmit={handleAddProduct}>
                <label>
                    Name:
                    <input type="text" value={productNameInput} onChange={handleNameInputChange} />
                </label>
                <input type="submit" value="Add product" />
            </form>

            {isEdit ? editForm : ""}

            <h2>My products: </h2>
            <ol>
                {products.map(({ _id, name }) => {
                    return (
                        <li style={{ color: currentProductEditId === _id ? "red" : "white" }} key={_id}>
                            <span> {name} </span>
                            <button onClick={(e) => handleEnableProductEdit(e, _id)}>Edit</button>
                            <button onClick={(e) => handleDeleteProduct(e, _id)}> X </button>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default Admin;
