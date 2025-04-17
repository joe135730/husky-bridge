import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile/Profile";
import EditProfile from "./Profile/EditProfile";

export default function AccountRoutes() {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
        </Routes>
    );
}

// Export components for direct import if needed
export { default as Login } from "./Login";
export { default as Signup } from "./Signup";
export { default as Profile } from "./Profile/Profile";
export { default as EditProfile } from "./Profile/EditProfile"; 