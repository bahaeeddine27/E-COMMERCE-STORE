import {CategoryItem} from "../components/CategoryItem.jsx";
const categories = [
  { href: "chargeurs", name: "Chargeurs", imageUrl: "/product.jpg" },
  { href: "cables", name: "Cables", imageUrl: "/product.jpg" },
  { href: "téléphones", name: "Téléphones", imageUrl: "/product.jpg" },
  { href: "ipads", name: "Ipads", imageUrl: "/product.jpg" },
  { href: "écouteurs", name: "Ecouteurs", imageUrl: "/product.jpg" },
  { href: "adabtateurs", name: "Adabtateurs", imageUrl: "/product.jpg" },
  { href: "e-books", name: "E-books", imageUrl: "/product.jpg" },
];
const HomePage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4"> 
          Découvrez nos catégories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Découvrez nos derniers produits et accessoires
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage;