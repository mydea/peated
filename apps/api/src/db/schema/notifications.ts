import { relations } from "drizzle-orm";
import {
  bigint,
  bigserial,
  boolean,
  pgTable,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { objectTypeEnum } from "./enums";
import { users } from "./users";

// this table is intended to delete notifications which are older than X time and read
export const notifications = pgTable(
  // oops named this wrong sorry
  "notifications",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: bigint("user_id", { mode: "number" })
      .references(() => users.id)
      .notNull(),
    fromUserId: bigint("from_user_id", { mode: "number" }).references(
      () => users.id,
    ),
    // tracks ref of what owns the notification
    objectId: bigint("object_id", { mode: "number" }).notNull(),
    objectType: objectTypeEnum("object_type").notNull(),
    // does not default as it should be set to object's createdAt timestamp
    createdAt: timestamp("created_at").notNull(),

    read: boolean("read").default(false).notNull(),
  },
  (notifications) => {
    return {
      notificationUnique: uniqueIndex("notifications_unq").on(
        notifications.userId,
        notifications.objectId,
        notifications.objectType,
        notifications.createdAt,
      ),
    };
  },
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  fromUser: one(users, {
    fields: [notifications.fromUserId],
    references: [users.id],
  }),
}));

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
