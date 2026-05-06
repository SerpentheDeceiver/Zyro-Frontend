import { useCallback, useEffect, useState } from 'react';
import { chatAPI } from '../api';

export function useChat(activeChatId) {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(Boolean(activeChatId));

  const loadChats = useCallback(async () => {
    setLoadingChats(true);
    try {
      setChats(await chatAPI.getChats());
    } catch {
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    try {
      setMessages(await chatAPI.getMessages(activeChatId));
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [activeChatId]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    loadMessages();
  }, [activeChatId, loadMessages]);

  const sendMessage = useCallback(
    async (content) => {
      const message = await chatAPI.sendMessage(activeChatId, content);
      setMessages((current) => [...current, message]);
      await loadChats();
      return message;
    },
    [activeChatId, loadChats]
  );

  return { chats, messages, loadingChats, loadingMessages, loadChats, loadMessages, sendMessage };
}
