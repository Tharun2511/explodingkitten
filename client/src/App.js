import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import PlayGround from "./components/PlayGround";
import NotFound from "./components/NotFound";

function App() {
    return (
        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/playground" element={<PlayGround />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
