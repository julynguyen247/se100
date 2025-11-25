import PatientHeader from "@/pages/staff/PatientHeader";
import { FiSearch } from "react-icons/fi";

const DentalChartTab: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 px-8 py-6">
      <PatientHeader />
      <div className="border border-slate-300 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-300 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Dental Chart &amp; Diagnostics
          </h2>
          <button className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">
            Save changes
          </button>
        </div>

        <div className="px-6 pt-6">
          <div className="w-full h-64 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-sm mb-6">
            Teeth chart image placeholder
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 pb-6">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">
                  Tooth diagnostics
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <FiSearch size={14} />
                  <span>Search tooth...</span>
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto text-sm">
                {["11", "12", "13", "14", "15", "16", "17", "18"].map(
                  (t, idx) => (
                    <div
                      key={t}
                      className={`grid grid-cols-4 px-4 py-2 border-b border-slate-100 text-slate-700 ${
                        idx === 2 ? "bg-blue-50" : ""
                      }`}
                    >
                      <span>{t}</span>
                      <span>Sensitivity</span>
                      <span className="text-xs text-slate-500">Mild pain</span>
                      <span className="text-right text-xs text-emerald-600">
                        Stable
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-2">
                  Diagnostics
                </p>
                <div className="flex flex-col gap-2 text-sm text-slate-700">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                    />
                    <span>Cavity</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                    />
                    <span>Swelling</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                    />
                    <span>Periodontal</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                    />
                    <span>Other</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-2">
                  X-ray
                </p>
                <div className="w-full h-32 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-sm mb-2">
                  X-ray image placeholder
                </div>
                <button className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600">
                  Upload X-ray
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DentalChartTab;
