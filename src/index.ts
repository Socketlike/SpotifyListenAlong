import { Injector, Logger, types, webpack } from 'replugged';

/* Only typing what is needed - this is not the full store */
interface SpotifyStore extends types.RawModule {
  getActiveSocketAndDevice: () => {
    socket: {
      isPremium: boolean;
    };
  };
}

const injector = new Injector();
let store: SpotifyStore;
let injected: boolean;

const getStore = async (): Promise<boolean> =>
  Boolean(
    store ||
      (store = await webpack.waitForModule<SpotifyStore>(
        webpack.filters.byProps('getActiveSocketAndDevice'),
      )),
  );

const inject = async (): Promise<void> => {
  if (!injected && (await getStore())) {
    injector.after(store, 'getActiveSocketAndDevice', (_, res) => {
      if (res?.socket) res.socket.isPremium = true;
      return res;
    });

    injected = true;
  }
};

export const start = inject;

export const stop = (): void => injector.uninjectAll();
