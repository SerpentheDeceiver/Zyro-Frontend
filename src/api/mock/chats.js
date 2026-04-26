export const mockChats = [
  {
    chatId: 'chat-001',
    otherUserName: 'Meera',
    otherUserInitials: 'ME',
    productTitle: 'Atomic Habits + Deep Work Combo',
    lastMessage: 'I can ship this tomorrow morning.',
    lastTime: '09:42 AM',
  },
  {
    chatId: 'chat-002',
    otherUserName: 'Karan',
    otherUserInitials: 'KA',
    productTitle: 'Portable Projector with HDMI Adapter',
    lastMessage: 'Could you confirm the HDMI cable is included?',
    lastTime: 'Yesterday',
  },
  {
    chatId: 'chat-003',
    otherUserName: 'Nisha',
    otherUserInitials: 'NI',
    productTitle: 'Limited Edition Marvel Action Figure',
    lastMessage: 'Price is slightly negotiable for quick payment.',
    lastTime: 'Mon',
  },
];

export const mockMessages = {
  'chat-001': [
    { id: 'm-001', text: 'Hi, are the books still available?', sender: 'me', time: '09:21 AM', date: '2026-04-20' },
    { id: 'm-002', text: 'Yes, both are available in excellent condition.', sender: 'them', time: '09:24 AM', date: '2026-04-20' },
    { id: 'm-003', text: 'Great, can you ship to Bengaluru?', sender: 'me', time: '09:30 AM', date: '2026-04-20' },
    { id: 'm-004', text: 'I can ship this tomorrow morning.', sender: 'them', time: '09:42 AM', date: '2026-04-20' },
  ],
  'chat-002': [
    { id: 'm-005', text: 'Is the projector brightness good in daylight?', sender: 'me', time: '07:10 PM', date: '2026-04-18' },
    { id: 'm-006', text: 'It works best in low light, but still usable in daylight.', sender: 'them', time: '07:19 PM', date: '2026-04-18' },
    { id: 'm-007', text: 'Could you confirm the HDMI cable is included?', sender: 'me', time: '07:24 PM', date: '2026-04-18' },
  ],
  'chat-003': [
    { id: 'm-008', text: 'Is the action figure box unopened?', sender: 'me', time: '08:02 PM', date: '2026-04-14' },
    { id: 'm-009', text: 'Yes, sealed and in mint condition.', sender: 'them', time: '08:07 PM', date: '2026-04-14' },
    { id: 'm-010', text: 'Price is slightly negotiable for quick payment.', sender: 'them', time: '08:15 PM', date: '2026-04-14' },
  ],
};

const withDelay = (data) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), 600);
  });

export const getChats = () => withDelay(mockChats);

export const getMessagesByChatId = (chatId) => withDelay(mockMessages[chatId] || []);

