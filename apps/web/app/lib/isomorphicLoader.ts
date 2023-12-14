import { makeTRPCClient } from "@peated/server/src/lib/trpc";
import config from "@peated/web/config";
import { type ClientLoaderFunctionArgs } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/server-runtime";
import { captureException } from "@sentry/remix";

export type IsomorphicContext = {
  request: LoaderFunctionArgs["request"] | ClientLoaderFunctionArgs["request"];
  params: LoaderFunctionArgs["params"] | ClientLoaderFunctionArgs["params"];
  context: {
    trpc: ReturnType<typeof makeTRPCClient>;
  };
};

type DataCallback<T> = (context: IsomorphicContext) => Promise<T>;

/**
 * Builds a loader which gives access to a uniform context object, using DI to inject
 * identical interfaces which can be run against the client and server.
 *
 * ```
 * export const { loader, clientLoader } = makeIsomorphicLoader(async ({ params, context: { trpc }}) => {
 *  invariant(params.bottleId);
 *  const bottle = await trpc.bottleById.query(Number(params.bottleId));
 *  return { bottle };
 * });
 * ```
 */
export function makeIsomorphicLoader<T>(callback: DataCallback<T>) {
  return {
    loader: async function loader({
      request,
      params,
      context: { trpc },
    }: LoaderFunctionArgs) {
      const context: IsomorphicContext = {
        request,
        params,
        context: { trpc },
      };
      const payload = await callback(context);
      return json(payload);
    },
    clientLoader: async function clientLoader({
      request,
      params,
    }: ClientLoaderFunctionArgs) {
      const trpcClient = makeTRPCClient(
        config.API_SERVER,
        null,
        captureException,
      );

      const context: IsomorphicContext = {
        request,
        params,
        context: { trpc: trpcClient },
      };
      const payload = await callback(context);
      return payload;
    },
  };
}
