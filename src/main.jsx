import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/common/Layout.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CreateListingPage from './pages/CreateListingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import KYCPage from './pages/KYCPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import WalletPage from './pages/WalletPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PublicRoute from './routes/PublicRoute.jsx';
import './index.css';

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes key={location.pathname}>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/create-listing" element={<CreateListingPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/chats/:chatId" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/kyc" element={<KYCPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '0.75rem',
              boxShadow:
                '0 14px 40px rgba(15, 23, 42, 0.08)',
              fontWeight: 500,
              fontSize: '0.875rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            },
            success: {
              style: {
                background: '#F0FDF4',
                color: '#166534',
                borderLeft: '4px solid #22C55E',
              },
              icon: '✓',
            },
            error: {
              style: {
                background: '#FEF2F2',
                color: '#991B1B',
                borderLeft: '4px solid #EF4444',
              },
              icon: '✕',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
