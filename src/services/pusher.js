import Pusher from 'pusher-js';

// Pusher 설정
const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY || '2a0297a0c06f67fa3022', {
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'ap3',
  forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
});

// 연결 상태 로깅
pusher.connection.bind('connected', () => {
  console.log('Pusher connected');
});

pusher.connection.bind('disconnected', () => {
  console.log('Pusher disconnected');
});

pusher.connection.bind('error', (err) => {
  console.error('Pusher error:', err);
});

export default pusher;

