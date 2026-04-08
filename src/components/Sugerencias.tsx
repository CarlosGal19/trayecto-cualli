import { useState } from "react";

export default function Sugerencias() {
  const [modalHistoria, setModalHistoria] = useState(false);
  
  // ESTADOS PARA EL MENÚ DE ACTIVIDADES
  const [modalActividades, setModalActividades] = useState(false);
  const [actividadActiva, setActividadActiva] = useState<"menu" | "trivia" | "visual" | "nutricion">("menu");

  // ESTADOS PARA LA TRIVIA
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState<"correcto" | "incorrecto" | null>(null);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  // ESTADOS PARA OTRAS ACTIVIDADES (Ahora llegan hasta 6 pasos)
  const [pasoVisual, setPasoVisual] = useState(0);
  const [pasoNutricion, setPasoNutricion] = useState(0);

  // HISTORIA RESUMIDA
  const historia = [
    { y: "2003", t: "Fundación", d: "Nace en Culiacán con la misión de dar salud accesible." },
    { y: "2005 - 2010", t: "Expansión", d: "Apertura nacional, integrando laboratorios y rayos X." },
    { y: "2010 - 2019", t: "Innovación", d: "Llegan ultrasonidos, mastografías y resultados digitales." },
    { y: "2020", t: "COVID-19", d: "Participación clave en pruebas durante la pandemia." },
    { y: "HOY", t: "Más de 200 clínicas", d: "Impulsadas con IA y tecnología de punta." }
  ];

  // BANCO DE PREGUNTAS TRIVIA
  const bancoTrivia: Record<string, { q: string, o: string[], a: number }[]> = {
    "Cuerpo Humano": [
      { q: "¿Cuántos huesos tiene el cuerpo humano adulto?", o: ["150", "206", "300"], a: 1 },
      { q: "¿Cuál es el órgano más grande del cuerpo?", o: ["El Hígado", "Los Pulmones", "La Piel"], a: 2 },
      { q: "¿Qué órgano bombea la sangre a todo el cuerpo?", o: ["Cerebro", "Riñón", "Corazón"], a: 2 },
      { q: "¿Cuántos pulmones tiene el ser humano?", o: ["1", "2", "3"], a: 1 },
      { q: "¿Cuál es el músculo más fuerte del cuerpo?", o: ["La lengua", "El masetero (mandíbula)", "El bíceps"], a: 1 },
    ],
    "Nutrición y Salud": [
      { q: "¿Qué vitamina es conocida como la 'vitamina del sol'?", o: ["Vitamina A", "Vitamina D", "Vitamina C"], a: 1 },
      { q: "¿Cuál es el principal componente del cuerpo humano?", o: ["Agua", "Músculo", "Huesos"], a: 0 },
      { q: "¿Qué mineral es vital para tener huesos fuertes?", o: ["Hierro", "Calcio", "Potasio"], a: 1 },
      { q: "¿Qué macronutriente es la principal fuente de energía?", o: ["Proteínas", "Carbohidratos", "Grasas"], a: 1 },
      { q: "¿Cuántos litros de agua se recomiendan al día?", o: ["1 litro", "2 a 3 litros", "5 litros"], a: 1 },
    ],
    "Salud Visual": [
      { q: "¿Cómo se llama la capa transparente frente al ojo?", o: ["Córnea", "Retina", "Iris"], a: 0 },
      { q: "¿Qué parte del ojo da el color?", o: ["Pupila", "Cristalino", "Iris"], a: 2 },
      { q: "¿Qué especialista revisa la vista?", o: ["Otorrinolaringólogo", "Oftalmólogo / Optometrista", "Neurólogo"], a: 1 },
      { q: "¿Qué defecto visual dificulta ver de lejos?", o: ["Astigmatismo", "Miopía", "Hipermetropía"], a: 1 },
      { q: "¿Para qué sirven las lágrimas?", o: ["Para llorar", "Lubricar y limpiar el ojo", "Para ver mejor de noche"], a: 1 },
    ]
  };

  // PREGUNTAS RETO VISUAL (La P1 es la tabla de letras que está en el HTML)
  const preguntasVisual = [
    { q: "¿Sientes los ojos secos o cansados después de usar el celular o computadora?", o: ["Casi nunca", "A veces", "Todos los días"] },
    { q: "¿Tienes que alejar los textos (como el celular o un menú) para poder enfocarlos?", o: ["No, leo bien de cerca", "Solo de vez en cuando", "Sí, necesito alejar todo"] },
    { q: "¿Sufres de dolores de cabeza frecuentes al final del día?", o: ["Rara vez", "1 o 2 veces por semana", "Casi a diario"] },
    { q: "¿Hace cuánto tiempo fue tu último examen de la vista?", o: ["Hace menos de 1 año", "Hace 1 a 2 años", "Hace más de 2 años / Nunca"] }
  ];

  // PREGUNTAS TEST DE HÁBITOS
  const preguntasNutricion = [
    { q: "¿Cuántos vasos de agua natural tomas al día en promedio?", o: ["Más de 6 vasos", "Entre 3 y 5 vasos", "1 o 2 vasos"] },
    { q: "¿Cuántas porciones de frutas o verduras comes al día?", o: ["3 o más porciones", "1 o 2 porciones", "A veces ninguna"] },
    { q: "¿Cuántos días a la semana realizas al menos 30 min de ejercicio?", o: ["3 días o más", "1 o 2 días", "Ningún día"] },
    { q: "¿Cuántas horas duermes por la noche en promedio?", o: ["7 a 8 horas", "5 a 6 horas", "Menos de 5 horas"] },
    { q: "¿Con qué frecuencia consumes refrescos o bebidas azucaradas?", o: ["Rara vez", "2 a 3 veces por semana", "Todos los días"] }
  ];

  const seleccionarCategoria = (cat: string) => {
    setCategoriaSeleccionada(cat);
    setPreguntaActual(0);
    setPuntos(0);
    setJuegoTerminado(false);
  };

  const responderTrivia = (idx: number) => {
    if (!categoriaSeleccionada) return;
    const esCorrecto = idx === bancoTrivia[categoriaSeleccionada][preguntaActual].a;
    setMostrarResultado(esCorrecto ? "correcto" : "incorrecto");
    if (esCorrecto) setPuntos(prev => prev + 1);

    setTimeout(() => {
      setMostrarResultado(null);
      if (preguntaActual < bancoTrivia[categoriaSeleccionada].length - 1) {
        setPreguntaActual(prev => prev + 1);
      } else {
        setJuegoTerminado(true);
      }
    }, 1200);
  };

  const cerrarActividades = () => {
    setModalActividades(false);
    setActividadActiva("menu");
    setCategoriaSeleccionada(null);
    setPasoVisual(0);
    setPasoNutricion(0);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-[28px] font-bold text-gray-900 leading-tight mb-2">Aprovecha tu tiempo en clínica</h2>
        <p className="text-gray-500 text-[15px] leading-relaxed">
          Mientras esperas tus resultados o tu próxima cita, descubre estos servicios exclusivos.
        </p>
      </div>

      {/* ÓPTICA */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <img src="./images/doc.png" alt="Óptica" className="w-full h-48 object-cover"/>
        <div className="p-5">
          <h3 className="text-[#006B3F] font-bold text-xl mb-1">Óptica</h3>
          <p className="text-gray-500 text-sm mb-4">Examen de la vista sin filas. Recibe atención personalizada mientras esperas tu turno clínico.</p>
          <button className="w-full bg-[#006B3F] text-white font-semibold py-3 rounded-2xl flex justify-center items-center gap-2">
            Solicitar informes →
          </button>
        </div>
      </div>

      {/* BÁSCULA */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3 text-orange-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2.586a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H6a1 1 0 00-.707.293L2.879 11.707A1 1 0 012.172 12H2V5h3z"/></svg>
        </div>
        <h3 className="font-bold text-xl mb-1">Báscula Inteligente</h3>
        <p className="text-gray-500 text-sm mb-4">Dirígete a la báscula para conocer tu peso y estado de salud.</p>
        <img src="./images/bascu.png" alt="Báscula" className="w-full h-40 object-cover rounded-2xl" />
      </div>

      {/* ESPEJO DIGITAL AR */}
      <div className="bg-[#006B3F] text-white p-6 rounded-3xl shadow-md relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase">Nuevo AR</span>
        </div>
        <h3 className="font-bold text-2xl mb-2">Espejo Digital (AR)</h3>
        <p className="text-sm text-green-50 mb-6">Pruébate tus próximos lentes de forma virtual usando realidad aumentada.</p>
        <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2">
          Smart Filter
        </button>
      </div>

      {/* TARJETA HISTORIA Y ACTIVIDADES */}
      <div className="pt-2">
        <h3 className="font-bold text-xl mb-1">Entretenimiento</h3>
        
        {/* Botón abrir historia */}
        <div 
          onClick={() => setModalHistoria(true)}
          className="bg-gray-50 p-5 rounded-3xl border border-gray-200 mt-4 cursor-pointer flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#006B3F] text-white rounded-full flex items-center justify-center font-bold text-sm">2003</div>
            <div>
              <div className="text-sm font-bold text-gray-800">Conoce nuestra historia</div>
              <div className="text-xs text-gray-500">Toca para ver la línea del tiempo</div>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>

        {/* BOTÓN: ABRIR MENÚ DE ACTIVIDADES */}
        <button 
          onClick={() => { setActividadActiva("menu"); setModalActividades(true); }}
          className="w-full mt-4 border-2 border-[#006B3F] text-[#006B3F] py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
        >
          Explorar Actividades 🎮
        </button>
      </div>

      {/* =========================================================================
                                MODAL HISTORIA
      ========================================================================== */}
      {modalHistoria && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-6 animate-slide-up relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setModalHistoria(false)} className="absolute top-4 right-4 text-gray-400 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
            <h2 className="text-xl font-bold text-[#006B3F] mb-8 mt-2 text-center">Línea del Tiempo</h2>
            
            <div className="space-y-0 pl-2">
              {historia.map((h, index) => (
                <div key={index} className="flex gap-5 relative pb-8">
                  {index !== historia.length - 1 && (
                    <div className="absolute left-[7px] top-6 bottom-[-8px] w-0.5 bg-green-100"></div>
                  )}
                  <div className="w-4 h-4 bg-[#006B3F] rounded-full mt-1 z-10 shrink-0 ring-4 ring-green-50"></div>
                  <div className="-mt-1.5">
                    <span className="inline-block bg-green-50 text-[#006B3F] text-[11px] font-bold px-2.5 py-1 rounded-lg mb-1.5">{h.y}</span>
                    <h4 className="font-bold text-gray-800 text-[15px]">{h.t}</h4>
                    <p className="text-sm text-gray-500 mt-1">{h.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
                           MODAL MULTI-ACTIVIDADES
      ========================================================================== */}
      {modalActividades && (
        <div className="fixed inset-0 bg-[#006B3F] z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl text-center relative overflow-y-auto max-h-[90vh]">
            <button onClick={cerrarActividades} className="absolute top-4 right-4 text-gray-400 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
            
            {/* ---------------- MENÚ PRINCIPAL ---------------- */}
            {actividadActiva === "menu" && (
              <div className="animate-fade-in mt-2">
                <span className="text-4xl block mb-2">🎯</span>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Elige una actividad</h2>
                <div className="space-y-4">
                  <button onClick={() => setActividadActiva("trivia")} className="w-full py-4 border-2 border-gray-200 rounded-2xl font-bold hover:border-[#006B3F] hover:text-[#006B3F] hover:bg-green-50 transition-colors flex items-center justify-center gap-3">
                    <span className="text-2xl">🧠</span> Trivia Médica
                  </button>
                  <button onClick={() => setActividadActiva("visual")} className="w-full py-4 border-2 border-gray-200 rounded-2xl font-bold hover:border-[#006B3F] hover:text-[#006B3F] hover:bg-green-50 transition-colors flex items-center justify-center gap-3">
                    <span className="text-2xl">👁️</span> Reto Visual
                  </button>
                  <button onClick={() => setActividadActiva("nutricion")} className="w-full py-4 border-2 border-gray-200 rounded-2xl font-bold hover:border-[#006B3F] hover:text-[#006B3F] hover:bg-green-50 transition-colors flex items-center justify-center gap-3">
                    <span className="text-2xl">🍎</span> Test de Hábitos
                  </button>
                </div>
              </div>
            )}

            {/* ---------------- JUEGO 1: TRIVIA ---------------- */}
            {actividadActiva === "trivia" && (
              <>
                {!categoriaSeleccionada && (
                  <div className="animate-fade-in">
                    <button onClick={() => setActividadActiva("menu")} className="text-[#006B3F] text-sm font-bold mb-4 flex items-center gap-1">← Volver</button>
                    <span className="text-4xl block mb-2">🧠</span>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Elige una categoría</h2>
                    <div className="space-y-3">
                      {Object.keys(bancoTrivia).map((cat) => (
                        <button key={cat} onClick={() => seleccionarCategoria(cat)} className="w-full py-4 border-2 border-[#006B3F] text-[#006B3F] rounded-2xl font-bold hover:bg-[#006B3F] hover:text-white transition-colors">{cat}</button>
                      ))}
                    </div>
                  </div>
                )}

                {categoriaSeleccionada && !juegoTerminado && (
                  <div className="animate-fade-in">
                    <p className="text-[#006B3F] font-bold mb-1 uppercase text-xs">{categoriaSeleccionada}</p>
                    <p className="text-gray-400 text-xs mb-4">Pregunta {preguntaActual + 1} de 5</p>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 min-h-[60px] flex items-center justify-center">
                      {bancoTrivia[categoriaSeleccionada][preguntaActual].q}
                    </h3>
                    <div className="space-y-3">
                      {bancoTrivia[categoriaSeleccionada][preguntaActual].o.map((opt, idx) => (
                        <button key={idx} onClick={() => responderTrivia(idx)} disabled={mostrarResultado !== null}
                          className={`w-full py-3 px-6 border-2 rounded-2xl font-bold transition-all ${mostrarResultado && idx === bancoTrivia[categoriaSeleccionada][preguntaActual].a ? "bg-green-500 text-white border-green-500" : mostrarResultado && idx !== bancoTrivia[categoriaSeleccionada][preguntaActual].a ? "bg-gray-100 text-gray-400 border-gray-100" : "bg-white text-[#006B3F] border-[#006B3F] hover:bg-green-50"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {mostrarResultado && (
                      <p className={`mt-6 font-bold text-lg animate-bounce ${mostrarResultado === "correcto" ? "text-green-500" : "text-red-500"}`}>
                        {mostrarResultado === "correcto" ? "¡Correcto! 🎉" : "Incorrecto 😅"}
                      </p>
                    )}
                  </div>
                )}

                {juegoTerminado && (
                  <div className="animate-fade-in py-4">
                    <span className="text-5xl block mb-4">🏆</span>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Completado!</h2>
                    <p className="text-gray-500 mb-6">Acertaste {puntos} de 5 preguntas.</p>
                    <button onClick={() => setCategoriaSeleccionada(null)} className="w-full bg-[#006B3F] text-white py-4 rounded-2xl font-bold mb-3">Jugar otra categoría</button>
                    <button onClick={() => setActividadActiva("menu")} className="w-full bg-gray-100 text-gray-600 py-3 rounded-2xl font-bold">Volver al menú</button>
                  </div>
                )}
              </>
            )}

            {/* ---------------- JUEGO 2: RETO VISUAL (5 PREGUNTAS) ---------------- */}
            {actividadActiva === "visual" && (
              <div className="animate-fade-in">
                {pasoVisual === 0 && (
                  <div className="pt-2">
                    <button onClick={() => setActividadActiva("menu")} className="text-[#006B3F] text-sm font-bold mb-4 flex items-center gap-1">← Volver</button>
                    <span className="text-5xl block mb-4">👁️</span>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Reto de Agudeza</h2>
                    <p className="text-gray-500 mb-6 text-sm">Contesta estas 5 rápidas preguntas para conocer el estado actual de tu salud visual.</p>
                    <button onClick={() => setPasoVisual(1)} className="w-full bg-[#006B3F] text-white py-4 rounded-2xl font-bold">Empezar Test</button>
                  </div>
                )}
                
                {pasoVisual === 1 && (
                  <div>
                    <p className="text-[#006B3F] font-bold mb-1 uppercase text-xs">Reto Visual</p>
                    <p className="text-gray-400 text-xs mb-4">Pregunta 1 de 5</p>
                    <div className="bg-gray-50 py-6 rounded-2xl mb-6 font-serif">
                      <p className="text-3xl font-bold tracking-[0.3em] mb-2">T Z P</p>
                      <p className="text-xl font-bold tracking-[0.4em] mb-2">E C F D</p>
                      <p className="text-sm font-bold tracking-[0.5em] mb-1 blur-[0.5px]">P T O Z</p>
                      <p className="text-[10px] font-bold tracking-[0.5em] blur-[1px]">C F D T E P</p>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-4">Aléjate 30cm, ¿Pudiste leer la línea más pequeña?</h3>
                    <div className="space-y-3">
                      <button onClick={() => setPasoVisual(2)} className="w-full py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:border-[#006B3F] hover:text-[#006B3F]">Sí, perfectamente</button>
                      <button onClick={() => setPasoVisual(2)} className="w-full py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:border-[#006B3F] hover:text-[#006B3F]">Me costó trabajo</button>
                      <button onClick={() => setPasoVisual(2)} className="w-full py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:border-[#006B3F] hover:text-[#006B3F]">Se veía muy borroso</button>
                    </div>
                  </div>
                )}

                {pasoVisual >= 2 && pasoVisual <= 5 && (
                  <div>
                    <p className="text-[#006B3F] font-bold mb-1 uppercase text-xs">Reto Visual</p>
                    <p className="text-gray-400 text-xs mb-4">Pregunta {pasoVisual} de 5</p>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 min-h-[60px] flex items-center justify-center">
                      {preguntasVisual[pasoVisual - 2].q}
                    </h3>
                    <div className="space-y-3">
                      {preguntasVisual[pasoVisual - 2].o.map((opcion, i) => (
                        <button key={i} onClick={() => setPasoVisual(prev => prev + 1)} className="w-full py-3 px-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:border-[#006B3F] hover:text-[#006B3F] hover:bg-green-50 transition-colors">
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {pasoVisual === 6 && (
                  <div className="pt-4">
                    <span className="text-5xl block mb-4">👓</span>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">¡Cuidemos esos ojos!</h2>
                    <p className="text-gray-500 mb-6 text-sm">Según tus respuestas, tu vista trabaja duro todos los días. Recuerda que aquí mismo en la clínica tenemos Óptica.</p>
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-200 mb-6">
                      <p className="text-[#006B3F] font-bold text-sm">Pregunta en recepción y aprovecha tu examen de la vista GRATIS hoy.</p>
                    </div>
                    <button onClick={() => setActividadActiva("menu")} className="w-full bg-[#006B3F] text-white py-4 rounded-2xl font-bold">Entendido</button>
                  </div>
                )}
              </div>
            )}

            {/* ---------------- JUEGO 3: TEST DE HÁBITOS (5 PREGUNTAS) ---------------- */}
            {actividadActiva === "nutricion" && (
              <div className="animate-fade-in">
                {pasoNutricion === 0 && (
                  <div className="pt-2">
                    <button onClick={() => setActividadActiva("menu")} className="text-[#006B3F] text-sm font-bold mb-4 flex items-center gap-1">← Volver</button>
                    <span className="text-5xl block mb-4">🍎</span>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Test de Hábitos</h2>
                    <p className="text-gray-500 mb-6 text-sm">Responde 5 preguntas sencillas para analizar tu estilo de vida actual.</p>
                    <button onClick={() => setPasoNutricion(1)} className="w-full bg-[#006B3F] text-white py-4 rounded-2xl font-bold">Comenzar Análisis</button>
                  </div>
                )}

                {pasoNutricion >= 1 && pasoNutricion <= 5 && (
                  <div>
                    <p className="text-[#006B3F] font-bold mb-1 uppercase text-xs">Test de Hábitos</p>
                    <p className="text-gray-400 text-xs mb-4">Pregunta {pasoNutricion} de 5</p>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 min-h-[60px] flex items-center justify-center">
                      {preguntasNutricion[pasoNutricion - 1].q}
                    </h3>
                    <div className="space-y-3">
                      {preguntasNutricion[pasoNutricion - 1].o.map((opcion, i) => (
                        <button key={i} onClick={() => setPasoNutricion(prev => prev + 1)} className="w-full py-3 px-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:border-[#006B3F] hover:text-[#006B3F] hover:bg-green-50 transition-colors">
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {pasoNutricion === 6 && (
                  <div className="pt-4">
                    <span className="text-5xl block mb-4">⚖️</span>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">¿Sabías qué?</h2>
                    <p className="text-gray-500 mb-6 text-sm">No todo tu peso es grasa. Tus músculos, huesos y el agua que tomas cambian el número en la báscula todos los días según tus hábitos.</p>
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 mb-6 text-left">
                      <p className="text-orange-800 font-bold text-sm mb-1">¡Descubre tus números reales!</p>
                      <p className="text-orange-700 text-xs">Dirígete a nuestra Báscula Inteligente en la sala y obtén tu análisis corporal completo al instante.</p>
                    </div>
                    <button onClick={() => setActividadActiva("menu")} className="w-full bg-[#006B3F] text-white py-4 rounded-2xl font-bold">Volver al menú</button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}