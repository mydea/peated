import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import config from "~/config";

import { ApiClient, ApiError } from "~/lib/api";
import { sessionStorage } from "~/services/session.server";
import type { SessionPayload } from "~/types";

export const authenticator = new Authenticator<SessionPayload>(sessionStorage);

const api = new ApiClient({ server: config.API_SERVER });

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");
    const code = form.get("code");

    try {
      const session = code
        ? await api.post("/auth/google", {
            data: {
              code: code,
            },
          })
        : await api.post("/auth/basic", {
            data: {
              email,
              password,
            },
          });

      return session;
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        return null;
      }
      throw err;
    }
  }),
  "default",
);
