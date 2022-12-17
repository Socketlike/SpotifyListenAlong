import { Injector, webpack } from "replugged";
import { SpotifyActiveSocketAndDevice } from "./types";

const inject = new Injector();

export async function start(): Promise<void> {
  let spotify = await webpack.waitForModule<{
    getActiveSocketAndDevice: () => SpotifyActiveSocketAndDevice | undefined;
  }>(webpack.filters.byProps("getActiveSocketAndDevice"));

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
    console.log("%c[SpotifyListenAlong]", "color: #5865F2", "Loaded", spotify);
  } else {
    console.error("%c[SpotifyListenAlong]", "color: #5865F2", "Something went wrong", spotify);
  }
}

export function stop(): void {
  inject.uninjectAll();
}
