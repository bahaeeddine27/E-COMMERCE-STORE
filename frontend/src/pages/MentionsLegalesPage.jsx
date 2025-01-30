import { Link } from "react-router-dom";

const MentionsLegalesPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 mb-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Mentions Légales</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">1 - Édition du site</h2>
        <p className="text-gray-700">
          En vertu de l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique,
          il est précisé aux utilisateurs du site internet <span className="font-semibold">http://localhost:5173/</span> l’identité des différents intervenants :
        </p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Propriétaire : <span className="font-semibold">Abbassi Bahae</span> - Contact : <a href="mailto:bahaeeddineabbassi@gmail.com" className="text-emerald-600">bahaeeddineabbassi@gmail.com</a> - 0749654681</li>
          <li>Identification de l’entreprise : <span className="font-semibold">sarl DIGIT-SELL</span> au capital social de 1000€</li>
          <li>Directeur de la publication : <span className="font-semibold">Bahae Eddine</span></li>
          <li>Hébergeur : <span className="font-semibold">Hostinger</span></li>
          <li>Délégué à la protection des données : <span className="font-semibold">Bahae Eddine</span></li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">2 - Propriété intellectuelle</h2>
        <p className="text-gray-700">
          Tous les éléments présents sur ce site (textes, images, logos, etc.) sont protégés par des droits d’auteur.
          Toute reproduction sans autorisation est interdite.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">3 - Limitations de responsabilité</h2>
        <p className="text-gray-700">
          L’éditeur du site ne pourra être tenu pour responsable des dommages directs et indirects causés au matériel de l’utilisateur,
          lors de l’accès au site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">4 - CNIL et gestion des données personnelles</h2>
        <p className="text-gray-700">
          Conformément à la loi 78-17 du 6 janvier 1978, l’utilisateur dispose d’un droit d’accès, de modification et de suppression des informations collectées.
        </p>
        <p className="text-gray-700">
          Pour plus d’informations, consultez notre <Link to="/politique-de-confidentialite" className="text-emerald-600 font-semibold">Politique de Confidentialité</Link>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">5 - Liens hypertextes et cookies</h2>
        <p className="text-gray-700">
          La navigation sur le site peut entraîner l’installation de cookies sur l’ordinateur de l’utilisateur.
          Vous pouvez gérer vos préférences via les paramètres de votre navigateur.
        </p>
        <p className="text-gray-700">
          Pour en savoir plus, consultez notre <Link to="/politique-de-confidentialite" className="text-emerald-600 font-semibold">Politique de Confidentialité</Link>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">6 - Droit applicable</h2>
        <p className="text-gray-700">
          Tout litige en relation avec l’utilisation du site est soumis au droit français.
          En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents de <span className="font-semibold">Saint-Ouen</span>.
        </p>
      </section>
    </div>
  );
};

export default MentionsLegalesPage;
