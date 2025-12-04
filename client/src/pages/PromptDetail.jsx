import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPromptById } from "../services/api";
import {
  ArrowLeft,
  Copy,
  Check,
  Code,
  AlertTriangle,
  Shirt,
} from "lucide-react";

function PromptDetail() {
  const { id } = useParams();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const data = await getPromptById(id);
        setPrompt(data);
      } catch (err) {
        setError("Prompt bulunamadı");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Kopyalama hatası:", err);
    }
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card px-8 py-8 rounded-2xl text-center max-w-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle size={32} />
          </div>
          <p className="text-primary font-medium">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-accent hover:underline mt-4 text-sm"
          >
            <ArrowLeft size={16} />
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Minimal Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Geri Dön
        </Link>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Görsel - Küçük & Centered */}
        <div className="mb-8 animate-fade-in flex justify-center">
          <div className="glass-card rounded-2xl overflow-hidden max-w-lg w-full">
            {prompt.image ? (
              <img
                src={prompt.image}
                alt={prompt.title}
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="aspect-[16/9] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl">
                  <Shirt size={40} strokeWidth={2} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Başlık ve Açıklama */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
            {prompt.title}
          </h1>
          <p className="text-secondary text-base leading-relaxed">
            {prompt.description || "Açıklama yok"}
          </p>
        </div>

        {/* Prompt Bölümü */}
        <div
          className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Başlık ve Kopyala Butonu */}
          <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-200">
            <span className="text-secondary text-sm font-medium flex items-center gap-2">
              <Code size={16} />
              Prompt
            </span>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                copied
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                  : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl"
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">
                {copied ? "Kopyalandı!" : "Kopyala"}
              </span>
            </button>
          </div>

          {/* Kod Bloğu */}
          <div className="p-5 bg-white">
            <pre className="overflow-x-auto text-sm leading-relaxed">
              <code className="text-primary font-mono">{prompt.prompt}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PromptDetail;
