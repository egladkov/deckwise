import Dexie, { type Table } from "dexie";
import { DeckReview, ReviewChatMessage } from "../types";

export class DeckwiseDatabase extends Dexie {
  reviews!: Table<DeckReview, string>;
  chatMessages!: Table<ReviewChatMessage, string>;

  constructor() {
    super("DeckwiseDatabase");
    this.version(1).stores({
      reviews: "id, createdAt, status, overallScore, grade",
      chatMessages: "id, reviewId, createdAt",
    });
  }
}

export const db = new DeckwiseDatabase();

export const indexedDbService = {
  async clearAllData(): Promise<void> {
    try {
      await db.reviews.clear();
      await db.chatMessages.clear();
    } catch (error) {
      console.error("Failed to clear IndexedDB tables:", error);
      throw error;
    }
  },
};
