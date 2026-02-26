import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  team1Score: integer("team1_score").notNull(),
  team2Score: integer("team2_score").notNull(),
  category: text("category").notNull(),
  playedAt: timestamp("played_at").defaultNow().notNull(),
});
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true, playedAt: true });
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type LeaderboardEntry = {
  teamName: string;
  totalScore: number;
  matchesPlayed: number;
  wins: number;
};
