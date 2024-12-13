import { Router } from 'express';
import {
  getCoins,
  getItems,
  getWinstreak,
  updateUserWinstreak,
  setUserCoins,
  deleteUserItem,
  addUserItem,
  loginUser,
  registerUser,
  getUser,
} from '../controllers/userController';

const router = Router();

// Define routes related to player functionality
router.post(`/register`, async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await registerUser(username, password);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post(`/login`, async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await loginUser(username, password);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post(`/user`, async (req, res) => {
  try {
    const { username } = req.body;
    const newUser = await getUser(username);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post(`/items/add`, async (req, res) => {
  try {
    const { id, item } = req.body;
    const updatedUser = await addUserItem(id, item);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete(`/items/delete`, async (req, res) => {
  try {
    const { id, item } = req.body;
    const updatedUser = await deleteUserItem(id, item);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post(`/items`, async (req, res) => {
  try {
    const { id } = req.body;
    const items = await getItems(id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post(`/coins`, async (req, res) => {
  try {
    const { id } = req.body;
    const coins = await getCoins(id);
    res.json(coins);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put(`/coins/update`, async (req, res) => {
  try {
    const { id, coins } = req.body;
    const updatedUser = await setUserCoins(id, coins);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put(`/wins/update`, async (req, res) => {
  try {
    const { id, winStreak } = req.body;
    const updatedUser = await updateUserWinstreak(id, winStreak);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post(`/wins`, async (req, res) => {
  try {
    const { id } = req.body;
    const winStreak = await getWinstreak(id);
    res.json(winStreak);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
