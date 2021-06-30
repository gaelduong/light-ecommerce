import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { UserProducstDisplay, ProductDetails, Login } from "./components/User";
import { ProductsDisplay, ProductAdd, ProductEdit } from "./components/Admin";
import "./App.css";

const App = () => {
   return (
      <Router>
         <div className="App">
            <nav>
               <ul>
                  <li>
                     <Link to="/products">Products</Link>
                  </li>
                  <li>
                     <Link to="/admin">Admin</Link>
                  </li>
               </ul>
            </nav>
            <Switch>
               <Route exact path="/products" component={UserProducstDisplay} />
               <Route exact path="/product-details/:productId" component={ProductDetails} />
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
