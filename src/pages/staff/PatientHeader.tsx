const PatientHeader: React.FC = () => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-200" />
        <div className="text-base text-slate-700">
          <p className="font-semibold">Tran Dang Khoa</p>
          <p className="text-slate-500 text-sm">Appointment: 01/01/2025</p>
        </div>
      </div>
      <button className="px-5 py-2 rounded-full bg-blue-500 text-white text-sm font-semibold shadow hover:bg-blue-600">
        Done Examine
      </button>
    </div>
  );
};
export default PatientHeader;
