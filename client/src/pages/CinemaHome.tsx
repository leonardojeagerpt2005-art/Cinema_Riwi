import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Film, Search, LifeBuoy, LogOut, Ticket, Star, Sparkles, User, Calendar, Clock } from "lucide-react";
import { CinematicBackground } from "../components/CinematicBackground";
import { MovieCard } from "../components/MovieCard";
import { SeatSelector } from "../components/SeatSelector";
import { SupportModal } from "../components/SupportModal";

export default function CinemaHome() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [activeTab, setActiveTab] = useState<"catalog" | "bookings">("catalog");

  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<any>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("cinema_user");
    if (!stored) {
      setLocation("/login");
      return;
    }
    setUser(JSON.parse(stored));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moviesRes, bookingsRes] = await Promise.all([
        fetch("/api/movies"),
        fetch("/api/bookings"),
      ]);
      const moviesData = await moviesRes.json();
      const bookingsData = await bookingsRes.json();
      setMovies(moviesData);
      setBookings(bookingsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cinema_user");
    setLocation("/login");
  };

  const filteredMovies = movies.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.synopsis.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === "Todos" || m.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  const userBookings = bookings.filter((b) => b.userEmail === user?.email);

  return (
    <div className="min-h-screen relative pb-16">
      <CinematicBackground />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 liquid-glass border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("catalog")}>
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
              onClick={() => setActiveTab("catalog")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "catalog"
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              Cartelera
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === "bookings"
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Mis Reservas ({userBookings.length})</span>
            </button>

            <button
              onClick={() => setIsSupportOpen(true)}
              className="water-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Soporte</span>
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
        {activeTab === "catalog" ? (
          <>
            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden liquid-glass border border-cyan-500/30 mb-10 p-6 md:p-10 shadow-2xl">
              <div className="absolute inset-0 z-0">
                <img
                  src="https://m.media-amazon.com/images/I/61YakdzorpS._SL500_.jpg"
                  alt="Hero Banner"
                  className="w-full h-full object-cover opacity-30 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#060913] via-[#060913]/80 to-transparent" />
              </div>

              <div className="relative z-10 max-w-xl space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Estreno Estelar IMAX</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                  NEON HORIZON
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  En un futuro dominado por megaciudades flotantes, un hacker descubre un secreto que podría apagar la red eterna. Reserva tus butacas con diseño líquido.
                </p>
                <button
                  onClick={() => setSelectedMovieForBooking(movies[0])}
                  className="water-btn px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center space-x-2 shadow-lg"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Reservar Ahora</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar películas, géneros..."
                  className="liquid-glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {["Todos", "Ciencia Ficción", "Suspenso", "Drama", "Acción"].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      selectedGenre === genre
                        ? "bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/30"
                        : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Movie Catalog Grid */}
            {loading ? (
              <div className="py-20 text-center text-slate-400">Cargando cartelera...</div>
            ) : filteredMovies.length === 0 ? (
              <div className="py-20 text-center text-slate-400">No se encontraron películas con ese criterio.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onSelect={(m) => setSelectedMovieForBooking(m)} />
                ))}
              </div>
            )}
          </>
        ) : (
          /* My Bookings Tab */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Mis Entradas y Reservas</h2>
                <p className="text-xs text-slate-400 mt-1">Historial de butacas reservadas en Cinema Riwi</p>
              </div>
            </div>

            {userBookings.length === 0 ? (
              <div className="liquid-glass p-12 rounded-3xl text-center space-y-4 border border-white/10">
                <Ticket className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No tienes reservas activas</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Explora nuestra cartelera y selecciona tus películas favoritas para apartar tus butacas.
                </p>
                <button
                  onClick={() => setActiveTab("catalog")}
                  className="water-btn px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase inline-block"
                >
                  Ver Cartelera
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userBookings.map((b) => (
                  <div key={b.id} className="liquid-glass rounded-2xl p-6 border border-cyan-500/30 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5">
                    <img src={b.poster} alt={b.movieTitle} className="w-24 h-32 object-cover rounded-xl shadow-md shrink-0 mx-auto sm:mx-0" />
                    <div className="flex flex-col justify-between flex-grow space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Confirmada
                          </span>
                          <span className="text-xs text-slate-400">ID: #{b.id}</span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1.5">{b.movieTitle}</h3>
                        <div className="flex items-center space-x-3 text-xs text-slate-300 mt-1">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            <span>{b.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>{b.showtime}</span>
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Asientos: <strong className="text-cyan-300">{b.seats.join(", ")}</strong></span>
                        <span className="font-bold text-white">${b.total.toFixed(2)} USD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Seat Selector Modal */}
      {selectedMovieForBooking && (
        <SeatSelector
          movie={selectedMovieForBooking}
          user={user}
          onClose={() => setSelectedMovieForBooking(null)}
          onBookingSuccess={fetchData}
        />
      )}

      {/* Support Modal */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} userEmail={user?.email} />
    </div>
  );
}
