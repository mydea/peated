import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import buildFastify from "../app";
import { db } from "../db";
import { notifications } from "../db/schema";
import * as Fixtures from "../lib/test/fixtures";

let app: FastifyInstance;
beforeAll(async () => {
  app = await buildFastify();

  return async () => {
    app.close();
  };
});

test("delete own notification", async () => {
  const [notification] = await db
    .insert(notifications)
    .values({
      userId: DefaultFixtures.user.id,
      fromUserId: (await Fixtures.User()).id,
      objectType: "tasting",
      objectId: 1,
      createdAt: new Date(),
    })
    .returning();

  const response = await app.inject({
    method: "DELETE",
    url: `/notifications/${notification.id}`,
    headers: DefaultFixtures.authHeaders,
  });

  expect(response).toRespondWith(204);

  const [newNotification] = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, notification.id));
  expect(newNotification).toBeUndefined();
});

test("cannot delete others notification", async () => {
  const [notification] = await db
    .insert(notifications)
    .values({
      userId: (await Fixtures.User()).id,
      fromUserId: DefaultFixtures.user.id,
      objectType: "tasting",
      objectId: 1,
      createdAt: new Date(),
    })
    .returning();

  const response = await app.inject({
    method: "DELETE",
    url: `/notifications/${notification.id}`,
    headers: DefaultFixtures.authHeaders,
  });

  expect(response).toRespondWith(403);
});
