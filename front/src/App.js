import { Routes, Route } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import CreateUser from "./pages/CreateUser/CreateUser";
import Register from "./pages/Register/Register";
import EditUser from "./pages/EditUser/EditUser";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Hotjar from "./pages/Hotjar";

function App() {
   
  return (
    <>
    <Hotjar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreateUser />} />
        <Route path="/register/:token" element={<Register />} />
        <Route path="/edit/:id" element={<EditUser />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
