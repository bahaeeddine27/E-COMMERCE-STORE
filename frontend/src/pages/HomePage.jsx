import { useEffect } from "react";
import {CategoryItem} from "../components/CategoryItem.jsx";
import { useProductStore } from "../stores/useProductStore.js";
import FeaturedProducts from "../components/FeaturedProducts.jsx";

const categories = [
  { href: "e-books", name: "E-books", imageUrl: "/product.jpg" },
  { href: "cours", name: "Cours", imageUrl: "/product.jpg" },
];
const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4"> 
          Découvrez nos catégories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Découvrez nos derniers e-books et nos cours
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
        {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
      </div>
    </div>
  )
}

export default HomePage;