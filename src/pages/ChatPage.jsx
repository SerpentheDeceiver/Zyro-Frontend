import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, ShieldCheck, ChevronLeft, ExternalLink } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/common/Avatar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useChat } from '../hooks/useChat';

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatMessageDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateOnly = date.toDateString();
  if (dateOnly === today.toDateString()) return 'Today';
  if (dateOnly === yesterday.toDateString()) return 'Yesterday';
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
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [escrowAmount, setEscrowAmount] = useState('');

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const activeChat = useMemo(() => chats.find((chat) => chat.id === chatId), [chatId, chats]);
  const otherUserName = activeChat
    ? activeChat.buyerId === user?.id ? activeChat.sellerName : activeChat.buyerName
    : '';

  // Auto-redirect to first chat
  useEffect(() => {
    if (!chatId && chats.length) navigate(`/chats/${chats[0].id}`, { replace: true });
  }, [chatId, chats, navigate]);

  // Auto-scroll to bottom on new messages (useRef)
  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    return () => clearTimeout(timer);
  }, [messages]);

  // Typing indicator simulation
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

  // Resize handler
  useEffect(() => {
    function handleResize() {
      setIsMobileView(window.innerWidth < 1024);
    }
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
      inputRef.current?.focus();
    } finally {
      setSending(false);
    }
  }

  async function handleSendEscrowRequest() {
    if (!escrowAmount || Number(escrowAmount) <= 0) return;
    const amount = Number(escrowAmount).toLocaleString('en-IN');
    await sendMessage(`🔒 Escrow Request: ₹${amount} — Sender proposes an escrow-protected deal for this amount.`);
    setShowEscrowModal(false);
    setEscrowAmount('');
    inputRef.current?.focus();
  }

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
        {/* LEFT SIDEBAR — Chat List */}
        <aside
          className={`border-b border-slate-200 lg:border-b-0 lg:border-r lg:block ${
            isMobileView && activeChat ? 'hidden' : ''
          }`}
        >
          <div className="border-b border-slate-200 p-4">
            <h1 className="text-xl font-black text-gray-900">Chat</h1>
            <p className="text-sm text-slate-500">Buyer and seller messages</p>
          </div>

          {loadingChats ? (
            <Loader label="Loading chats" />
          ) : chats.length ? (
            <div className="max-h-[76vh] overflow-y-auto">
              {chats.map((chat) => {
                const otherName = chat.buyerId === user?.id ? chat.sellerName : chat.buyerName;
                const active = chat.id === chatId;
                const hasUnread = !active;
                return (
                  <div
                    key={chat.id}
                    onClick={() => navigate(`/chats/${chat.id}`)}
                    className={`flex cursor-pointer gap-3 border-b border-slate-100 p-4 transition ${
                      active ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <Avatar name={otherName} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`truncate font-bold ${active ? 'text-indigo-700' : 'text-gray-900'}`}>
                          {otherName || 'Zyro member'}
                        </h3>
                        <span className="shrink-0 text-xs text-slate-400">{chat.updatedAt ? formatTime(chat.updatedAt) : ''}</span>
                      </div>
                      <p className="truncate text-xs text-slate-500">{chat.productTitle}</p>
                      <p className="mt-1 truncate text-sm text-slate-600">{chat.lastMessage || 'No messages yet'}</p>
                    </div>
                    {hasUnread && (
                      <div className="mt-1 shrink-0 h-2.5 w-2.5 rounded-full bg-indigo-500" />
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

        {/* RIGHT — Message Panel */}
        <section className="flex min-h-[520px] flex-col">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {isMobileView && (
                    <button
                      onClick={() => navigate('/chats')}
                      className="shrink-0 -ml-1 p-1 hover:bg-slate-100 rounded-lg transition"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-900" />
                    </button>
                  )}
                  <Avatar name={otherUserName} size="sm" />
                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900 truncate">{otherUserName || 'Seller'}</h2>
                    <p className="text-xs text-slate-500 truncate">{activeChat.productTitle}</p>
                  </div>
                </div>

                {/* Product Preview Link */}
                {activeChat.productId && (
                  <Link
                    to={`/products/${activeChat.productId}`}
                    className="shrink-0 flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Item
                  </Link>
                )}
              </div>

              {/* Product Preview Banner */}
              {activeChat.productTitle && (
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-slate-500 shrink-0">About:</span>
                    <span className="text-sm font-semibold text-gray-900 truncate">{activeChat.productTitle}</span>
                  </div>
                </div>
              )}

              {/* Escrow Notice */}
              <div className="border-b border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm text-cyan-900">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="shrink-0 text-cyan-600" />
                  <p className="font-medium text-xs">Escrow protects your purchase when an order is placed.</p>
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
                          <div className="flex-1 h-px bg-slate-200" />
                          <span className="text-xs font-semibold text-slate-400 px-2 bg-slate-50">
                            {formatMessageDate(msgs[0].createdAt)}
                          </span>
                          <div className="flex-1 h-px bg-slate-200" />
                        </div>

                        {msgs.map((message) => {
                          const mine = message.senderId === user?.id;
                          const isEscrow = message.content?.startsWith('🔒 Escrow Request:');
                          return (
                            <div key={message.id} className={`flex mb-3 ${mine ? 'justify-end' : 'justify-start'}`}>
                              {isEscrow ? (
                                <div className="max-w-[78%] rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-4 py-3">
                                  <p className="text-sm font-semibold text-indigo-800">{message.content}</p>
                                  <p className="mt-1 text-[11px] text-indigo-400">{formatTime(message.createdAt)}</p>
                                </div>
                              ) : (
                                <div
                                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${
                                    mine
                                      ? 'bg-indigo-600 text-white rounded-br-sm'
                                      : 'bg-white text-gray-900 rounded-bl-sm border border-slate-200'
                                  }`}
                                >
                                  <p className="break-words">{message.content}</p>
                                  <p className={`mt-1 text-[11px] ${mine ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {formatTime(message.createdAt)}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {showTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3">
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
                  {/* Escrow Request Button */}
                  <button
                    type="button"
                    onClick={() => setShowEscrowModal(true)}
                    title="Send Escrow Request"
                    className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <ShieldCheck size={16} />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500/30 border border-slate-200"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition ${
                      !draft.trim() || sending
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                    }`}
                  >
                    <Send size={16} />
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

      {/* Escrow Request Modal */}
      {showEscrowModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowEscrowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Send Escrow Request</h3>
                <p className="text-xs text-slate-500">Propose an escrow-protected deal</p>
              </div>
            </div>

            <div className="mt-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Amount (₹)</label>
              <input
                type="number"
                value={escrowAmount}
                onChange={(e) => setEscrowAmount(e.target.value)}
                placeholder="Enter amount"
                autoFocus
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              />
              {activeChat?.price && (
                <p className="mt-1 text-xs text-slate-500">
                  Product price: ₹{Number(activeChat.price).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowEscrowModal(false)}
                className="flex-1 rounded-lg border border-slate-300 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendEscrowRequest}
                disabled={!escrowAmount || Number(escrowAmount) <= 0}
                className={`flex-1 rounded-lg py-2.5 font-semibold text-white transition ${
                  !escrowAmount || Number(escrowAmount) <= 0
                    ? 'cursor-not-allowed bg-slate-400'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
