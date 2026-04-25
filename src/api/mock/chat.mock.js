import { getCurrentMockUser, getMockState, updateMockState } from './mockDb';

function byRecent(left, right) {
  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

export const chatAPI = {
  getChats: async () => {
    const me = getCurrentMockUser();
    const { chats } = getMockState();
    return chats
      .filter((chat) => chat.buyerId === me.id || chat.sellerId === me.id)
      .sort(byRecent);
  },

  getMessages: async (chatId) => {
    const { messages } = getMockState();
    return messages[chatId] || [];
  },

  sendMessage: async (chatId, content, messageType = 'TEXT') => {
    const me = getCurrentMockUser();
    const message = {
      id: `m-${Math.random().toString(16).slice(2, 8)}`,
      chatId,
      senderId: me.id,
      content,
      messageType,
      createdAt: new Date().toISOString(),
    };

    updateMockState((current) => ({
      ...current,
      messages: {
        ...current.messages,
        [chatId]: [...(current.messages[chatId] || []), message],
      },
      chats: current.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, lastMessage: content, updatedAt: message.createdAt }
          : chat
      ),
    }));

    return message;
  },

  createChat: async (productId) => {
    const me = getCurrentMockUser();
    const { chats, products } = getMockState();
    const product = products.find((item) => item.id === productId);

    const existing = chats.find(
      (chat) => chat.productId === productId && (chat.buyerId === me.id || chat.sellerId === me.id)
    );
    if (existing) return existing;

    const nextChat = {
      id: `c-${Math.random().toString(16).slice(2, 8)}`,
      productId,
      productTitle: product?.title || 'Product',
      buyerId: me.id,
      buyerName: me.fullName || 'Buyer',
      sellerId: product?.sellerId || 'seller-1',
      sellerName: product?.sellerName || 'Seller',
      lastMessage: '',
      updatedAt: new Date().toISOString(),
    };

    updateMockState((current) => ({
      ...current,
      chats: [nextChat, ...current.chats],
      messages: {
        ...current.messages,
        [nextChat.id]: [],
      },
    }));

    return nextChat;
  },
};
