import { motion } from 'framer-motion';
import { Trash, Star, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useProductStore } from '../stores/useProductStore.js';

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, fetchAllProducts, products, updateProductPrice } =
    useProductStore();

  // State pour gérer la modification du prix
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  // Fetch products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Fonction pour gérer la mise à jour du prix
  const handlePriceChange = (productId) => {
    if (newPrice && !isNaN(parseFloat(newPrice))) {
      updateProductPrice(productId, parseFloat(newPrice));
      setEditingPrice(null);
      setNewPrice('');
    } else {
      alert('Veuillez entrer un prix valide');
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Produit
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Prix
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Catégorie
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Mettre en avant
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {editingPrice === product._id ? (
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="bg-gray-700 text-gray-300 p-2 rounded"
                        />
                        <button
                          onClick={() => handlePriceChange(product._id)}
                          className="ml-2 text-green-500"
                        >
                          ✔️
                        </button>
                      </div>
                    ) : (
                      `${product.price.toFixed(2)} €`
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleFeaturedProduct(product._id)}
                    className={`p-1 rounded-full ${
                      product.isFeatured
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-600 text-gray-300'
                    } hover:bg-yellow-500 transition-colors duration-200`}
                  >
                    <Star className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setEditingPrice(product._id)}
                    className="text-yellow-400 hover:text-yellow-300 ml-2"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-300">
                Pas de produits
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;
