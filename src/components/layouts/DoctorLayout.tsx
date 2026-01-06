import { Outlet } from "react-router-dom";
import DoctorHeader from "./DoctorHeader";

const DoctorLayout = () => {
    return (
        <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
            <DoctorHeader />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default DoctorLayout;
