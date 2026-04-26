import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  CirclePlus,
  Home,
  MessageCircle,
  Search,
  Settings,
  ShoppingBag,
  User,
  Wallet,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';
import Badge from './Badge.jsx';

function TooltipIconLink({ to, icon: Icon, label, showDot = false, className = '' }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'group relative inline-flex h-10 w-10 items-center justify-center rounded-full transition',
          isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
          className,
        ]
          .filter(Boolean)
          .join(' ')
      }
      aria-label={label}
    >
      <Icon className="h-5 w-5" />
      {showDot ? (
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" aria-hidden="true" />
      ) : null}
      <span className="pointer-events-none absolute -bottom-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-white group-hover:block">
        {label}
      </span>
    </NavLink>
  );
}

function MobileTopActions({ hasUnread }) {
  return (
    <div className="flex items-center gap-1 md:hidden">
      <TooltipIconLink to="/products" icon={Search} label="Search" />
      <TooltipIconLink to="/notifications" icon={Bell} label="Notifications" showDot={hasUnread} />
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const hasUnreadNotifications = true;
  const displayName = user?.fullName || user?.name || 'Zyro Member';

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) setOpen(false);
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  function handleLogout() {
    setOpen(false);
    logout();
    navigate('/auth');
  }

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-[160px] items-center">
          <Link to="/home" className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-primary">
            <img src="/src/assets/logo/logo.svg" alt="Zyro Logo" className="h-10 md:h-12 w-auto object-contain brightness-0" />
            <span className="text-xl font-semibold text-gray-800">Zyro</span>
          </Link>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <label className="group flex min-w-[400px] max-w-[540px] items-center gap-2 rounded-pill bg-slate-100 px-4 py-2.5 transition-all duration-200 focus-within:scale-[1.02] focus-within:ring-4 focus-within:ring-primary/10">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search marketplace..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="flex min-w-[160px] items-center justify-end gap-1">
          <div className="hidden items-center gap-1 md:flex">
            <TooltipIconLink to="/chats" icon={MessageCircle} label="Chats" />
            <TooltipIconLink to="/notifications" icon={Bell} label="Notifications" showDot={hasUnreadNotifications} />
            <TooltipIconLink to="/create-listing" icon={CirclePlus} label="Create Listing" />
          </div>

          <MobileTopActions hasUnread={hasUnreadNotifications} />

          <div className="relative ml-1" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="inline-flex rounded-full p-0.5 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              aria-label="Open user menu"
            >
              <Avatar name={displayName} url={user?.avatarUrl} size="md" />
            </button>

            {open ? (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft animate-fade-in">
                <div className="rounded-xl px-3 py-3">
                  <p className="text-sm font-semibold text-ink">{displayName}</p>
                  <div className="mt-1">
                    <Badge variant={user?.isVerified ? 'verified' : 'escrow'}>
                      {user?.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </div>

                <div className="my-1 h-px bg-slate-100" />

                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
                <Link
                  to="/products"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <ShoppingBag className="h-4 w-4" />
                  My Listings
                </Link>
                <Link
                  to="/wallet"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <Wallet className="h-4 w-4" />
                  Wallet
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Orders
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>

                <div className="my-1 h-px bg-slate-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                >
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export function BottomMobileNav() {
  const items = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/products', label: 'Search', icon: Search },
    { to: '/create-listing', label: 'Create', icon: CirclePlus },
    { to: '/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex flex-col items-center justify-center gap-1 rounded-lg py-1 text-[11px] font-medium transition',
                isActive ? 'text-primary' : 'text-slate-500',
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
