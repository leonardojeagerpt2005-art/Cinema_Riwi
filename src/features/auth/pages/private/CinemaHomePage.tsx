import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film, MapPin, LogOut, Sparkles, Ticket } from "lucide-react";
import { LocationModal } from "../../components/location/LocationModal";
import { useLocation } from "../../components/location/useLocation";
import { getCurrencyForCountry } from "../../components/location/currencies";

export default function CinemaHomePage() {
  const navigate = useNavigate();
  const locationStore = useLocation();
  const user = (() => {
    const stored = localStorage.getItem("cinema_user");
    return stored ? (JSON.parse(stored) as { name?: string; email?: string }) : null;
  })();
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const currency = getCurrencyForCountry(locationStore.selection.country);

  useEffect(() => {
    if (!localStorage.getItem("cinema_user")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("cinema_user");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen relative pb-16">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#1e1b4b] via-[#090d16] to-[#030712]" />

      <header className="sticky top-0 z-40 liquid-glass border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(14,165,233,0.4)]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wider text-white">CINEMA RIWI</h2>
              <p className="text-[10px] text-cyan-300">Cartelera IMAX & Líquida</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLocationOpen(true)}
              className="water-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
              title="Seleccionar ubicación"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{locationStore.confirmedCity || locationStore.selection.city || "Ubicación"}</span>
            </button>

            <div className="hidden md:flex items-center space-x-2 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                {user?.name?.[0] || "U"}
              </div>
              <span className="text-xs font-medium text-slate-200">{user?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-white/10"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden liquid-glass border border-cyan-500/30 p-6 md:p-10 shadow-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sesión iniciada correctamente</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Bienvenido a la cartelera
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mt-3 max-w-xl">
            {locationStore.confirmedCity ? (
              <>
                Tu ubicación activa es <strong className="text-cyan-300">{locationStore.confirmedCity}</strong>{" "}
                y los precios se muestran en <strong className="text-cyan-300">{currency.code}</strong>.
              </>
            ) : (
              <>Selecciona tu ubicación desde el botón superior para activar la cartelera y los precios locales.</>
            )}
          </p>

          <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs font-semibold">
            <Ticket className="w-4 h-4 text-cyan-400" />
            <span>Cartelera en construcción</span>
          </div>
        </div>
      </main>

      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </div>
  );
}
