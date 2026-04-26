import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, ShieldCheck, ChevronLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/common/Avatar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useChat } from '../hooks/useChat';
import { formatDate } from '../utils/format';

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatMessageDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = date.toDateString();
  const todayStr = today.toDateString();
  const yesterdayStr = yesterday.toDateString();

  if (dateOnly === todayStr) return 'Today';
  if (dateOnly === yesterdayStr) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chats, messages, loadingChats, loadingMessages, sendMessage } = useChat(chatId);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const activeChat = useMemo(() => chats.find((chat) => chat.id === chatId), [chatId, chats]);
  const otherUserName = activeChat ? (activeChat.buyerId === user?.id ? activeChat.sellerName : activeChat.buyerName) : '';

  // Auto-redirect to first chat
  useEffect(() => {
    if (!chatId && chats.length) navigate(`/chats/${chats[0].id}`, { replace: true });
  }, [chatId, chats, navigate]);

  // Auto-scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    return () => clearTimeout(timer);
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderId !== user?.id) {
        typingTimeoutRef.current = setTimeout(() => {
          setShowTyping(true);
          setTimeout(() => setShowTyping(false), 2000);
        }, 500);
      }
    }
    return () => clearTimeout(typingTimeoutRef.current);
  }, [messages, user?.id]);

  // Handle window resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  async function handleSend(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    try {
      await sendMessage(draft.trim());
      setDraft('');
    } finally {
      setSending(false);
    }
  }

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(msg);
    });
    return groups;
  }, [messages]);

  return (
    <main className="page-shell py-6">
      <div className="grid min-h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft lg:grid-cols-[320px_1fr] animate-fade-slide-up">
        {/* LEFT SIDEBAR */}
        <aside
          className={`border-b border-slate-200 lg:border-b-0 lg:border-r lg:block ${
            isMobileView && activeChat ? 'hidden' : ''
          }`}
        >
          <div className="border-b border-slate-200 p-4">
            <h1 className="text-xl font-black text-ink">Chat</h1>
            <p className="text-sm text-slate-500">Buyer and seller messages</p>
          </div>

          {loadingChats ? (
            <Loader label="Loading chats" />
          ) : chats.length ? (
            <div className="max-h-[76vh] overflow-y-auto">
              {chats.map((chat) => {
                const otherName = chat.buyerId === user?.id ? chat.sellerName : chat.buyerName;
                const active = chat.id === chatId;
                return (
                  <div
                    key={chat.id}
                    onClick={() => navigate(`/chats/${chat.id}`)}
                    className={`flex cursor-pointer gap-3 border-b border-slate-100 p-4 transition ${
                      active ? 'bg-primary/5' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Avatar */}
                    <Avatar name={otherName} size="md" />

                    {/* Chat Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-bold text-ink">{otherName || 'Zyro member'}</h3>
                        <span className="shrink-0 text-xs text-slate-500">{chat.updatedAt ? formatTime(chat.updatedAt) : ''}</span>
                      </div>
                      <p className="truncate text-xs text-slate-500">{chat.productTitle}</p>
                      <p className="mt-1 truncate text-sm text-slate-600">
                        {chat.lastMessage || 'No messages yet'}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {!active && (
                      <div className="shrink-0 h-2 w-2 rounded-full bg-primary mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4">
              <EmptyState title="No chats yet" description="Open a product and start a seller conversation." />
            </div>
          )}
        </aside>

        {/* RIGHT MESSAGE PANEL */}
        <section className="flex min-h-[520px] flex-col">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="border-b border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {isMobileView && (
                    <button
                      onClick={() => navigate('/chats')}
                      className="shrink-0 -ml-1 p-1 hover:bg-slate-100 rounded-lg transition"
                    >
                      <ChevronLeft className="h-5 w-5 text-ink" />
                    </button>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-bold text-ink truncate">{activeChat.productTitle}</h2>
                    <p className="text-xs text-slate-500 truncate">
                      {activeChat.buyerId === user?.id ? activeChat.sellerName : activeChat.buyerName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Escrow Notice */}
              <div className="border-b border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                  <p className="font-medium">Escrow protects the purchase when an order is placed.</p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
                {loadingMessages ? (
                  <Loader label="Loading messages" />
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedMessages).map(([dateKey, msgs]) => (
                      <div key={dateKey}>
                        {/* Date Separator */}
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-slate-300" />
                          <span className="text-xs font-semibold text-slate-500 px-2">
                            {formatMessageDate(msgs[0].createdAt)}
                          </span>
                          <div className="flex-1 h-px bg-slate-300" />
                        </div>

                        {/* Messages */}
                        {msgs.map((message) => {
                          const mine = message.senderId === user?.id;
                          return (
                            <div key={message.id} className={`flex mb-3 ${mine ? 'justify-end' : 'justify-start'}`}>
                              <div
                                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm animate-scale-in ${
                                  mine
                                    ? 'bg-primary text-white rounded-br-sm'
                                    : 'bg-slate-100 text-ink rounded-bl-sm'
                                }`}
                              >
                                <p className="break-words">{message.content}</p>
                                <p
                                  className={`mt-1 text-[11px] ${
                                    mine ? 'text-indigo-100' : 'text-slate-500'
                                  }`}
                                >
                                  {formatTime(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {showTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 text-ink rounded-2xl rounded-bl-sm px-4 py-3">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                            <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-200 p-4">
                <form onSubmit={handleSend} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-pill bg-slate-100 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 border border-slate-200"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition ${
                      !draft.trim() || sending
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary-dark cursor-pointer'
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6">
              <EmptyState title="Select a conversation" description="Your marketplace messages appear here." />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
