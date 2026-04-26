import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import BottomNav from './BottomNav.jsx';
import BackToTop from './BackToTop.jsx';

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-6">
        <Outlet />
      </main>
      <BackToTop />
      <BottomNav />
    </>
  );
}
