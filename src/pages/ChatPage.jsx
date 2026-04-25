import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useChat } from '../hooks/useChat';
import { formatTime, initials } from '../utils/format';

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chats, messages, loadingChats, loadingMessages, sendMessage } = useChat(chatId);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const activeChat = useMemo(() => chats.find((chat) => chat.id === chatId), [chatId, chats]);

  useEffect(() => {
    if (!chatId && chats.length) navigate(`/chat/${chats[0].id}`, { replace: true });
  }, [chatId, chats, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  return (
    <main className="page-shell py-6">
      <div className="grid min-h-[calc(100vh-7rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft lg:grid-cols-[340px_1fr]">
        <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 p-4">
            <h1 className="text-xl font-black text-slate-950">Chat</h1>
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
                  <Link
                    key={chat.id}
                    to={`/chat/${chat.id}`}
                    className={`flex gap-3 border-b border-slate-100 p-4 transition hover:bg-slate-50 ${
                      active ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                      {initials(otherName)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-slate-950">{otherName || 'Zyro member'}</span>
                      <span className="block truncate text-xs text-slate-500">{chat.productTitle}</span>
                      <span className="mt-1 block truncate text-sm text-slate-600">{chat.lastMessage || 'No messages yet'}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-4">
              <EmptyState title="No chats yet" description="Open a product and start a seller conversation." />
            </div>
          )}
        </aside>

        <section className="flex min-h-[520px] flex-col">
          {activeChat ? (
            <>
              <div className="border-b border-slate-200 p-4">
                <h2 className="font-black text-slate-950">{activeChat.productTitle}</h2>
                <p className="text-sm text-slate-500">
                  {activeChat.buyerId === user?.id ? activeChat.sellerName : activeChat.buyerName}
                </p>
              </div>
              <div className="border-b border-slate-200 bg-cyan-50 p-4 text-sm text-cyan-900">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck size={18} />
                  Escrow protects the purchase when an order is placed.
                </div>
              </div>
              <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
                {loadingMessages ? (
                  <Loader label="Loading messages" />
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const mine = message.senderId === user?.id;
                      return (
                        <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                              mine ? 'bg-primary text-white' : 'bg-white text-slate-800'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className={`mt-1 text-[11px] ${mine ? 'text-indigo-100' : 'text-slate-400'}`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>
              <form className="flex gap-3 border-t border-slate-200 p-4" onSubmit={handleSend}>
                <input className="input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message" />
                <Button type="submit" loading={sending} className="px-4">
                  <Send size={18} />
                </Button>
              </form>
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
