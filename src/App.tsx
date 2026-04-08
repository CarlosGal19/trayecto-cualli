import { useState } from "react";
import Trayecto from "./components/Trayecto";
import Sugerencias from "./components/Sugerencias";
import AppointmentsView from "./components/AppointmentsView"; // Tu código de citas

export default function App() {
  // Ahora manejamos 3 pestañas: citas, trayecto o sugerencias
  const [tab, setTab] = useState<"citas" | "trayecto" | "sugerencias">("citas");

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans pb-10">
      {/* HEADER CON LOGO CENTRADO */}
      <div className="bg-[#006B3F] text-white px-6 py-5 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="bg-white/20 p-2 rounded-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </div>
        <img
          src="./images/logosaluddigna.png"
          alt="Logo Salud Digna"
          className="h-8 absolute left-1/2 transform -translate-x-1/2"
        />
        <button className="bg-white/20 p-2 rounded-xl relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#006B3F]"></span>
        </button>
      </div>

      {/* SEGMENTED CONTROL DE 3 OPCIONES */}
      <div className="px-6 mt-6">
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
          <button
            onClick={() => setTab("citas")}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${tab === "citas" ? "bg-[#006B3F] text-white shadow-md" : "text-gray-500"}`}
          >
            Mis Citas
          </button>
          <button
            onClick={() => setTab("trayecto")}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${tab === "trayecto" ? "bg-[#006B3F] text-white shadow-md" : "text-gray-500"}`}
          >
            Mi Trayecto
          </button>
          <button
            onClick={() => setTab("sugerencias")}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${tab === "sugerencias" ? "bg-[#006B3F] text-white shadow-md" : "text-gray-500"}`}
          >
            Sugerencias
          </button>
        </div>
      </div>

      {/* CONTENIDO DINÁMICO */}
      <div className="p-6">
        {tab === "citas" && <AppointmentsView onNavigate={(view) => {
          if (view === "tracking") setTab("trayecto"); // Si el view es 'tracking', cambiamos a la pestaña de trayecto
        }} />}

        {tab === "trayecto" && <Trayecto />}

        {tab === "sugerencias" && <Sugerencias />}
      </div>
    </div>
  );
}
