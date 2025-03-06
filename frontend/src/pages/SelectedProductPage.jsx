import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProductStore } from '../stores/useProductStore.js';
import { useCartStore } from '../stores/useCartStore.js';
import { useUserStore } from '../stores/useUserStore.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const SelectedProductPage = () => {
  const { selectedProduct, fetchProductById, loading } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useUserStore();
  const { productId } = useParams();

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [fetchProductById, productId]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Vous devez vous connecter pour ajouter un produit au panier', { id: 'login' });
      return;
    } else {
      addToCart(selectedProduct);
      toast.success(`${selectedProduct.name} a été ajouté au panier !`);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!selectedProduct) {
    return <h2 className="text-center text-3xl text-gray-300">Produit non trouvé</h2>;
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 text-white">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="lg:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-emerald-400 mb-4">{selectedProduct.name}</h1>
          <p className="text-lg text-gray-300 mb-4">{selectedProduct.description}</p>
          <p className="text-3xl font-semibold text-emerald-400 mb-6">{selectedProduct.price} €</p>
          <button
            onClick={handleAddToCart}
            className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg transition duration-300 text-lg"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedProductPage;
