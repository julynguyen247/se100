import React from "react";
import { FiChevronDown, FiFileText, FiCalendar } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";

const MedicalHistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] px-10 py-10">
      <div className="w-full bg-[#F3F5FB] rounded-2xl shadow-2xl overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-10 py-6 flex items-center justify-between">
          <nav className="flex items-center gap-10 text-lg font-medium text-slate-600">
            <button className="pb-2 hover:text-slate-800 text-blue-600">
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
            <button className="pb-3 text-blue-600 border-b-2 border-blue-500">
              Medical history
            </button>
            <button className="pb-3 hover:text-slate-800">
              Dental Chart &amp; Diagnostics
            </button>
            <button className="pb-3 hover:text-slate-800">
              Assessment &amp; Plan
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-slate-200 px-8 py-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200" />
                <div className="text-base text-slate-700">
                  <p className="font-semibold">Tran Dang Khoa</p>
                  <p className="text-slate-500 text-sm">
                    Appointment: 01/01/2025
                  </p>
                </div>
              </div>
              <button className="px-5 py-2 rounded-full bg-blue-500 text-white text-sm font-semibold shadow hover:bg-blue-600">
                Done Examine
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 border border-slate-300 rounded-xl overflow-hidden">
              <div className="border-r border-slate-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-300">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Medical History
                  </h2>
                </div>

                <div className="px-6 py-4 border-b border-slate-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-800">
                      Illness
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FiCalendar size={14} />
                      <span>01/01/2025</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Doctor, Hospital Name
                  </p>
                </div>

                <div className="px-6 py-10 border-b border-slate-300">
                  <p className="text-sm text-slate-400">
                    Additional medical history details...
                  </p>
                </div>

                <div className="px-6 py-10">
                  <p className="text-sm text-slate-400">
                    Notes, allergies, or past treatments...
                  </p>
                </div>
              </div>

              <div>
                <div className="px-6 py-4 border-b border-slate-300">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Prescription
                  </h2>
                </div>

                <div className="px-6 py-4 border-b border-slate-300">
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    Referee
                  </p>
                  <p className="text-sm text-slate-600">
                    Doctor, Hospital Name
                  </p>
                </div>

                <div className="px-6 py-4 border-b border-slate-300">
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    Date &amp; Time
                  </p>
                  <p className="text-sm text-slate-600">01/01/2025, 11:30pm</p>
                </div>

                <div className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    Dosage
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Pain Killer – Paracetamol 1,500 mg IV q12 hours × 3 days
                  </p>
                </div>

                <div className="px-6 pt-8 pb-10">
                  <p className="text-sm text-slate-400">
                    Additional prescription notes or instructions...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicalHistoryPage;
