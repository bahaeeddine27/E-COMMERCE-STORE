import { useEffect } from "react";
import { CategoryItem } from "../components/CategoryItem.jsx";
import { useProductStore } from "../stores/useProductStore.js";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import { FaBook, FaChalkboardTeacher, FaQuoteLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Disclosure } from "@headlessui/react";
import { motion } from "framer-motion";

const categories = [
  {
    href: "e-books",
    name: "E-books",
    imageUrl: "/product.jpg",
    icon: <FaBook />,
  },
  {
    href: "cours",
    name: "Cours",
    imageUrl: "/product.jpg",
    icon: <FaChalkboardTeacher />,
  },
];

const testimonials = [
  {
    name: "Alice Dupont",
    text: "Les e-books sont très bien faits et faciles à suivre !",
  },
];

const faqs = [
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Nous acceptons les paiements via Stripe.",
  },
  {
    question: "Puis-je télécharger mes e-books après l'achat ?",
    answer:
      "Oui, une fois votre achat effectué, vous recevrez un lien de téléchargement.",
  },
  {
    question: "Les cours sont-ils accessibles à vie ?",
    answer:
      "Oui, une fois achetés, vous pouvez y accéder sans limite de temps.",
  },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gray-900 text-center py-20">
        <h1 className="text-5xl font-bold text-emerald-400 mb-4">
          Trouvez votre prochaine formation
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Explorez nos e-books et cours en ligne pour apprendre à votre rythme.
        </p>
        <motion.a
          href="#categories"
          className="inline-block bg-emerald-600 px-6 py-3 text-lg font-semibold rounded-lg hover:bg-emerald-700 transition"
          whileHover={{ scale: 1.1 }}
        >
          Découvrir maintenant
        </motion.a>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-center text-4xl font-bold text-emerald-400 mb-6">
          Découvrez nos catégories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((category) => (
            <motion.div key={category.name} whileHover={{ scale: 1.05 }}>
              <CategoryItem category={category} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts featuredProducts={products} />

      {/* Testimonials */}
      <section className="bg-gray-800 py-16">
        <h2 className="text-center text-4xl font-bold text-emerald-400 mb-6">
          Ce que disent nos clients
        </h2>
        <Swiper spaceBetween={50} slidesPerView={1} autoplay>
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="text-center px-8">
              <FaQuoteLeft className="text-emerald-400 text-3xl mb-4 mx-auto" />
              <p className="text-lg text-gray-300 italic">
                “{testimonial.text}”
              </p>
              <h3 className="text-xl font-bold text-white mt-4">
                {testimonial.name}
              </h3>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-center text-4xl font-bold text-emerald-400 mb-6">
          FAQ
        </h2>
        {faqs.map((faq, index) => (
          <Disclosure key={index}>
            {({ open }) => (
              <div className="mb-4 border-b border-gray-600">
                <Disclosure.Button className="w-full text-left text-lg font-medium p-4 bg-gray-700 hover:bg-gray-600">
                  {faq.question}
                </Disclosure.Button>
                {open && (
                  <Disclosure.Panel className="p-4 text-gray-300">
                    {faq.answer}
                  </Disclosure.Panel>
                )}
              </div>
            )}
          </Disclosure>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-center py-6 text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} DIGIT-SELL - Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
