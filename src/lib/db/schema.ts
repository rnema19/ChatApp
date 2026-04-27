import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const chats = pgTable('chats', {
  id: serial('id').notNull().primaryKey(),
  pdfName: text('pdf_name').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId : varchar("user_id",{length:256}).notNull(),
  fileKey: text('file_key').notNull()
});

export type DrizzleChat = typeof chats.$inferSelect

export const messages = pgTable('messages', {
  id: serial('id').notNull().primaryKey(),
  chatId: serial('chat_id').notNull().references(()=>chats.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  role : text("role").notNull()
});

export const users = pgTable('users', {
  id: serial('id').notNull().primaryKey(),
  userId : varchar("user_id",{length:256}).notNull(),
  fullName: text('full_name').notNull(),
  emailId: text('email_id').notNull(),
});


        