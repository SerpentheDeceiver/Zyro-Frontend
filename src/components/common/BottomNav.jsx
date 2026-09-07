import { Home, Search, Plus, Clipboard, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const TAB_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, path: '/home' },
  { id: 'search', label: 'Search', icon: Search, path: '/products' },
  { id: 'create', label: 'Create', icon: Plus, path: '/create-listing' },
  { id: 'orders', label: 'Orders', icon: Clipboard, path: '/orders' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white md:hidden">
      <div className="flex items-center justify-around pb-safe px-2">
        {TAB_ITEMS.map(({ id, label, icon: Icon, path }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');

          return (
            <Link
              key={id}
              to={path}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-3 px-2 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              aria-label={label}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? 'fill-current' : ''
                }`}
              />
              <span className="text-xs font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>

      <style>{`
        @supports (padding: max(0px)) {
          nav {
            padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </nav>
  );
}
