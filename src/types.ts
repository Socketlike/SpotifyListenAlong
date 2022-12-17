/* 
   eslint-disable @typescript-eslint/naming-convention
   ----
   eslint being mad about discord's naming conventions
   oh well
*/
interface SpotifyActiveDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

interface SpotifyActiveSocket {
  accessToken: string;
  accountId: string;
  backoff: {
    jitter: boolean;
    max: number;
    min: number;
    _callbacK: (function|null);
    _current: number;
    _fails: number;
    current: number;
    fails: number;
    pending: boolean;
  };
  connectionId: string;
  handleDeviceStateChange: function;
  isPremium: boolean;
  pingInterval: {
    _ref: number;
    start: function;
    stop: function;
  };
  socket: WebSocket;
  _requestedConnect: boolean;
  _requestedDisconnect: boolean;
  connected: boolean;
}

export interface SpotifyActiveSocketAndDevice {
  device: SpotifyActiveDevice;
  socket: SpotifyActiveSocket;
}