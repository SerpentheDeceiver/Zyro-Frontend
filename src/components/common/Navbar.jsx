import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  Home,
  MapPin,
  MessageCircle,
  Search,
  ShoppingBag,
  User,
  Wallet,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import Avatar from './Avatar.jsx';
import Badge from './Badge.jsx';

const INDIA_STATES = [
  'All India',
  'Tamil Nadu', 'Karnataka', 'Kerala', 'Maharashtra', 'Delhi',
  'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana',
  'West Bengal', 'Bihar', 'Odisha', 'Telangana', 'Andhra Pradesh',
  'Madhya Pradesh', 'Chhattisgarh', 'Assam', 'Jharkhand', 'Uttarakhand',
  'Goa', 'Tripura', 'Manipur', 'Meghalaya', 'Nagaland',
  'Sikkim', 'Arunachal Pradesh', 'Puducherry', 'Chandigarh',
  'Andaman & Nicobar', 'Ladakh', 'Lakshadweep',
];

function TooltipIconLink({ to, icon: Icon, label, showDot = false, className = '' }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'group relative inline-flex h-10 w-10 items-center justify-center rounded-full transition',
          isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
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
      <span className="pointer-events-none absolute -bottom-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white group-hover:block">
        {label}
      </span>
    </NavLink>
  );
}

function LocationSelector({ location, setLocation }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative hidden md:block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
      >
        <MapPin className="h-4 w-4 text-indigo-600" />
        <span className="max-w-[110px] truncate">{location}</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-64 w-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {INDIA_STATES.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => { setLocation(state); setOpen(false); }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                location === state
                  ? 'bg-indigo-50 font-semibold text-indigo-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      )}
    </div>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useLocalStorage('zyro_location', 'All India');
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

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const params = new URLSearchParams({ q: searchQuery.trim() });
      if (location && location !== 'All India') params.set('state', location);
      navigate(`/products?${params.toString()}`);
      setSearchQuery('');
    }
  }

  function handleSearchIconClick() {
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ q: searchQuery.trim() });
      if (location && location !== 'All India') params.set('state', location);
      navigate(`/products?${params.toString()}`);
      setSearchQuery('');
    }
  }

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <Link to="/home">
            <img
              src="/src/assets/logo/logo.svg"
              alt="Zyro Logo"
              className="h-16 w-16 filter brightness-0"
            />
          </Link>
        </div>

        {/* Location Selector */}
        <LocationSelector location={location} setLocation={setLocation} />

        {/* Search Bar */}
        <div className="hidden flex-1 justify-center md:flex">
          <label className="group flex min-w-[360px] max-w-[520px] flex-1 items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 transition-all focus-within:ring-4 focus-within:ring-indigo-500/10">
            <button
              type="button"
              onClick={handleSearchIconClick}
              className="shrink-0"
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-slate-400 hover:text-indigo-600 transition" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search marketplace..."
              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        {/* Right Icons */}
        <div className="flex shrink-0 items-center gap-1">
          <div className="hidden items-center gap-1 md:flex">
            <TooltipIconLink to="/chats" icon={MessageCircle} label="Chats" />
            <TooltipIconLink to="/wallet" icon={Wallet} label="Wallet" />
            <TooltipIconLink to="/notifications" icon={Bell} label="Notifications" showDot={hasUnreadNotifications} />
          </div>

          <MobileTopActions hasUnread={hasUnreadNotifications} />

          {/* User Menu */}
          <div
            className="relative ml-1"
            ref={menuRef}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              className="inline-flex rounded-full p-0.5 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
              aria-label="Open user menu"
            >
              <Avatar name={displayName} url={user?.avatarUrl} size="md" />
            </button>

            {open ? (
              <div className="absolute right-0 mt-0 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg animate-fade-in">
                <div className="rounded-xl px-3 py-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                    <Badge variant={user?.isVerified ? 'verified' : 'escrow'}>
                      {user?.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </div>

                <div className="my-1 h-px bg-slate-100" />

                <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
                  <User className="h-4 w-4" /> My Profile
                </Link>
                <Link to="/orders" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
                  <ShoppingBag className="h-4 w-4" /> Orders
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
    { to: '/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex flex-col items-center justify-center gap-1 rounded-lg py-1 text-[11px] font-medium transition',
                isActive ? 'text-indigo-600' : 'text-slate-500',
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
