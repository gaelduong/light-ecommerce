import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Products, Admin, Login } from "./pages";
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
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/products">
                        <Products />
                    </Route>
                    <Route path="/admin">
                        <Admin />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
