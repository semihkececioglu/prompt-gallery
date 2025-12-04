import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getPrompts,
  createPrompt,
  deletePrompt,
  updatePrompt,
  login,
} from "../services/api";
import Snackbar from "../components/Snackbar";
import AlertModal from "../components/AlertModal";
import {
  Settings,
  ExternalLink,
  LogOut,
  Pencil,
  Trash2,
  Plus,
  Lock,
  ArrowLeft,
  X,
  Shirt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Admin() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Data state
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 6;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    prompt: "",
  });

  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    image: "",
    description: "",
    prompt: "",
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  // Alert Modal state
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    promptId: null,
  });

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ isOpen: true, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchPrompts();
    }
  }, []);

  const fetchPrompts = async () => {
    setLoading(true);
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
      showSnackbar("Promptlar yüklenemedi", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const data = await login(username, password);
      if (data.success) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        fetchPrompts();
        showSnackbar("Giriş başarılı!", "success");
      }
    } catch (err) {
      setLoginError("Geçersiz kullanıcı adı veya şifre");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.prompt) {
      showSnackbar("Başlık ve Prompt alanları zorunlu", "error");
      return;
    }

    try {
      await createPrompt(formData);
      showSnackbar("Prompt başarıyla eklendi!", "success");
      setFormData({ title: "", image: "", description: "", prompt: "" });
      fetchPrompts();
    } catch (err) {
      showSnackbar("Prompt eklenirken hata oluştu", "error");
    }
  };

  const openDeleteModal = (id) => {
    setAlertModal({ isOpen: true, promptId: id });
  };

  const closeDeleteModal = () => {
    setAlertModal({ isOpen: false, promptId: null });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePrompt(alertModal.promptId);
      showSnackbar("Prompt başarıyla silindi", "success");
      fetchPrompts();
    } catch (err) {
      showSnackbar("Silme işlemi başarısız", "error");
    } finally {
      closeDeleteModal();
    }
  };

  const openEditModal = (prompt) => {
    setEditingPrompt(prompt);
    setEditFormData({
      title: prompt.title,
      image: prompt.image || "",
      description: prompt.description || "",
      prompt: prompt.prompt,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPrompt(null);
    setEditFormData({ title: "", image: "", description: "", prompt: "" });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editFormData.title || !editFormData.prompt) {
      showSnackbar("Başlık ve Prompt alanları zorunlu", "error");
      return;
    }

    try {
      await updatePrompt(editingPrompt.id, editFormData);
      showSnackbar("Prompt başarıyla güncellendi!", "success");
      closeEditModal();
      fetchPrompts();
    } catch (err) {
      showSnackbar("Güncelleme başarısız", "error");
    }
  };

  // Filter prompts by search query
  const filteredPrompts = prompts.filter((prompt) =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastPrompt = currentPage * promptsPerPage;
  const indexOfFirstPrompt = indexOfLastPrompt - promptsPerPage;
  const currentPrompts = filteredPrompts.slice(indexOfFirstPrompt, indexOfLastPrompt);
  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="glass-card p-8 rounded-3xl w-full max-w-md animate-scale-in shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center text-white mb-5 shadow-xl">
              <Lock size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">Admin Panel</h1>
            <p className="text-secondary text-sm">Devam etmek için giriş yapın</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 text-sm glass-input rounded-xl focus:outline-none"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm glass-input rounded-xl focus:outline-none"
                placeholder="••••••"
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 btn-primary rounded-xl font-semibold text-sm mt-6"
            >
              Giriş Yap
            </button>
          </form>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-secondary hover:text-primary mt-6 text-sm transition font-medium"
          >
            <ArrowLeft size={16} />
            Ana Sayfaya Dön
          </Link>
        </div>

        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          isOpen={snackbar.isOpen}
          onClose={closeSnackbar}
        />
      </div>
    );
  }

  // ADMIN PANEL
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      {/* Header - Home Style */}
      <header className="px-4 sm:px-6 pt-6">
        <div className="max-w-3xl mx-auto">
          <div className="border-2 border-white/60 backdrop-blur-sm bg-white/10 rounded-2xl shadow-lg">
            <div className="px-5 sm:px-6 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                  <Settings size={19} strokeWidth={2.5} />
                </div>
                <span className="text-primary font-bold text-sm sm:text-base tracking-tight">
                  Admin Panel
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="p-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 transition-all"
                  title="Siteyi Gör"
                >
                  <ExternalLink size={18} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-gray-700 hover:bg-red-50 transition-all"
                  title="Çıkış Yap"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SOL: Ekleme Formu */}
          <div className="glass-card rounded-2xl p-5 animate-slide-up shadow-xl h-[580px]">
            <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
              <Plus size={18} />
              Yeni Prompt Ekle
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">
                  Başlık *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 text-sm glass-input rounded-lg focus:outline-none"
                  placeholder="Prompt başlığı"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">
                  Görsel URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 text-sm glass-input rounded-lg focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2 relative group">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-28 object-contain rounded-lg bg-white/50"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">
                  Açıklama
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 text-sm glass-input rounded-lg focus:outline-none"
                  placeholder="Kısa açıklama"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">
                  Prompt *
                </label>
                <textarea
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full px-3 py-2 text-sm glass-input rounded-lg focus:outline-none resize-none"
                  placeholder="Prompt içeriği"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 btn-success rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Ekle
              </button>
            </form>
          </div>

          {/* SAĞ: Mevcut Promptlar */}
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="glass-card rounded-2xl p-5 shadow-xl h-[580px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-primary flex items-center gap-2">
                  <Shirt size={18} />
                  Promptlar
                </h2>
                <span className="px-2.5 py-0.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded">
                  {filteredPrompts.length}
                </span>
              </div>

              {/* Search */}
              <div className="mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Ara..."
                  className="w-full px-3 py-2 text-sm glass-input rounded-lg focus:outline-none"
                />
              </div>

              {loading ? (
                <div className="py-12 text-center">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-secondary text-xs mt-3">Yükleniyor...</p>
                </div>
              ) : filteredPrompts.length === 0 ? (
                <div className="py-12 text-center">
                  <Shirt size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-secondary text-sm">
                    {searchQuery ? "Sonuç bulunamadı" : "Henüz prompt yok"}
                  </p>
                </div>
              ) : (
                <>
                  {/* Fixed height container */}
                  <div className="space-y-2 mb-4 flex-1 overflow-y-auto">
                    {currentPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="bg-white/60 border border-gray-200 rounded-lg p-3 flex justify-between items-center gap-3 hover:bg-white/80 hover:border-gray-300 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {prompt.image ? (
                            <img
                              src={prompt.image}
                              alt={prompt.title}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <Shirt size={18} className="text-indigo-500" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-primary text-sm truncate">
                              {prompt.title}
                            </p>
                            {prompt.description && (
                              <p className="text-secondary text-xs truncate">
                                {prompt.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => openEditModal(prompt)}
                            className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                            title="Düzenle"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(prompt.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            title="Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/50 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/80 transition"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition ${
                            currentPage === page
                              ? "bg-indigo-500 text-white"
                              : "bg-white/50 text-gray-700 hover:bg-white/80"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/50 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/80 transition"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="modal-content rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                  <Pencil size={18} strokeWidth={2.5} />
                </div>
                Prompt Düzenle
              </h2>
              <button
                onClick={closeEditModal}
                className="btn-icon p-2 rounded-xl text-secondary hover:bg-red-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2.5 text-sm glass-input rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Görsel URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={editFormData.image}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2.5 text-sm glass-input rounded-xl focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                {editFormData.image && (
                  <div className="mt-3 relative group">
                    <img
                      src={editFormData.image}
                      alt="Preview"
                      className="w-full h-28 object-contain rounded-xl bg-white/50"
                    />
                    <button
                      type="button"
                      onClick={() => setEditFormData((prev) => ({ ...prev, image: "" }))}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Açıklama
                </label>
                <input
                  type="text"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2.5 text-sm glass-input rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Prompt *
                </label>
                <textarea
                  name="prompt"
                  value={editFormData.prompt}
                  onChange={handleEditFormChange}
                  rows={5}
                  className="w-full px-4 py-2.5 text-sm glass-input rounded-xl focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-3 btn-secondary rounded-xl font-semibold text-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 btn-primary rounded-xl font-semibold text-sm shadow-lg"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        title="Promptu Sil"
        message="Bu promptu silmek istediğine emin misin? Bu işlem geri alınamaz."
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={closeSnackbar}
      />
    </div>
  );
}

export default Admin;
