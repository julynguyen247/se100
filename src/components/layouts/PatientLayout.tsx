import { Outlet } from "react-router-dom";
import PatientHeader from "./PatientHeader";
import AppFooter from "./AppFooter";

const PatientLayout = () => {
    return (
        <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
            <PatientHeader />
            <main className="flex-1">
                <Outlet />
            </main>
            <AppFooter />
        </div>
    );
};

export default PatientLayout;
