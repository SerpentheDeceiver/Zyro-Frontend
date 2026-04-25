import { USE_MOCK } from './config';
import { authAPI as mockAuthAPI } from './mock/auth.mock';
import { productsAPI as mockProductsAPI } from './mock/product.mock';
import { ordersAPI as mockOrdersAPI } from './mock/order.mock';
import { chatAPI as mockChatAPI } from './mock/chat.mock';
import { walletAPI as mockWalletAPI } from './mock/wallet.mock';
import { authAPI as realAuthAPI } from './real/auth.api';
import { productsAPI as realProductsAPI } from './real/product.api';
import { ordersAPI as realOrdersAPI } from './real/order.api';
import { chatAPI as realChatAPI } from './real/chat.api';
import { walletAPI as realWalletAPI } from './real/wallet.api';

export const authAPI = USE_MOCK ? mockAuthAPI : realAuthAPI;
export const productsAPI = USE_MOCK ? mockProductsAPI : realProductsAPI;
export const ordersAPI = USE_MOCK ? mockOrdersAPI : realOrdersAPI;
export const chatAPI = USE_MOCK ? mockChatAPI : realChatAPI;
export const walletAPI = USE_MOCK ? mockWalletAPI : realWalletAPI;

// Escrow is currently only available in API mode.
export { escrowAPI } from './escrow.api';
