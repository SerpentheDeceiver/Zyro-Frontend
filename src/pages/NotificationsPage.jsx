import { useEffect, useMemo, useState } from 'react';
import { Bell, MessageCircle, Shield, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState.jsx';

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatRelativeTime(isoString) {
  const value = new Date(isoString);
  const diffMs = Date.now() - value.getTime();
  const diffMins = Math.max(0, Math.round(diffMs / 60000));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

function getIconConfig(type) {
  switch (type) {
    case 'order':
      return { Icon: ShoppingBag, bg: 'bg-indigo-100', fg: 'text-indigo-700' };
    case 'escrow':
      return { Icon: Shield, bg: 'bg-amber-100', fg: 'text-amber-700' };
    case 'chat':
      return { Icon: MessageCircle, bg: 'bg-cyan-100', fg: 'text-cyan-700' };
    case 'system':
    default:
      return { Icon: Bell, bg: 'bg-slate-100', fg: 'text-slate-600' };
  }
}

const FILTERS = [
  { id: 'all', label: 'All', types: null },
  { id: 'order', label: 'Orders', types: ['order'] },
  { id: 'escrow', label: 'Escrow', types: ['escrow'] },
  { id: 'chat', label: 'Messages', types: ['chat'] },
];

const NOW = Date.now();
const MOCK_NOTIFICATIONS = [
  {
    id: 'n-001',
    type: 'order',
    title: 'Order placed successfully',
    body: 'Your order ZY-ORD-1042 is confirmed. We’ll notify you when it ships.',
    time: new Date(NOW - 2 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/orders',
  },
  {
    id: 'n-002',
    type: 'escrow',
    title: 'Funds held in escrow',
    body: 'Payment is securely held. Confirm receipt once you receive the item.',
    time: new Date(NOW - 12 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/orders',
  },
  {
    id: 'n-003',
    type: 'chat',
    title: 'Message from Ganesh',
    body: 'I can ship it tomorrow morning — does that work?',
    time: new Date(NOW - 58 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/chat',
  },
  {
    id: 'n-004',
    type: 'system',
    title: 'Security tip',
    body: 'Always confirm receipt only after you’ve inspected the item.',
    time: new Date(NOW - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/settings',
  },
  {
    id: 'n-005',
    type: 'order',
    title: 'Order updated',
    body: 'Your order ZY-ORD-2178 status has changed. View the latest details.',
    time: new Date(NOW - 28 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/orders',
  },
  {
    id: 'n-006',
    type: 'escrow',
    title: 'Payment released',
    body: 'Payment for ZY-ORD-2178 was released to the seller.',
    time: new Date(NOW - 50 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/orders',
  },
  {
    id: 'n-007',
    type: 'chat',
    title: 'Message from Meera',
    body: 'Thanks! I’ll share the tracking ID shortly.',
    time: new Date(NOW - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/chat',
  },
  {
    id: 'n-008',
    type: 'system',
    title: 'New feature: Notifications',
    body: 'You can now filter notifications by Orders, Escrow, and Messages.',
    time: new Date(NOW - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/notifications',
  },
  {
    id: 'n-009',
    type: 'escrow',
    title: 'Escrow frozen — dispute raised',
    body: 'A dispute has been raised. Escrow is frozen while we review the issue.',
    time: new Date(NOW - 9 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/orders',
  },
  {
    id: 'n-010',
    type: 'order',
    title: 'Order cancelled',
    body: 'Order ZY-ORD-3891 has been cancelled.',
    time: new Date(NOW - 12 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/orders',
  },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [highlightUntilClear, setHighlightUntilClear] = useState(() => new Set());

  useEffect(() => {
    const initial = new Set(notifications.filter((n) => !n.read).map((n) => n.id));
    setHighlightUntilClear(initial);

    const timeout = setTimeout(() => {
      setHighlightUntilClear(new Set());
    }, 3000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const config = FILTERS.find((f) => f.id === activeFilter) || FILTERS[0];
    if (!config.types) return notifications;
    return notifications.filter((n) => config.types.includes(n.type));
  }, [activeFilter, notifications]);

  const { todayItems, earlierItems } = useMemo(() => {
    const now = new Date();
    const sorted = [...filtered].sort((a, b) => new Date(b.time) - new Date(a.time));
    const today = [];
    const earlier = [];

    for (const item of sorted) {
      const when = new Date(item.time);
      if (isSameDay(when, now)) today.push(item);
      else earlier.push(item);
    }

    return { todayItems: today, earlierItems: earlier };
  }, [filtered]);

  function markAsRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setHighlightUntilClear((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleClick(notification) {
    if (!notification.read) markAsRead(notification.id);
    navigate(notification.actionUrl);
  }

  function handleMarkAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setHighlightUntilClear(new Set());
  }

  const emptyTitle =
    activeFilter === 'all' ? 'No notifications' : `No ${FILTERS.find((f) => f.id === activeFilter)?.label.toLowerCase() || ''} notifications`;

  return (
    <main className="page-shell py-8 animate-fade-slide-up">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-ink">Notifications</h1>
          </div>
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="text-sm font-bold text-primary hover:underline"
          >
            Mark all as read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 inline-flex rounded-pill bg-slate-100 p-1">
          {FILTERS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={[
                'rounded-pill px-4 py-2 text-sm font-bold transition',
                activeFilter === tab.id ? 'bg-white text-primary shadow-soft' : 'text-slate-600 hover:text-slate-900',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <EmptyState title={emptyTitle} subtitle="You're all caught up!" />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {todayItems.length ? <SectionSeparator label="Today" /> : null}
            {todayItems.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                highlight={highlightUntilClear.has(notification.id)}
                onClick={() => handleClick(notification)}
              />
            ))}

            {earlierItems.length ? <SectionSeparator label="Earlier" /> : null}
            {earlierItems.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                highlight={highlightUntilClear.has(notification.id)}
                onClick={() => handleClick(notification)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function SectionSeparator({ label }) {
  return (
    <div className="flex items-center gap-3 border-t border-slate-200 bg-slate-50 px-4 py-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function NotificationRow({ notification, highlight, onClick }) {
  const { Icon, bg, fg } = getIconConfig(notification.type);
  const isUnread = !notification.read;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group flex w-full items-start gap-4 px-4 py-4 text-left transition',
        'border-l-4',
        highlight ? 'border-primary' : 'border-transparent',
        'transition-colors duration-700',
        isUnread ? 'bg-indigo-50' : 'bg-white',
        'hover:bg-slate-50',
        'border-t border-slate-200',
      ].join(' ')}
    >
      {/* Icon */}
      <div className={[bg, fg, 'mt-0.5 shrink-0 rounded-full p-3'].join(' ')}>
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={[isUnread ? 'font-bold' : 'font-medium', 'text-ink'].join(' ')}>
          {notification.title}
        </p>
        <p
          className="mt-1 text-sm text-slate-600"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {notification.body}
        </p>
        <p className="mt-2 text-xs text-slate-500">{formatRelativeTime(notification.time)}</p>
      </div>

      {/* Unread Indicator */}
      <div className="shrink-0 pt-1">
        {isUnread ? <span className="inline-flex h-2 w-2 rounded-full bg-primary" /> : null}
      </div>
    </button>
  );
}

