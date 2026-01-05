import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const GuestLayout = () => {
    return (
        <>
            <AppHeader />
            <Outlet />
            <AppFooter />
        </>
    );
};

export default GuestLayout;
