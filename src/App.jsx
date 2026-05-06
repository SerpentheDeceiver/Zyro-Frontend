import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/common/AppLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import VerifiedSellerRoute from './routes/VerifiedSellerRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import PageLoader from './components/common/PageLoader.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CreateListingPage from './pages/CreateListingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import WalletPage from './pages/WalletPage.jsx';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />

          {/* Products */}
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Orders */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Chat */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:chatId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Wallet */}
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            }
          />

          {/* Profile & Settings */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Create listing */}
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <VerifiedSellerRoute>
                  <CreateListingPage />
                </VerifiedSellerRoute>
              </ProtectedRoute>
            }
          />

          {/* Legacy / convenience redirects */}
          <Route path="/create-listing" element={<Navigate to="/sell" replace />} />
          <Route path="/chats" element={<Navigate to="/chat" replace />} />
          <Route path="/account" element={<Navigate to="/profile" replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  return <AppRoutes />;
}
