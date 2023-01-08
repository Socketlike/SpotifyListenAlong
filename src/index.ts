import { Injector, Logger, common, webpack } from "replugged";

interface FluxDispatcher {
  subscribe: (name: string, callback: (...args: unknown[]) => void) => void;
  unsubscribe: (name: string, callback: (...args: unknown[]) => void) => void;
}

interface SpotifySocket {
  getActiveSocketAndDevice: () => void | {
    socket: {
      isPremium: boolean;
    };
  };
}

const injector = new Injector();
let socket: void | SpotifySocket;
let injected = false;
const logger = Logger.plugin("SpotifyListenAlong");

export const injectionHandler = async (): Promise<void> => {
  if (!socket)
    socket = (await webpack.waitForModule(
      webpack.filters.byProps("getActiveSocketAndDevice"),
    )) as unknown as SpotifySocket;
  if (!socket) {
    logger.error("SpotifySocket not found");
  } else if (!injected) {
    injector.after(
      socket,
      "getActiveSocketAndDevice",
      (_args: void[], res: void | { socket: { isPremium: boolean } }) => {
        if (!res) return;
        res.socket.isPremium = true;
        return res;
      },
    );
    injected = true;
  }
};

export async function start(): Promise<void> {
  socket = (await webpack.waitForModule(
    webpack.filters.byProps("getActiveSocketAndDevice"),
  )) as unknown as SpotifySocket;

  await injectionHandler();

  if (!injected)
    (common.fluxDispatcher as unknown as FluxDispatcher).subscribe(
      "SPOTIFY_PLAYER_STATE",
      injectionHandler,
    );
}

export function stop(): void {
  (common.fluxDispatcher as unknown as FluxDispatcher).unsubscribe(
    "SPOTIFY_PLAYER_STATE",
    injectionHandler,
  );
  injector.uninjectAll();
}
