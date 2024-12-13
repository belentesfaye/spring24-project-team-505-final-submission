import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as userController from './userController';
import user from '../models/user'; // Adjust path as necessary

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await user.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('userController tests', () => {
  test('registerUser creates a new user successfully', async () => {
    const username = 'testUser';
    const password = 'testPass123';

    // Assuming registerUser returns the created user or a success indicator
    const result = await userController.registerUser(username, password);
    expect(result).toBeDefined();
    // Further assertions can be based on what registerUser returns, such as success status or user object properties
  });
  // Test for loginUser
  test('loginUser authenticates a user successfully', async () => {
    // Assuming you have a utility function to create users for testing
    await userController.registerUser('testUser', 'testPass123');
    const thisUser = await userController.loginUser('testUser', 'testPass123');
    expect(thisUser).toBeDefined();
    expect(thisUser.username).toEqual('testUser');
  });

  // Test for addUserItem
  // TODO: add test for adding multiple items, multiple of the same item, etc.
  test('addUserItem adds an item successfully', async () => {
    const thisUser = await userController.registerUser('testUser2', 'testPass123');
    const updatedUser = await userController.addUserItem(thisUser._id.toString(), 10);
    expect(updatedUser.playerstats.items.includes(10)).toBe(true);
  });

  // Test for deleteUserItem
  test('deleteUserItem removes an item successfully', async () => {
    const thisUser = await userController.registerUser('testUser2', 'testPass123');
    const updatedUser = await userController.addUserItem(thisUser._id.toString(), 10);
    expect(updatedUser.playerstats.items.includes(10)).toBe(true);
    const removedUser = await userController.deleteUserItem(thisUser._id.toString(), 10);

    if (removedUser !== null) {
      expect(removedUser.playerstats.items.includes(10)).toBe(false);
    } else {
      // TODO: Handle the case if removedUser is null (it shouldnt be but linter was complaining)
    }
  });

  // User's winstreak increments with updateUserWinstreak
  test('updateUserWinstreak increments a user winstreak successfully', async () => {
    const thisUser = await userController.registerUser('testUser2', 'testPass123');
    const updatedUser = await userController.updateUserWinstreak(thisUser._id.toString(), true);
    expect(updatedUser.playerstats.winstreak).toBe(1);
    const updatedUser2 = await userController.updateUserWinstreak(thisUser._id.toString(), true);
    expect(updatedUser2.playerstats.winstreak).toBe(2);
  });
  // User's winstreak resets to 0 with updateUserWinstreak
  test('updateUserWinstreak resets a users winstreak when called', async () => {
    const thisUser = await userController.registerUser('testUser2', 'testPass123');
    const updatedUser = await userController.updateUserWinstreak(thisUser._id.toString(), true);
    expect(updatedUser.playerstats.winstreak).toBe(1);
    const updatedUser2 = await userController.updateUserWinstreak(thisUser._id.toString(), false);
    expect(updatedUser2.playerstats.winstreak).toBe(0);
    const updatedUser3 = await userController.updateUserWinstreak(thisUser._id.toString(), true);
    expect(updatedUser3.playerstats.winstreak).toBe(1);
    const updatedUser4 = await userController.updateUserWinstreak(thisUser._id.toString(), true);
    expect(updatedUser4.playerstats.winstreak).toBe(2);
    const updatedUser5 = await userController.updateUserWinstreak(thisUser._id.toString(), false);
    expect(updatedUser5.playerstats.winstreak).toBe(0);
  });
  // setUserCoins updates users coin amount
  test('setUserCoins updates users coins successfully', async () => {
    const thisUser = await userController.registerUser('testUser2', 'testPass123');
    // Checks that newly registered user is initialized with 0 coins
    expect(thisUser.playerstats.coins).toBe(0);
    // Updates user's coins to 9
    const updatedUser = await userController.setUserCoins(thisUser._id.toString(), 7);
    expect(updatedUser.playerstats.coins).toBe(7);
    // Update's user's coins to 1000
    const updatedUser2 = await userController.setUserCoins(thisUser._id.toString(), 1000);
    expect(updatedUser2.playerstats.coins).toBe(1000);
    // Update's user's coins to negative number: -500
    const updatedUser3 = await userController.setUserCoins(thisUser._id.toString(), -500);
    expect(updatedUser3.playerstats.coins).toBe(0);
  });

  test('getCoins returns the correct coin amount for a user', async () => {
    const thisUser = await userController.registerUser('testUserCoins', 'password');
    const updatedUser = await userController.setUserCoins(thisUser._id.toString(), 100);
    const coins = await userController.getCoins(updatedUser._id.toString());
    expect(coins).toBe(100);
  });

  test('getCoins throws an error for a non-existent user', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    await expect(userController.getCoins(nonExistentId)).rejects.toThrow('User not found');
  });

  test('getWinstreak returns the correct winstreak for a user', async () => {
    const thisUser = await userController.registerUser('testUserWinstreak', 'password');
    const updatedUser = await userController.updateUserWinstreak(thisUser._id.toString(), true);
    const updatedUser2 = await userController.updateUserWinstreak(updatedUser._id.toString(), true);
    const updatedUser3 = await userController.updateUserWinstreak(
      updatedUser2._id.toString(),
      true,
    );
    const winstreak = await userController.getWinstreak(updatedUser3._id.toString());
    expect(winstreak).toBe(3);
    // test that user._id works across "updatedUser" references
    const winstreakByText = await userController.getWinstreak(thisUser._id.toString());
    expect(winstreakByText).toBe(3);
  });

  test('getWinstreak throws an error for a non-existent user', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    await expect(userController.getWinstreak(nonExistentId)).rejects.toThrow('User not found');
  });

  test('getItems returns the correct items for a user', async () => {
    const thisUser = await userController.registerUser('testUserItems', 'password');
    // Add items to player
    await userController.addUserItem(thisUser._id.toString(), 1);
    await userController.addUserItem(thisUser._id.toString(), 2);
    await userController.addUserItem(thisUser._id.toString(), 3);
    const items = await userController.getItems(thisUser._id.toString());

    // Verify the items match what was added
    expect(items).toEqual(expect.arrayContaining([1, 2, 3]));
    expect(items.length).toBe(3);
  });

  test('getItems throws an error for a non-existent user', async () => {
    // Generate a valid ObjectId that does not exist in the database
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    await expect(userController.getItems(nonExistentId)).rejects.toThrow('User not found');
  });
});
