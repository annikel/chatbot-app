import axios from 'axios';

const BASE_URL = '/api/chats/';

export const createChat = async (chatId, instructions) => {
  try {
    const response = await axios.put(`${BASE_URL}${chatId}`, {
      instructions,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

export const postMessage = async (chatId, message) => {
  try {
    await axios.post(`${BASE_URL}${chatId}`, message, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error("Error posting message:", error);
    throw error;
  }
};

export const getChatState = async (chatId, timestampUTC) => {
  try {
    const response = await axios.get(`${BASE_URL}${chatId}`, {
      params: { timestampUTC },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting chat state:", error);
    throw error;
  }
};