import {
  words, wordGroups, wordsToGroups, studySessions, studyActivities, wordReviewItems,
  type Word, type WordGroup, type WordsToGroups, type StudySession, type StudyActivity, type WordReviewItem,
  type InsertWord, type InsertWordGroup, type InsertWordsToGroups, type InsertStudySession, type InsertWordReview
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Words
  getWord(id: number): Promise<Word | undefined>;
  getWords(): Promise<Word[]>;
  createWord(word: InsertWord): Promise<Word>;
  getGroupWords(groupId: number): Promise<Word[]>;
  addWordToGroup(data: InsertWordsToGroups): Promise<WordsToGroups>;

  // Groups
  getGroup(id: number): Promise<WordGroup | undefined>;
  getGroups(): Promise<WordGroup[]>;
  createGroup(group: InsertWordGroup): Promise<WordGroup>;

  // Study Sessions
  getStudySession(id: number): Promise<StudySession | undefined>;
  getStudySessions(): Promise<StudySession[]>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;

  // Word Reviews
  createWordReview(review: InsertWordReview): Promise<WordReviewItem>;
  getWordReviews(sessionId: number): Promise<WordReviewItem[]>;

  // Stats
  getWordStats(wordId: number): Promise<{correct: number; incorrect: number}>;

  // Reset
  resetHistory(): Promise<void>;
  resetAll(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getWord(id: number): Promise<Word | undefined> {
    const [word] = await db.select().from(words).where(eq(words.id, id));
    return word;
  }

  async getWords(): Promise<Word[]> {
    return db.select().from(words);
  }

  async createWord(word: InsertWord): Promise<Word> {
    const [newWord] = await db.insert(words).values(word).returning();
    return newWord;
  }

  async getGroupWords(groupId: number): Promise<Word[]> {
    // Get words that belong to the specified group using the words_to_groups table
    const result = await db
      .select({
        id: words.id,
        dariWord: words.dariWord,
        englishTranslation: words.englishTranslation,
        pronunciation: words.pronunciation,
        exampleSentence: words.exampleSentence,
      })
      .from(words)
      .innerJoin(wordsToGroups, eq(words.id, wordsToGroups.wordId))
      .where(eq(wordsToGroups.groupId, groupId));

    return result;
  }

  async addWordToGroup(data: InsertWordsToGroups): Promise<WordsToGroups> {
    const [relation] = await db.insert(wordsToGroups).values(data).returning();
    return relation;
  }

  async getGroup(id: number): Promise<WordGroup | undefined> {
    const [group] = await db.select().from(wordGroups).where(eq(wordGroups.id, id));
    return group;
  }

  async getGroups(): Promise<WordGroup[]> {
    return db.select().from(wordGroups);
  }

  async createGroup(group: InsertWordGroup): Promise<WordGroup> {
    const [newGroup] = await db.insert(wordGroups).values(group).returning();
    return newGroup;
  }

  async getStudySession(id: number): Promise<StudySession | undefined> {
    const [session] = await db.select().from(studySessions).where(eq(studySessions.id, id));
    return session;
  }

  async getStudySessions(): Promise<StudySession[]> {
    return db.select().from(studySessions);
  }

  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const [newSession] = await db.insert(studySessions).values(session).returning();
    return newSession;
  }

  async createWordReview(review: InsertWordReview): Promise<WordReviewItem> {
    const [newReview] = await db.insert(wordReviewItems).values(review).returning();
    return newReview;
  }

  async getWordReviews(sessionId: number): Promise<WordReviewItem[]> {
    return db.select()
      .from(wordReviewItems)
      .where(eq(wordReviewItems.studySessionId, sessionId));
  }

  async getWordStats(wordId: number): Promise<{correct: number; incorrect: number}> {
    const reviews = await db.select()
      .from(wordReviewItems)
      .where(eq(wordReviewItems.wordId, wordId));

    return {
      correct: reviews.filter(r => r.correct).length,
      incorrect: reviews.filter(r => !r.correct).length
    };
  }

  async resetHistory(): Promise<void> {
    await db.delete(wordReviewItems);
    await db.delete(studyActivities);
    await db.delete(studySessions);
  }

  async resetAll(): Promise<void> {
    await this.resetHistory();
    await db.delete(wordsToGroups);
    await db.delete(words);
    await db.delete(wordGroups);
  }
}

export const storage = new DatabaseStorage();