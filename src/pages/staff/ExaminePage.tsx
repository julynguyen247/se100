import AssessmentPlanTab from "@/components/staff/AssessmentPlanTab";
import React, { useState } from "react";
import {
  FiChevronDown,
  FiFileText,
  FiCalendar,
  FiSearch,
} from "react-icons/fi";
import { HiOutlineUserCircle, HiOutlineCheckCircle } from "react-icons/hi";
import MedicalHistoryTab from "./MedicalHistoryTab";
import DentalChartTab from "@/components/staff/DentalChartTab";

type TabKey = "medical" | "dental" | "assessment";

const ExaminePage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("medical");

  const renderTab = () => {
    if (tab === "medical") return <MedicalHistoryTab />;
    if (tab === "dental") return <DentalChartTab />;
    return <AssessmentPlanTab />;
  };

  return (
    <div className="min-h-screen bg-[#0F172A] px-10 py-10">
      <div className="w-full bg-[#F3F5FB] rounded-2xl shadow-2xl overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-10 py-6 flex items-center justify-between">
          <nav className="flex items-center gap-10 text-lg font-medium text-slate-600">
            <button className="pb-2 text-blue-600 hover:text-blue-700">
              Waiting Queue
            </button>
            <button className="pb-2 hover:text-slate-800">
              Patients Records
            </button>
            <button className="pb-2 hover:text-slate-800">My Schedule</button>
            <button className="pb-2 hover:text-slate-800">Settings</button>
          </nav>
          <div className="flex items-center gap-4">
            <HiOutlineUserCircle size={46} className="text-blue-600" />
            <div className="text-right text-base leading-tight">
              <p className="font-semibold text-slate-900">Carter Smith</p>
              <p className="text-slate-400">Dentist</p>
            </div>
            <FiChevronDown size={20} className="text-slate-500" />
          </div>
        </header>

        <main className="px-10 py-8">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="flex items-center gap-2 text-3xl font-semibold text-blue-600">
              <span>Examine</span>
              <FiFileText size={24} />
            </div>
          </div>

          <div className="flex gap-10 text-lg font-medium text-slate-500 border-b border-slate-200 mb-6">
            <button
              className={`pb-3 ${
                tab === "medical"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "hover:text-slate-800"
              }`}
              onClick={() => setTab("medical")}
            >
              Medical history
            </button>
            <button
              className={`pb-3 ${
                tab === "dental"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "hover:text-slate-800"
              }`}
              onClick={() => setTab("dental")}
            >
              Dental Chart &amp; Diagnostics
            </button>
            <button
              className={`pb-3 ${
                tab === "assessment"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "hover:text-slate-800"
              }`}
              onClick={() => setTab("assessment")}
            >
              Assessment &amp; Plan
            </button>
          </div>

          {renderTab()}
        </main>
      </div>
    </div>
  );
};
export default ExaminePage;
