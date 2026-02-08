import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";
import Home from "./pages/Home.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import WritePage from "./pages/WritePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import BookmarksPage from "./pages/BookmarksPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import ChatWidget from "./components/chat/ChatWidget.jsx";
import SeederPage from "./pages/SeederPage.jsx";
import DraftsPage from "./pages/DraftsPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/write" element={<ProtectedRoute><WritePage /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/drafts" element={<ProtectedRoute><DraftsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/user/:username" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/seed" element={<SeederPage />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}