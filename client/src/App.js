import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Products, Admin } from "./pages";
import "./App.css";

const App = () => {
    return (
        <Router>
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
                <div className="App">
                    <Route path="/products">
                        <Products />
                    </Route>
                    <Route path="/admin">
                        <Admin />
                    </Route>
                </div>
            </Switch>
        </Router>
    );
};

export default App;
