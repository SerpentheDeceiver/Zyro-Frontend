import { MessageCircle, Search, User, WalletCards, PlusCircle, LogOut } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { initials } from '../../utils/format';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="page-shell flex h-16 items-center gap-4">
        <Link to="/" className="text-2xl font-black tracking-tight text-primary">
          Zyro
        </Link>

        <form
          className="hidden flex-1 md:block"
          onSubmit={(event) => {
            event.preventDefault();
            const query = new FormData(event.currentTarget).get('q');
            navigate(query ? `/?search=${encodeURIComponent(query)}` : '/');
          }}
        >
          <label className="relative mx-auto block max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input name="q" className="input py-2.5 pl-11" placeholder="Search marketplace" />
          </label>
        </form>

        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <NavLink title="Chat" to="/chat" className="rounded-full p-2.5 text-slate-700 hover:bg-slate-100">
            <MessageCircle size={21} />
          </NavLink>
          <NavLink title="Wallet" to="/wallet" className="rounded-full p-2.5 text-slate-700 hover:bg-slate-100">
            <WalletCards size={21} />
          </NavLink>
          <NavLink title="Sell" to="/sell" className="hidden rounded-full p-2.5 text-slate-700 hover:bg-slate-100 sm:inline-flex">
            <PlusCircle size={21} />
          </NavLink>

          {isAuthenticated ? (
            <div className="group relative">
              <Link
                title="Profile"
                to="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-white"
              >
                {initials(user?.fullName || user?.mobile)}
              </Link>
              <div className="invisible absolute right-0 top-12 w-48 rounded-lg border border-slate-200 bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">
                <Link className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" to="/profile">
                  <User size={16} />
                  Account
                </Link>
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary px-4 py-2">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
