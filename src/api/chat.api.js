import { apiClient, unwrap } from './client';

export const chatAPI = {
  getChats: async () => unwrap(await apiClient.get('/chats')),
  getMessages: async (chatId) => unwrap(await apiClient.get(`/chats/${chatId}/messages`)),
  sendMessage: async (chatId, content, messageType = 'TEXT') =>
    unwrap(await apiClient.post(`/chats/${chatId}/messages`, { content, messageType })),
  createChat: async (productId) => unwrap(await apiClient.post('/chats', { productId })),
};
