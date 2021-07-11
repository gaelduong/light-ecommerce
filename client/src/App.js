import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, UserProducstDisplay, ProductDetails, Cart, Login } from "./components/User";
import { ProductsDisplay, ProductAdd, ProductEdit } from "./components/Admin";
import "./App.css";

const App = () => {
   const cart = useSelector((state) => state.cart);
   return (
      <Router>
         <div className="App">
            <nav>
               <ul>
                  <li>
                     <Link to="/">Home</Link>
                  </li>
                  <li>
                     <Link to="/products">Products</Link>
                  </li>
                  <li>
                     <Link to="/cart">Cart</Link> <span style={{ color: "yellowgreen", fontWeight: "bold" }}>({cart.items.length}) </span>
                  </li>
                  <li>
                     <Link to="/admin">Admin</Link> <span>(for shop owner)</span>
                  </li>
               </ul>
            </nav>
            <Switch>
               <Route exact path="/" component={Home} />
               <Route exact path="/products" component={UserProducstDisplay} />
               <Route exact path="/product-details/:productId" component={ProductDetails} />
               <Route exact path="/cart" component={Cart} />
               <Route exact path="/admin" component={ProductsDisplay} />
               <Route exact path="/login" component={Login} />
               <Route exact path="/product-add" component={ProductAdd} />
               <Route exact path="/product-edit/:productId" component={ProductEdit} />
            </Switch>
         </div>
      </Router>
   );
};

export default App;
