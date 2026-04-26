import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Navbar, { BottomMobileNav } from './Navbar.jsx';
import BackToTop from './BackToTop.jsx';

export default function Layout({ showMobileNav = true }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* key forces re-mount (and re-animation) on every route change */}
        <div key={location.pathname} className="animate-fade-slide-up">
          <Outlet />
        </div>
      </main>
      {showMobileNav ? <BottomMobileNav /> : null}
      <BackToTop />
    </div>
  );
}
