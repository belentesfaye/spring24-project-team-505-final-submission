import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import user from './user'; // Adjust the import path when refactored

let mongoServer: MongoMemoryServer;

// Set up a MongoDB Memory Server for testing
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  return mongoose;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Create User model operation', () => {
  // Test for user creation
  it('Create a new user', async () => {
    const thisUser = await user.create({
      username: 'testUser',
      password: 'password123',
      playerstats: { items: [], coins: 0, winstreak: 0 },
    });
    expect(thisUser.username).toBe('testUser');
  });
});
