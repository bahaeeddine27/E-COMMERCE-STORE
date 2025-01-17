import { Link } from 'react-router-dom';
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from 'lucide-react';

const Navbar = () => {
  const user = false;
  const admin = false;

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className='flex justify-between items-center'>
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-emerald-400 flex items-center space-x-2"
        >
          E-Commerce
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {/* Lien vers la page d'accueil */}
          <Link
            to="/"
            className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
          >
            Home
          </Link>

          {/* Lien vers le panier */}
          {user && (
            <Link
              to="/cart"
              className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              <ShoppingCart
                className="inline-block mr-1 group-hover:text-emerald-400"
                size={20}
              />
              <span className="hidden sm:inline">Cart</span>
              <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                3
              </span>
            </Link>
          )}

          {/* Lien pour l'administrateur */}
          {admin && (
            <Link className="bg-emerald-700 hover:text-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out"
            >
              <Lock className="inline-block mr-1" size={18} />
              <span className='hidden sm:inline'>Dashboard</span>
            </Link>
          )}

          {/* Connexion/Déconnexion */}
          {user ? (
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
              <LogOut size={18} />
              <span className='hidden sm:inline ml-2'>Log Out</span>
            </button>
          ) : (
            <>
              <Link to={"/signup"} className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'>
                <UserPlus className="mr-2" size={18} />
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <LogIn className="mr-1" size={20} />
                Login
              </Link>
            </>
          )}
        </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
