import { Outlet } from "react-router-dom";
import ReceptionistHeader from "./ReceptionistHeader";

const ReceptionistLayout = () => {
    return (
        <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
            <ReceptionistHeader />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default ReceptionistLayout;
