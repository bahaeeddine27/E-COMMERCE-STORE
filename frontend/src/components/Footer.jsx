import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10 border-t border-emerald-800">
      <div className="container mx-auto px-4 text-center">
        <nav className="flex flex-col sm:flex-row justify-center gap-6 mb-4">
          <Link
            to="/politique-de-confidentialite"
            className="hover:text-emerald-400 transition duration-300"
          >
            Politique de confidentialité
          </Link>
          <Link
            to="/mentions-legales"
            className="hover:text-emerald-400 transition duration-300"
          >
            Mentions légales
          </Link>
          <Link
            to="/conditions-de-vente"
            className="hover:text-emerald-400 transition duration-300"
          >
            Conditions générales de vente
          </Link>
        </nav>

        <p className="text-sm">
          &copy; {new Date().getFullYear()} DIGIT-SELL. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
