import React from "react";
import {
  FiSearch,
  FiChevronDown,
  FiEdit2,
  FiEye,
  FiCalendar,
} from "react-icons/fi";
import {
  HiOutlineUserCircle,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

type Status = "Visited" | "Waiting" | "Scheduled";

interface Appointment {
  time: string;
  patient: string;
  dentist: string;
  service: string;
  phone: string;
  status: Status;
  timer?: string;
  highlight?: boolean;
}

const APPOINTMENTS: Appointment[] = [
  {
    time: "7:00 – 7:20",
    patient: "Briha Nariman Roth",
    dentist: "Mazzi",
    service: "Upper Abdomen General – Test Code 2705",
    phone: "00000000000",
    status: "Visited",
  },
  {
    time: "7:20 – 7:40",
    patient: "Jordan Dobbs",
    dentist: "Hadesah",
    service: "Upper Abdomen General – Test Code 2705",
    phone: "00000000000",
    status: "Visited",
  },
  {
    time: "7:40 – 8:00",
    patient: "Aspen Passaquindici Arvand",
    dentist: "Mazzi",
    service: "Upper Abdomen General – Test Code 2705",
    phone: "00000000000",
    status: "Visited",
  },
  {
    time: "8:00 – 8:10",
    patient: "Carter Biroth",
    dentist: "Private",
    service: "Upper Abdomen General – Test Code 2705",
    phone: "00000000000",
    status: "Scheduled",
    timer: "00:12",
  },
  {
    time: "8:20 – 8:30",
    patient: "Carter Smith",
    dentist: "Mazzi",
    service: "Upper Abdomen General – Test Code 2705",
    phone: "00000000000",
    status: "Waiting",
    timer: "05:54",
    highlight: true,
  },
  {
    time: "8:30 – 8:40",
    patient: "Asliyn Birosh",
    dentist: "Clinic",
    service: "Upper Abdomen General – Test Code 2705",
    phone: "00000000000",
    status: "Scheduled",
  },
];

const getStatusClass = (status: Status): string => {
  switch (status) {
    case "Visited":
      return "bg-emerald-50 text-emerald-700";
    case "Waiting":
      return "bg-orange-50 text-orange-600";
    case "Scheduled":
    default:
      return "bg-sky-50 text-sky-700";
  }
};

const StaffAppointmentsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] px-10 py-10">
      <div className="w-full bg-[#F3F5FB] rounded-2xl shadow-2xl overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-10 py-6 flex items-center justify-between">
          <nav className="flex items-center gap-10 text-lg font-medium text-slate-600">
            <button className="pb-2 border-b-2 border-blue-500 text-blue-600">
              Appointments
            </button>
            <button className="pb-2 hover:text-slate-800">Waiting Queue</button>
            <button className="pb-2 hover:text-slate-800">Patients</button>
            <button className="pb-2 hover:text-slate-800">Billing</button>
            <button className="pb-2 hover:text-slate-800">Settings</button>
          </nav>

          <div className="flex items-center gap-4">
            <HiOutlineUserCircle size={46} className="text-blue-600" />
            <div className="text-right text-base leading-tight">
              <p className="font-semibold text-slate-900">Carter Smith</p>
              <p className="text-slate-400">Staff</p>
            </div>
            <FiChevronDown size={20} className="text-slate-500" />
          </div>
        </header>

        <div className="px-10 pt-7 pb-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-semibold text-slate-900">
              Appointments
            </h1>
            <button className="p-2.5 rounded-xl border border-slate-300 text-slate-500 hover:bg-slate-100">
              <FiCalendar size={20} />
            </button>
          </div>

          <div className="flex-1 xl:mx-8 relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="px-6 py-3.5 rounded-xl bg-blue-500 text-white text-lg font-semibold shadow-md hover:bg-blue-600">
            + New Appointment
          </button>
        </div>

        <div className="px-10 pb-7 flex flex-wrap gap-4 items-center text-base text-slate-700">
          <select className="h-11 px-4 rounded-xl border border-slate-300 bg-white">
            <option>Select Time</option>
          </select>
          <select className="h-11 px-4 rounded-xl border border-slate-300 bg-white">
            <option>Select Status</option>
          </select>
          <select className="h-11 px-4 rounded-xl border border-slate-300 bg-white">
            <option>Select Dentist</option>
          </select>

          <label className="inline-flex items-center gap-2 text-slate-600">
            <input type="checkbox" className="rounded border-slate-300" />
            <span>Hide visited</span>
          </label>

          <label className="inline-flex items-center gap-2 text-slate-600">
            <input type="checkbox" className="rounded border-slate-300" />
            <span>Show empty</span>
          </label>

          <div className="flex items-center gap-4 ml-auto text-base">
            <div className="flex items-center gap-2 text-slate-500">
              <span>From</span>
              <input
                type="date"
                className="h-10 px-3 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span>To</span>
              <input
                type="date"
                className="h-10 px-3 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <button className="h-10 px-5 rounded-xl border border-slate-300 bg-white flex items-center gap-2 text-slate-700">
              June 1, 2022
              <FiChevronDown size={18} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="px-10 pb-10">
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <table className="min-w-full text-base">
              <thead className="bg-slate-50 text-slate-600">
                <tr className="h-16">
                  <th className="w-10 px-6 text-left align-middle">
                    <input type="checkbox" />
                  </th>
                  <th className="px-5 text-left font-semibold align-middle">
                    Time
                  </th>
                  <th className="px-5 text-left font-semibold align-middle">
                    Patient
                  </th>
                  <th className="px-5 text-left font-semibold align-middle">
                    Dentist
                  </th>
                  <th className="px-5 text-left font-semibold align-middle">
                    Service
                  </th>
                  <th className="px-5 text-left font-semibold align-middle">
                    Phone
                  </th>
                  <th className="px-5 text-left font-semibold align-middle">
                    Status
                  </th>
                  <th className="px-5 text-left font-semibold align-middle">
                    Timer
                  </th>
                  <th className="px-5 text-right font-semibold pr-8 align-middle">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-slate-800">
                {APPOINTMENTS.map((a) => (
                  <tr
                    key={a.time + a.patient}
                    className={`border-t border-slate-100 h-16 ${
                      a.highlight ? "bg-blue-50/70" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-6 align-middle">
                      <input type="checkbox" />
                    </td>

                    <td className="px-5 whitespace-nowrap align-middle">
                      {a.time}
                    </td>
                    <td className="px-5 whitespace-nowrap align-middle">
                      {a.patient}
                    </td>
                    <td className="px-5 whitespace-nowrap align-middle">
                      {a.dentist}
                    </td>

                    <td className="px-5 text-sm align-middle">{a.service}</td>

                    <td className="px-5 whitespace-nowrap align-middle">
                      {a.phone}
                    </td>

                    <td className="px-5 whitespace-nowrap align-middle">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                          a.status
                        )}`}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td className="px-5 text-red-500 align-middle">
                      {a.timer}
                    </td>

                    <td className="px-5 text-right pr-8 align-middle">
                      <button className="text-slate-400 hover:text-blue-500 mr-5">
                        <FiEye size={20} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-500">
                        <FiEdit2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-8 py-5 text-base text-slate-600 border-t">
              <div className="flex items-center gap-3">
                <span>Show on page</span>
                <select className="h-10 px-4 rounded-xl border border-slate-300 bg-white">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <button className="px-3 py-2 rounded-xl border border-slate-300 bg-white">
                  <HiChevronLeft size={20} />
                </button>
                <span>Page 1 of 6</span>
                <button className="px-3 py-2 rounded-xl border border-slate-300 bg-white">
                  <HiChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAppointmentsPage;
