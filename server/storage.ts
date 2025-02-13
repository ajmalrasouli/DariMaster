import {
  words, wordGroups, studySessions, studyActivities, wordReviewItems,
  type Word, type WordGroup, type StudySession, type StudyActivity, type WordReviewItem,
  type InsertWord, type InsertWordGroup, type InsertStudySession, type InsertWordReview
} from "@shared/schema";

export interface IStorage {
  // Words
  getWord(id: number): Promise<Word | undefined>;
  getWords(): Promise<Word[]>;
  createWord(word: InsertWord): Promise<Word>;
  
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

export class MemStorage implements IStorage {
  private words = new Map<number, Word>();
  private groups = new Map<number, WordGroup>();
  private sessions = new Map<number, StudySession>();
  private activities = new Map<number, StudyActivity>();
  private reviews = new Map<number, WordReviewItem>();
  private currentIds = {
    word: 1,
    group: 1,
    session: 1,
    activity: 1,
    review: 1
  };

  async getWord(id: number): Promise<Word | undefined> {
    return this.words.get(id);
  }

  async getWords(): Promise<Word[]> {
    return Array.from(this.words.values());
  }

  async createWord(word: InsertWord): Promise<Word> {
    const id = this.currentIds.word++;
    const newWord = { ...word, id };
    this.words.set(id, newWord);
    return newWord;
  }

  async getGroup(id: number): Promise<WordGroup | undefined> {
    return this.groups.get(id);
  }

  async getGroups(): Promise<WordGroup[]> {
    return Array.from(this.groups.values());
  }

  async createGroup(group: InsertWordGroup): Promise<WordGroup> {
    const id = this.currentIds.group++;
    const newGroup = { ...group, id };
    this.groups.set(id, newGroup);
    return newGroup;
  }

  async getStudySession(id: number): Promise<StudySession | undefined> {
    return this.sessions.get(id);
  }

  async getStudySessions(): Promise<StudySession[]> {
    return Array.from(this.sessions.values());
  }

  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const id = this.currentIds.session++;
    const newSession = { ...session, id, createdAt: new Date() };
    this.sessions.set(id, newSession);
    return newSession;
  }

  async createWordReview(review: InsertWordReview): Promise<WordReviewItem> {
    const id = this.currentIds.review++;
    const newReview = { ...review, id, createdAt: new Date() };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async getWordReviews(sessionId: number): Promise<WordReviewItem[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.studySessionId === sessionId
    );
  }

  async getWordStats(wordId: number): Promise<{correct: number; incorrect: number}> {
    const reviews = Array.from(this.reviews.values()).filter(
      review => review.wordId === wordId
    );
    return {
      correct: reviews.filter(r => r.correct).length,
      incorrect: reviews.filter(r => !r.correct).length
    };
  }

  async resetHistory(): Promise<void> {
    this.sessions.clear();
    this.activities.clear();
    this.reviews.clear();
    this.currentIds.session = 1;
    this.currentIds.activity = 1;
    this.currentIds.review = 1;
  }

  async resetAll(): Promise<void> {
    this.words.clear();
    this.groups.clear();
    await this.resetHistory();
    this.currentIds.word = 1;
    this.currentIds.group = 1;
  }
}

export const storage = new MemStorage();
