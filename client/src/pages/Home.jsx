import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPrompts } from "../services/api";
import {
  Shirt,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Settings,
  Plus,
  Layers,
  Search,
  X,
} from "lucide-react";
import Iridescence from "../components/Iridescence";
import BlurText from "../components/BlurText";

const ITEMS_PER_PAGE = 6;

function Home() {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await getPrompts();
        // Sort by createdAt (newest first)
        const sortedData = [...data].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        setPrompts(sortedData);
      } catch (err) {
        setError("Promptlar yüklenemedi");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  // ESC key to close search modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isSearchOpen]);

  // Pagination hesaplamaları
  const totalPages = Math.ceil(prompts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPrompts = prompts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    document.getElementById("prompts")?.scrollIntoView({ behavior: "smooth" });
  };

  // Smooth scroll fonksiyonu
  const scrollToPrompts = () => {
    document.getElementById("prompts")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Filter prompts by search query
  const filteredSearchResults = prompts.filter((prompt) =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search result click
  const handleSearchResultClick = (promptId) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(`/prompt/${promptId}`);
  };

  // Loading durumu
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card px-6 py-3 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-secondary text-sm">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card px-6 py-4 rounded-xl text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Iridescence Background - Full Body */}
      <div className="fixed inset-0 -z-10">
        <Iridescence
          color={[1, 1, 1]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />
      </div>

      {/* Background Gradient Overlays */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-pink-600/20"></div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>

      {/* Header - Sticky Glass Surface */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 pt-4 pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="border-2 border-white/60 backdrop-blur-sm bg-white/10 rounded-2xl shadow-lg hover:bg-white/15 transition-all duration-300">
            <div className="px-5 sm:px-6 py-3.5 flex justify-between items-center">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
                  <Shirt size={19} strokeWidth={2.5} />
                </div>
                <span className="text-white font-bold text-sm sm:text-base tracking-tight drop-shadow-lg">
                  Prompt Gallery
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-xl text-white hover:bg-white/20 transition-all hover:scale-110"
                  title="Ara"
                >
                  <Search size={20} strokeWidth={2.5} />
                </button>
                <Link
                  to="/admin"
                  className="p-2.5 rounded-xl text-white hover:bg-white/20 transition-all hover:scale-110"
                  title="Admin Panel"
                >
                  <Settings size={20} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 lg:pb-32">
        <div className="relative min-h-[450px] sm:min-h-[550px] lg:min-h-[600px] flex items-center justify-center">
          {/* Floating Shapes - Background Decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"
              style={{ animationDuration: "4s" }}
            ></div>
            <div
              className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDuration: "6s", animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl animate-pulse"
              style={{ animationDuration: "5s", animationDelay: "2s" }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 max-w-4xl mx-auto animate-fade-in">
            {/* Chip - Enhanced with Glow */}
            <div className="inline-flex items-center gap-2.5 bg-white/20 backdrop-blur-lg border border-white/50 px-6 py-2.5 rounded-full text-xs sm:text-sm text-white mb-8 sm:mb-10 shadow-2xl shadow-white/20 hover:bg-white/25 hover:shadow-white/30 transition-all duration-500 cursor-default relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <Sparkles
                size={16}
                className="relative z-10 animate-pulse drop-shadow-lg"
              />
              <span className="relative z-10 font-semibold tracking-wide">
                AI destekli tasarım promptları
              </span>
            </div>

            {/* Başlık - Premium Gradient & Glow */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 sm:mb-8 animate-slide-up">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/95 drop-shadow-2xl [text-shadow:_0_0_30px_rgba(255,255,255,0.3)]">
                Futbol Forması
              </span>
              <span className="block mt-2 sm:mt-3 bg-clip-text text-transparent bg-gradient-to-r from-white/90 via-white/95 to-white/85 drop-shadow-2xl [text-shadow:_0_0_20px_rgba(255,255,255,0.2)]">
                Prompt Koleksiyonu
              </span>
            </h1>

            {/* Subtitle - Enhanced */}
            <p
              className="text-white/85 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-10 sm:mb-12 drop-shadow-xl [text-shadow:_0_2px_10px_rgba(0,0,0,0.3)] animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Profesyonel futbol forması tasarımları için özenle hazırlanmış AI
              promptları keşfedin
            </p>

            {/* Butonlar - Advanced Interactions */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <button
                onClick={scrollToPrompts}
                className="group relative bg-white text-gray-900 px-8 sm:px-10 py-4 rounded-full font-bold inline-flex items-center gap-3 text-sm sm:text-base w-full sm:w-auto justify-center shadow-2xl shadow-white/30 hover:shadow-white/50 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <span className="relative z-10">Promptları Keşfet</span>
                <ArrowRight
                  size={18}
                  className="relative z-10 group-hover:translate-x-2 transition-transform duration-300"
                />
              </button>
              <Link
                to="/admin"
                className="group relative border-2 border-white/60 backdrop-blur-md bg-white/10 text-white px-8 sm:px-10 py-4 rounded-full font-bold inline-flex items-center gap-3 text-sm sm:text-base w-full sm:w-auto justify-center hover:bg-white/20 hover:border-white/80 hover:shadow-2xl hover:shadow-white/20 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <Plus
                  size={18}
                  className="relative z-10 group-hover:rotate-90 transition-transform duration-500"
                />
                <span className="relative z-10">Yeni Prompt Ekle</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative bg-white">
        <div
          id="prompts"
          className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 scroll-mt-20"
        >
          {/* Section Header - Minimal Premium */}
          <div className="relative mb-16 sm:mb-20">
            <div className="flex items-end justify-between border-b border-gray-200 pb-6">
              {/* Title Area */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl sm:text-5xl font-light text-gray-900 tracking-tight">
                    Koleksiyon
                  </h2>
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                </div>
                <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">
                  {prompts.length} Tasarım Promptu
                </p>
              </div>

              {/* Subtle Accent */}
              <div className="hidden sm:flex items-center gap-2 text-gray-400">
                <Layers size={20} strokeWidth={1.5} />
              </div>
            </div>

            {/* Gradient Accent Line */}
            <div className="absolute bottom-0 left-0 h-px w-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          </div>

          {prompts.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 sm:p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                <Shirt size={32} />
              </div>
              <p className="text-secondary">Henüz prompt eklenmemiş</p>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 mt-6 btn-primary px-6 py-2.5 rounded-xl font-medium text-sm"
              >
                <Plus size={18} />
                İlk Promptu Ekle
              </Link>
            </div>
          ) : (
            <>
              {/* Kart Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPrompts.map((prompt, index) => (
                  <Link
                    key={prompt.id}
                    to={`/prompt/${prompt.id}`}
                    className="group relative opacity-0 animate-slide-up"
                    style={{
                      animationDelay: `${index * 0.08}s`,
                      perspective: "1500px",
                    }}
                    onMouseMove={(e) => {
                      const card = e.currentTarget.querySelector(".card-3d");
                      const rect = card.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;
                      const rotateX = (y - centerY) / 10;
                      const rotateY = (centerX - x) / 10;
                      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget.querySelector(".card-3d");
                      card.style.transform =
                        "rotateX(0deg) rotateY(0deg) translateY(0px)";
                    }}
                  >
                    {/* 3D Dynamic Card */}
                    <div
                      className="card-3d relative transition-all duration-300 ease-out rounded-2xl"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Card Background */}
                      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                        {/* Image Container */}
                        <div className="aspect-[4/3] overflow-hidden relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                          {prompt.image ? (
                            <>
                              <img
                                src={prompt.image}
                                alt={prompt.title}
                                className="w-full h-full object-cover"
                              />
                              {/* Subtle Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </>
                          ) : (
                            // Default Icon for No Image
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg">
                                <Shirt size={32} strokeWidth={2} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                              {prompt.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                              {prompt.description || "Açıklama yok"}
                            </p>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center justify-end pt-2">
                            <span className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                              <span>Detayları Gör</span>
                              <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                              />
                            </span>
                          </div>
                        </div>

                        {/* 3D Depth Border */}
                        <div className="absolute inset-0 border border-gray-200 rounded-2xl group-hover:border-indigo-200 transition-colors duration-500 pointer-events-none"></div>
                      </div>

                      {/* 3D Shadow Layer */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ transform: "translateZ(-20px)" }}
                      ></div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10 flex-wrap">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/50 border border-black/5 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/80 transition"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-medium text-sm transition ${
                          currentPage === page
                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white/50 border border-black/5 text-gray-700 hover:bg-white/80"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/50 border border-black/5 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/80 transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20 animate-fade-in"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery("");
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl animate-scale-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Search size={20} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Prompt ara..."
                  className="flex-1 bg-transparent border-none outline-none text-base text-gray-900 placeholder-gray-400"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {searchQuery.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Başlık veya açıklama ile prompt arayın
                </div>
              ) : filteredSearchResults.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Sonuç bulunamadı
                </div>
              ) : (
                <div className="p-2">
                  {filteredSearchResults.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handleSearchResultClick(prompt.id)}
                      className="w-full p-3 rounded-lg hover:bg-gray-50 transition text-left flex items-center gap-3"
                    >
                      {prompt.image ? (
                        <img
                          src={prompt.image}
                          alt={prompt.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Shirt size={20} className="text-indigo-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {prompt.title}
                        </p>
                        {prompt.description && (
                          <p className="text-gray-600 text-xs truncate">
                            {prompt.description}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer - Premium Glass */}
      <footer className="px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="border-2 border-white/60 backdrop-blur-sm bg-white/10 rounded-2xl shadow-lg">
            <div className="px-6 py-4 text-center">
              <p className="text-white/90 text-xs sm:text-sm font-medium tracking-wide drop-shadow-lg">
                © 2025 Prompt Gallery
              </p>
              <p className="text-white/60 text-xs mt-1.5 drop-shadow">
                AI destekli tasarım koleksiyonu
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
