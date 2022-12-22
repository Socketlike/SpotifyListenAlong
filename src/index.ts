import { Injector, common, logger } from "replugged";
import { SpotifyActiveSocketAndDevice } from "./types";

const inject = new Injector();

export async function start(): Promise<void> {
  let spotify = common.spotifySocket;

  if (spotify) {
    inject.after(
      spotify,
      "getActiveSocketAndDevice",
      (
        _funcArgs: void[],
        data: SpotifyActiveSocketAndDevice | undefined,
        _self: Record<string, unknown>,
      ) => {
        if (data?.socket) data.socket.isPremium = true;
        return data;
      },
    );
    logger.log('SpotifyListenAlong', undefined, 'Injected into spotifySocket', spotify)
  } else {
    logger.error("TypeError", "SpotifyListenAlong", "spotifySocket is nullish", spotify);
  }
}

export function stop(): void {
  inject.uninjectAll();
}
