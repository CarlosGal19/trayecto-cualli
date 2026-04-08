import { useState } from "react";

// Íconos SVG para mantener la consistencia visual sin dependencias externas
const Icons = {
  Clock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  MapPin: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Navigation: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>,
  Flask: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
};

interface Props {
  onNavigate: (view: "tracking") => void;
}

export default function AppointmentsView({ onNavigate }: Props) {
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [delaySent, setDelaySent] = useState(false);

  const proximasCitas = [
    { id: "1", estudio: "Ultrasonido de Tiroides", hora: "08:45 AM", status: "Hoy", color: "#006B3F" },
    { id: "2", estudio: "Laboratorio Clínico", hora: "09:30 AM", status: "Hoy", color: "#006B3F" },
    { id: "3", estudio: "Rayos X de Tórax", hora: "10:15 AM", status: "Hoy", color: "#006B3F" }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="px-1">
        <h2 className="text-3xl font-black text-gray-900 leading-tight">Mis Citas</h2>
        <p className="text-gray-500 text-sm">{proximasCitas.length} estudios programados para hoy</p>
      </div>

      {/* CALENDARIO EXTENDIDO */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="font-bold text-gray-800">Abril 2026</h3>
          <div className="flex gap-4 text-gray-400 font-bold">
            <button className="hover:text-[#006B3F]">‹</button>
            <button className="hover:text-[#006B3F]">›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center gap-y-4">
          {['D','L','M','M','J','V','S'].map(d => <span key={d} className="text-[11px] font-black text-gray-300 uppercase">{d}</span>)}
          {/* Semana 1 */}
          {[1, 2, 3, 4, 5, 6, 7].map(n => <span key={n} className="text-sm text-gray-300">{n}</span>)}
          {/* Semana 2 con el día seleccionado */}
          <div className="relative flex flex-col items-center">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-[#006B3F] text-white font-bold text-sm shadow-md">8</span>
          </div>
          {[9, 10, 11, 12, 13, 14].map(n => <span key={n} className="text-sm text-gray-700 font-medium">{n}</span>)}
          {/* Semana 3 */}
          {[15, 16, 17, 18, 19, 20, 21].map(n => <span key={n} className="text-sm text-gray-700 font-medium">{n}</span>)}
        </div>
      </div>

      {/* PREPARACIÓN */}
      <div className="bg-amber-50 border border-amber-100 p-5 rounded-[28px] flex gap-4">
        <div className="bg-amber-100 p-2 rounded-xl text-amber-600 h-fit">
          <Icons.Sparkles />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900 mb-1">Preparación Inteligente</h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            Recuerda mantener el ayuno de 8 horas para tus estudios de laboratorio hoy. Puedes beber agua simple.
          </p>
        </div>
      </div>

      {/* LISTA DE ESTUDIOS (TARJETAS) */}
      <div className="space-y-4">
        {proximasCitas.map((cita, index) => (
          <div key={cita.id} className={`bg-white p-6 rounded-[32px] shadow-sm border-2 ${index === 0 ? 'border-green-100' : 'border-transparent'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-50 p-3 rounded-2xl text-[#006B3F]">
                {index === 1 ? <Icons.Flask /> : <Icons.Clock />}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{cita.status}</p>
                <p className="text-2xl font-black text-[#006B3F]">{cita.hora}</p>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">{cita.estudio}</h3>
            
            {index === 0 && (
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => onNavigate("tracking")}
                  className="flex-1 bg-[#006B3F] text-white py-4 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 shadow-lg active:scale-95 transition-transform"
                >
                  <Icons.Navigation /> Ya estoy en clínica
                </button>
                <button 
                  onClick={() => setShowDelayModal(true)}
                  className="flex-1 bg-white text-amber-700 border-2 border-amber-100 py-4 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 active:scale-95 transition-transform"
                >
                  <Icons.Clock /> Voy retrasado
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL RETRASO */}
      {showDelayModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-amber-800 flex items-center gap-2">
                <Icons.Clock /> Notificar retraso
              </h3>
              <button onClick={() => {setShowDelayModal(false); setDelaySent(false);}} className="p-2 bg-gray-100 rounded-full text-gray-400">
                <Icons.X />
              </button>
            </div>
            {!delaySent ? (
              <>
                <p className="text-sm text-gray-500 mb-6">Avisaremos a la recepción que vienes en camino para que no pierdas tu turno.</p>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[10, 20, 30].map(m => (
                    <button key={m} className="py-4 bg-gray-50 rounded-2xl font-bold text-gray-700 border border-gray-100 hover:border-amber-500 hover:text-amber-500 transition-all">{m} min</button>
                  ))}
                </div>
                <button onClick={() => setDelaySent(true)} className="w-full bg-amber-700 text-white py-4 rounded-2xl font-bold shadow-lg">Confirmar aviso</button>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Check /></div>
                <h4 className="text-lg font-bold text-gray-800">¡Aviso enviado!</h4>
                <p className="text-sm text-gray-500 mt-2">Te esperamos pronto en clínica.</p>
                <button onClick={() => setShowDelayModal(false)} className="w-full mt-8 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold">Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}