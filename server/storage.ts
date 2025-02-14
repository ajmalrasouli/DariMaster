import { db } from './db';

import {
  type Word, 
  type WordGroup, 
  type WordsToGroups, 
  type StudySession, 
  type StudyActivity, 
  type WordReviewItem,
  type InsertWord, 
  type InsertWordGroup, 
  type InsertWordsToGroups, 
  type InsertStudySession, 
  type InsertWordReview
} from "../shared/schema";

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

export const storage = {
    getWords: () => {
        return db.prepare('SELECT * FROM words').all();
    },
    
    getWord: (id: number) => {
        return db.prepare('SELECT * FROM words WHERE id = ?').get(id);
    },
    
    createWord: (word: { dariWord: string; englishTranslation: string; pronunciation: string; exampleSentence: string }) => {
        const result = db.prepare(`
            INSERT INTO words (dari_word, english_translation, pronunciation, example_sentence)
            VALUES (?, ?, ?, ?)
        `).run(word.dariWord, word.englishTranslation, word.pronunciation, word.exampleSentence);
        return { id: result.lastInsertRowid, ...word };
    },

    // Add other methods as needed...
};

// Export the database functions that the server needs
export {
  db,
  getWords,
  getWordGroups,
  getWordsByGroup,
  createWord,
  createWordGroup,
  addWordToGroup
};