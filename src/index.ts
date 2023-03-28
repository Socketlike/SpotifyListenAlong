import { Injector, Logger, common, types, webpack } from 'replugged';

type GetActiveSocketAndDeviceRes = void | {
  socket: {
    isPremium: boolean;
  };
};

/* Only typing what is needed - this is not the full store */
interface SpotifyStore extends types.RawModule {
  getActiveSocketAndDevice: () => GetActiveSocketAndDeviceRes;
}

const injector = new Injector();
let store: SpotifyStore;
let injected = false;
const logger = Logger.plugin('SpotifyListenAlong');

const getStore = async (): Promise<void> => {
  if (store) return;

  store = await webpack.waitForModule<SpotifyStore>(
    webpack.filters.byProps('getActiveSocketAndDevice'),
  );

  if (!store) throw new TypeError('Cannot get Spotify store');
};

const storeInjectHandler = async (): Promise<void> => {
  if (injected) return;

  try {
    await getStore();

    injector.after(store, 'getActiveSocketAndDevice', (_, res): GetActiveSocketAndDeviceRes => {
      if (res?.socket) res.socket.isPremium = true;
      return res;
    });

    injected = true;
  } catch (e) {
    logger.error('Cannot get Spotify store; will try again at Spotify state change', e);
  }
};

export async function start(): Promise<void> {
  await storeInjectHandler();
  common.fluxDispatcher.subscribe('SPOTIFY_PLAYER_STATE', storeInjectHandler);
}

export async function stop(): Promise<void> {
  common.fluxDispatcher.unsubscribe('SPOTIFY_PLAYER_STATE', storeInjectHandler);
  injector.uninjectAll();
}
