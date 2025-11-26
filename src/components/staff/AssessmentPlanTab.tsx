import PatientHeader from "@/pages/staff/PatientHeader";
import { HiOutlineCheckCircle } from "react-icons/hi";

const AssessmentPlanTab: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 px-8 py-6">
      <PatientHeader />
      <div className="border border-slate-300 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-300 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Assessment &amp; Plan
          </h2>
          <button className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">
            Save changes
          </button>
        </div>

        <div className="px-6 py-4 border-b border-slate-300">
          <p className="text-sm font-semibold text-slate-800 mb-2">
            Assessment
          </p>
          <textarea
            className="w-full min-h-[80px] rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="General assessment, diagnosis notes..."
          />
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-800">
              Plan &amp; Schedule
            </p>
            <button className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600">
              Add new plan
            </button>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
            <div className="grid grid-cols-[1.5fr,1fr,1fr,1fr] bg-slate-50 text-slate-600 font-semibold px-4 py-2">
              <span>Plan</span>
              <span>Date</span>
              <span>Status</span>
              <span className="text-right">Next visit</span>
            </div>
            {["Scaling", "Filling", "Root canal", "Check-up"].map(
              (plan, idx) => (
                <div
                  key={plan}
                  className="grid grid-cols-[1.5fr,1fr,1fr,1fr] px-4 py-2 border-t border-slate-100 text-slate-700"
                >
                  <span>{plan}</span>
                  <span>01/01/2025</span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <HiOutlineCheckCircle />
                    Done
                  </span>
                  <span className="text-right text-slate-500">
                    {idx === 0 ? "02/01/2025" : "-"}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="mt-5">
            <button className="px-4 py-2 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-slate-50">
              Download detail description as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AssessmentPlanTab;
