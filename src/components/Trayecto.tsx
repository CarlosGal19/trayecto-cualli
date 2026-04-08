import { useState, useEffect } from "react";

type Estudio = {
  id: number;
  nombre: string;
  tiempo: number;
  estado: "completado" | "espera" | "pendiente";
  progreso?: number;
  desc?: string;
};

type AlertaPop = {
  titulo: string;
  mensaje: string;
};

export default function Trayecto() {
  const [estudios, setEstudios] = useState<Estudio[]>([
    { id: 1, nombre: "Check-in", tiempo: 0, estado: "completado", desc: "Registro finalizado a las 08:30 AM." },
    { id: 2, nombre: "Laboratorio", tiempo: 10, estado: "espera", progreso: 66, desc: "Tu turno se aproxima. Mantente cerca del área." },
    { id: 3, nombre: "Ultrasonido de Tiroides", tiempo: 25, estado: "pendiente", desc: "Iniciará después del laboratorio." },
    { id: 4, nombre: "Rayos X", tiempo: 10, estado: "pendiente", desc: "Se requiere vestimenta cómoda." },
    { id: 5, nombre: "Electrocardiograma", tiempo: 20, estado: "pendiente", desc: "Último paso de tu trayecto hoy." },
  ]);

  const [popup, setPopup] = useState<AlertaPop | null>(null);

  const total = estudios.reduce((acc, e) => acc + e.tiempo, 30);

  useEffect(() => {
    const ws = new WebSocket("wss://cualli-ap.onrender.com");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // 🔰 ignorar INIT si quieres
        if (data.type === "INIT") {
          return;
        }

        // =============================
        // 🔁 EVENTO: TOGGLE
        // =============================
        if (data.type === "TOGGLE_UPDATED") {
          setEstudios(prev => {
            const index3 = prev.findIndex(e => e.id === 3);
            const index4 = prev.findIndex(e => e.id === 4);

            if (index3 === -1 || index4 === -1) return prev;

            const newArray = [...prev];

            // swap estudios 3 y 4
            [newArray[index3], newArray[index4]] =
              [newArray[index4], newArray[index3]];

            // 🧠 calcular total actual del front
            const currentTotal = newArray.reduce((acc, e) => acc + e.tiempo, 30);

            // 🧠 calcular delta real
            const delta = data.total - currentTotal;

            // ⏱️ aplicar delta al estudio en espera
            const enEspera = newArray.find(e => e.estado === "espera");
            if (enEspera) {
              enEspera.tiempo += delta;
            }

            return newArray;
          });

          setPopup({
            titulo: "Ruta actualizada",
            mensaje: "El orden de tus estudios ha sido optimizado para reducir tiempos de espera."
          });

          return;
        }

        // =============================
        // ⏱️ EVENTO: TIEMPO
        // =============================
        if (data.type === "DELAY_UPDATED") {
          setEstudios(prev => {
            const enEspera = prev.find(e => e.estado === "espera");
            if (!enEspera) return prev;

            return prev.map(e =>
              e.id === enEspera.id
                ? { ...e, tiempo: e.tiempo + data.delta } // 👈 aquí aplicas el cambio
                : e
            );
          });

          setPopup({
            titulo: "Tiempo actualizado",
            mensaje: "Tu tiempo de espera ha cambiado."
          });

          return;
        }

      } catch (err) {
        console.error("Error WS:", err);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="space-y-6 relative">

      {/* CARD VERDE PRINCIPAL (DISEÑO ORIGINAL INTACTO) */}
      <div className="bg-linear-to-br from-[#1B8B4C] to-[#0A6C35] text-white p-6 rounded-3xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>

        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider opacity-90 mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ESTADO EN TIEMPO REAL
        </div>

        <h2 className="text-4xl font-bold mb-2">Total en clínica: {total} min</h2>
        <p className="text-sm font-medium text-green-100">
          Próximo estudio: {estudios.find(e => e.estado === "espera")?.tiempo || 0} min <span className="font-bold text-white">(3 personas antes)</span>
        </p>
      </div>

      {/* RECUADRO AMARILLO FIJO */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex gap-3 shadow-sm">
        <div className="text-yellow-600 mt-0.5 animate-pulse shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </div>
        <p className="text-xs text-yellow-800 leading-relaxed font-medium">
          <strong className="block text-sm mb-0.5">Mantente atento</strong>
          El sistema está monitoreando las salas. Tu ruta puede ser optimizada en cualquier momento y te lo notificaremos por aquí.
        </p>
      </div>

      <h3 className="text-lg font-bold text-gray-800">Estado de tus servicios</h3>

      {/* TIMELINE (DISEÑO ORIGINAL CON SUS ICONOS BONITOS) */}
      <div className="relative pl-4 mt-2 pb-6">
        <div className="absolute left-8 top-4 bottom-8 w-0.5 border-l-2 border-dashed border-gray-200"></div>

        {estudios.map((e) => (
          <div key={e.id} className="mb-5 relative flex items-start gap-4 transition-all duration-700 transform">

            {/* ICONO DEL TIMELINE */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 shrink-0 mt-2 shadow-sm transition-colors duration-500 ${e.estado === "completado" ? "bg-green-100 text-green-600" :
              e.estado === "espera" ? "bg-orange-100 text-orange-600" :
                "bg-gray-100 text-gray-400"
              }`}
            >
              {e.estado === "completado" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
              {e.estado === "espera" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
              {e.estado === "pendiente" && <div className="w-3 h-3 bg-gray-300 rounded-full"></div>}
            </div>

            {/* TARJETA DEL ESTUDIO */}
            <div className={`flex-1 bg-white p-4 rounded-2xl shadow-sm border transition-all duration-500 ${e.estado === "espera" ? "border-yellow-400" : "border-gray-100"
              }`}>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-800 text-[15px]">{e.nombre}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${e.estado === "completado" ? "bg-green-50 text-green-700" :
                  e.estado === "espera" ? "bg-orange-50 text-orange-700" :
                    "bg-gray-100 text-gray-500"
                  }`}
                >
                  {e.estado}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-3">{e.desc}</p>

              {/* BARRA DE PROGRESO (Solo en Espera) */}
              {e.estado === "espera" && e.progreso && (
                <div className="mb-3">
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${e.progreso}%` }} />
                  </div>
                  <div className="flex justify-end mt-1 text-xs font-bold text-orange-600">{e.progreso}%</div>
                </div>
              )}

              {/* TIEMPO DE ESPERA */}
              {e.estado !== "completado" && (
                <div className={`text-xs font-semibold flex items-center gap-1 ${e.estado === "espera" ? "text-orange-600" : "text-gray-400"}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Espera aprox: {e.tiempo} min
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ==========================================
          MODAL POP-UP (SOLO VERDE DE OPTIMIZACIÓN)
      =========================================== */}
      {popup && (
        <div className="fixed inset-0 bg-black/60 z-300 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-fade-in-up">

            <div className="p-8 text-white text-center bg-[#006B3F]">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl font-black">{popup.titulo}</h3>
            </div>

            <div className="p-8 text-center">
              <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">{popup.mensaje}</p>
              <button
                onClick={() => setPopup(null)}
                className="w-full py-4 rounded-2xl font-bold text-white bg-[#006B3F] hover:bg-green-800 transition-colors"
              >
                ¡Genial!
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
