import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, UserPlus, LogIn, LogOut, X } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';

const Navbar = () => {
  const { user, logout } = useUserStore();
  const admin = user?.role === 'admin';
  const { cart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-emerald-400">
          DIGIT-SELL
        </Link>

        {/* Hamburger Icon */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center bg-emerald-600 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={28} className="text-white" />
          ) : (
            <div className="flex flex-col space-y-1">
              <span className="block w-6 h-1 bg-white"></span>
              <span className="block w-6 h-1 bg-white"></span>
              <span className="block w-6 h-1 bg-white"></span>
            </div>
          )}
        </button>

        {/* Navigation */}
        <nav
          className={`absolute top-16 right-0 w-3/4 bg-gray-900 p-5 flex flex-col gap-4 md:relative md:top-auto md:w-auto md:bg-transparent md:flex-row md:items-center md:gap-6 ${menuOpen ? 'block' : 'hidden md:flex'}`}
        >
          <Link to="/" className="text-gray-300 hover:text-emerald-400">
            Accueil
          </Link>

          {user && (
            <Link to="/cart" className="relative text-gray-300 hover:text-emerald-400">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {admin && (
            <Link
              to="/secret-dashboard"
              className="bg-emerald-700 text-white px-3 py-1 rounded-md hover:text-emerald-600"
            >
              Tableau de Bord
            </Link>
          )}

          {user ? (
            <button
              className="bg-gray-700 text-white py-2 px-4 rounded-md flex items-center hover:bg-gray-600"
              onClick={logout}
            >
              <LogOut size={18} />
              <span className="ml-2">Se déconnecter</span>
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-emerald-600 text-white py-2 px-4 rounded-md flex items-center hover:bg-emerald-700"
              >
                <UserPlus size={18} className="mr-2" /> S&apos;enregistrer
              </Link>
              <Link
                to="/login"
                className="bg-gray-700 text-white py-2 px-4 rounded-md flex items-center hover:bg-gray-600"
              >
                <LogIn size={20} className="mr-1" /> Connexion
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
