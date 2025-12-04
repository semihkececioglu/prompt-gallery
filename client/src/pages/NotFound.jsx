import { Link } from "react-router-dom";
import { Search, Home } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 sm:p-10 text-center max-w-md animate-scale-in">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-6">
          <Search size={32} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">404</h1>
        <p className="text-secondary mt-3 text-sm sm:text-base">
          Aradığın sayfa bulunamadı
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 mt-6 btn-primary px-6 py-2.5 rounded-xl font-medium text-sm"
        >
          <Home size={16} />
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
