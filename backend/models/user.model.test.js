import mongoose from 'mongoose';
import User from '../models/user.model';

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('devrait créer un utilisateur valide avec un mot de passe haché', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password1!',
      role: 'customer',
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.password).not.toBe('Password1!');
  });

  it('devrait échouer si le mot de passe est trop court', async () => {
    const user = new User({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Short1!',
      role: 'customer',
    });

    await expect(user.save()).rejects.toThrow();
  });

  it("devrait échouer si l'email est manquant", async () => {
    const user = new User({
      name: 'Jane Doe',
      password: 'Password1!',
    });

    await expect(user.save()).rejects.toThrow();
  });
});
