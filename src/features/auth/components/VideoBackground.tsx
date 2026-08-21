export function VideoBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/login-bg.mp4"
        poster="/videos/login-bg-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      {/* Overlay oscuro para mantener legible el formulario */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

      {/* Partículas flotando sobre el video — solo transform/opacity */}
      <div className="absolute top-1/4 left-[15%] w-2 h-2 bg-cyan-300 rounded-full blur-[1px] particle" style={{ animationDuration: "9s" }} />
      <div className="absolute top-2/3 left-3/4 w-2.5 h-2.5 bg-purple-300 rounded-full blur-[1px] particle" style={{ animationDuration: "11s", animationDelay: "-3s" }} />
      <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-blue-200 rounded-full blur-[1px] particle" style={{ animationDuration: "8s", animationDelay: "-5s" }} />
    </div>
  );
}
