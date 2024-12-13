import axios, { AxiosError } from 'axios';
import { IUser } from '../types/CoveyTownSocket';

// TODO: chnage this to render url
const BASE_URL = 'https://spring24-project-team-505.onrender.com/users'; // Base URL of your backend API

export const registerUser = async (
  username: string,
  password: string,
): Promise<IUser | undefined> => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, { username, password });
    return response.data as IUser;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data;
    }
  }
};

export const loginUser = async (username: string, password: string): Promise<IUser | undefined> => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data;
    }
  }
};

export const getUser = async (username: string): Promise<IUser | undefined> => {
  try {
    const response = await axios.post(`${BASE_URL}/user`, { username });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data;
    }
  }
};

export const addUserItem = async (id: string, item: number): Promise<IUser | undefined> => {
  try {
    const response = await axios.post(`${BASE_URL}/items/add`, { id, item });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data;
    }
  }
};

export const deleteUserItem = async (id: string, item: number): Promise<IUser | undefined> => {
  try {
    const response = await axios.delete(`${BASE_URL}/items/delete`, { data: { id, item } });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data;
    }
  }
};

export const getItems = async (id: string): Promise<number[] | undefined> => {
  try {
    const response = await axios.post(`${BASE_URL}/items`, { id });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data;
    }
  }
};

export const getCoins = async (id: string): Promise<number | undefined> => {
  try {
    const response = await axios.post(`${BASE_URL}/coins`, { id });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data;
    }
  }
};

export const updateUserCoins = async (id: string, coins: number): Promise<IUser | undefined> => {
  try {
    const response = await axios.put(`${BASE_URL}/coins/update`, { id, coins });
    return response.data as IUser;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data;
    }
  }
};

export const updateUserWinstreak = async (
  id: string,
  winStreak: number,
): Promise<IUser | undefined> => {
  try {
    const response = await axios.put(`${BASE_URL}/wins/update`, { id, winStreak });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data;
    }
  }
};

export const getWins = async (id: string): Promise<number | undefined> => {
  try {
    const response = await axios.post(`${BASE_URL}/wins`, { id });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data;
    }
  }
};

export default {
  registerUser,
  loginUser,
  addUserItem,
  deleteUserItem,
  getItems,
  getCoins,
  updateUserCoins,
  updateUserWinstreak,
  getWins,
};
