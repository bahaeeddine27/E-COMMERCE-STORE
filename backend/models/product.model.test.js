import mongoose from 'mongoose';
import Product from './product.model'; // Assure-toi que le chemin est correct

describe('Modèle Product', () => {
  beforeAll(() => {
    // Connexion à une base de données de test avant d'exécuter les tests
    mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(() => {
    // Fermeture de la connexion à la base de données après les tests
    mongoose.connection.close();
  });

  it('devrait créer et sauvegarder un produit avec succès', async () => {
    const productData = {
      name: 'Test Product',
      description: 'Ceci est un produit de test.',
      price: 99.99,
      image: 'testimageurl.jpg',
      category: 'Électronique',
      isFeatured: true,
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe('Test Product');
    expect(savedProduct.price).toBe(99.99);
    expect(savedProduct.isFeatured).toBe(true);
  });

  it('devrait échouer si des champs obligatoires sont manquants', async () => {
    const productData = {
      name: 'Produit incomplet',
      price: 50,
      image: 'incomplete.jpg',
      category: 'Jouets',
      // La description est manquante ici, ce qui devrait entraîner une erreur de validation
    };

    const product = new Product(productData);
    try {
      await product.save();
    } catch (error) {
      expect(error.errors.description).toBeDefined();
    }
  });

  it("devrait définir une image par défaut si aucune n'est fournie", async () => {
    const productData = {
      name: 'Produit avec image par défaut',
      description: "Produit sans URL d'image personnalisée.",
      price: 10.99,
      category: 'Divers',
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct.image).toBe('URL_DE_L_IMAGE_PAR_DÉFAUT');
  });

  it('devrait valider le champ du prix', async () => {
    const productData = {
      name: 'Produit bon marché',
      description: 'Test de validation du prix.',
      price: -10, // Prix invalide
      image: 'cheapproduct.jpg',
      category: 'Vêtements',
    };

    const product = new Product(productData);
    try {
      await product.save();
    } catch (error) {
      expect(error.errors.price).toBeDefined();
    }
  });

  it('devrait définir isFeatured à false par défaut', async () => {
    const productData = {
      name: 'Produit standard',
      description: "Ce produit n'a pas la valeur par défaut.",
      price: 49.99,
      image: 'standardproduct.jpg',
      category: 'Meubles',
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct.isFeatured).toBe(false);
  });
});
