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
import OrdersPage from './pages/OrdersPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
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
          <Route path="/products/:id" element={<ProductDetailPage />} />
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
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
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
