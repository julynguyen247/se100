import { FiCalendar } from "react-icons/fi";
import PatientHeader from "./PatientHeader";

const MedicalHistoryTab: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 px-8 py-6">
      <PatientHeader />
      <div className="grid grid-cols-1 lg:grid-cols-2 border border-slate-300 rounded-xl overflow-hidden">
        <div className="border-r border-slate-300">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-300">
            <h2 className="text-lg font-semibold text-slate-900">
              Medical History
            </h2>
          </div>
          <div className="px-6 py-4 border-b border-slate-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-800">Illness</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FiCalendar size={14} />
                <span>01/01/2025</span>
              </div>
            </div>
            <p className="text-sm text-slate-600">Doctor, Hospital Name</p>
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
            <p className="text-sm font-semibold text-slate-800 mb-1">Referee</p>
            <p className="text-sm text-slate-600">Doctor, Hospital Name</p>
          </div>
          <div className="px-6 py-4 border-b border-slate-300">
            <p className="text-sm font-semibold text-slate-800 mb-1">
              Date &amp; Time
            </p>
            <p className="text-sm text-slate-600">01/01/2025, 11:30pm</p>
          </div>
          <div className="px-6 py-4 border-b border-slate-300">
            <p className="text-sm font-semibold text-slate-800 mb-1">Dosage</p>
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
  );
};
export default MedicalHistoryTab;
