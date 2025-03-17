import mongoose from 'mongoose';
import Order from '../models/order.model'; // Assure-toi que le chemin est correct

describe('Order Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('devrait créer une commande valide', async () => {
    const order = new Order({
      user: new mongoose.Types.ObjectId(),
      products: [
        {
          product: new mongoose.Types.ObjectId(),
          quantity: 2,
          price: 50,
        },
      ],
      totalAmount: 100,
      stripeSessionId: 'stripe_test_123',
    });

    const savedOrder = await order.save();
    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.products.length).toBe(1);
  });

  it('devrait échouer si `totalAmount` est négatif', async () => {
    const order = new Order({
      user: new mongoose.Types.ObjectId(),
      products: [
        {
          product: new mongoose.Types.ObjectId(),
          quantity: 2,
          price: 50,
        },
      ],
      totalAmount: -10,
    });

    await expect(order.save()).rejects.toThrow();
  });
});
