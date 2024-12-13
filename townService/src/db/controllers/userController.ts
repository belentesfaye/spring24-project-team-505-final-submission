/* eslint-disable no-useless-catch */
import User from '../models/user';

// Function to handle user registration
export const registerUser = async (username: string, password: string) => {
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    return newUser; // Or just return relevant info
  } catch (error) {
    throw error;
  }
};

// Function to handle user login
export const loginUser = async (username: string, password: string) => {
  try {
    const thisUser = await User.findOne({ username });
    if (thisUser && (await thisUser.isCorrectPassword(password))) {
      return thisUser; // Authenticate user and return needed info
    }
    throw new Error('Invalid username or password');
  } catch (error) {
    throw error;
  }
};

// Function to get user with username
export const getUser = async (username: string) => {
  try {
    const thisUser = await User.findOne({ username });
    return thisUser; // Authenticate user and return needed info
  } catch (error) {
    throw error;
  }
};

// A function getCoins that returns the coins of a user
export const getCoins = async (userId: string) => {
  try {
    const thisUser = await User.findById(userId);
    if (thisUser) {
      return thisUser.playerstats.coins;
    }
    throw new Error('User not found');
  } catch (error) {
    throw error;
  }
};

// A function getWinstreak that returns the winstreak of a user
export const getWinstreak = async (userId: string) => {
  try {
    const thisUser = await User.findById(userId);
    if (thisUser) {
      return thisUser.playerstats.winstreak;
    }
    throw new Error('User not found');
  } catch (error) {
    throw error;
  }
};

// A function getItems that returns the items of a user
export const getItems = async (userId: string) => {
  try {
    const thisUser = await User.findById(userId);
    if (thisUser) {
      return thisUser.playerstats.items;
    }
    throw new Error('User not found');
  } catch (error) {
    throw error;
  }
};

// add item to user's inventory (user.playerstats.items: number[])
export const addUserItem = async (userId: string, item: number) => {
  try {
    const thisUser = await User.findById(userId);
    if (thisUser) {
      thisUser.playerstats.items.push(item);
      await thisUser.save();
      return thisUser;
    }
    throw new Error('User not found');
  } catch (error) {
    throw error;
  }
};

// delete matching item from user's inventory (user.playerstats.items: number[])
export const deleteUserItem = async (userId: string, item: number) => {
  try {
    const thisUser = await User.findById(userId);
    if (thisUser) {
      const itemIndex = thisUser.playerstats.items.indexOf(item);
      if (itemIndex > -1) {
        thisUser.playerstats.items.splice(itemIndex, 1); // Remove only one item
      }
      await thisUser.save();
      return thisUser;
    }
    throw new Error('User not found');
  } catch (error) {
    throw error;
  }
};

// set user coins to a specific value
export const setUserCoins = async (userId: string, coins: number) => {
  const filteredCoins = coins < 0 ? 0 : coins;
  try {
    const thisUser = await User.findByIdAndUpdate(
      userId,
      { $set: { 'playerstats.coins': filteredCoins } },
      { new: true },
    );
    if (!thisUser) {
      throw new Error('User not found');
    }
    return thisUser;
  } catch (error) {
    throw error;
  }
};

// update the winstreak of a user based on win/loss. true for win, false for loss, null for tie
export const updateUserWinstreak = async (userId: string, winStreak: boolean) => {
  try {
    let update; // Declare the update variable
    if (winStreak == null) {
      update = { $set: { 'playerstats.winstreak': getWinstreak(userId) } };
    } else {
      update = winStreak
        ? { $inc: { 'playerstats.winstreak': 1 } }
        : { $set: { 'playerstats.winstreak': 0 } };
    }
    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export default {
  registerUser,
  loginUser,
  getUser,
  addUserItem,
  deleteUserItem,
  setUserCoins,
  updateUserWinstreak,
  getCoins,
};
