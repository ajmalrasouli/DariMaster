import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Word } from "@shared/schema";

export function StudySessionPage() {
  const [, params] = useRoute("/study/:groupId");
  const groupId = params?.groupId ? parseInt(params.groupId) : undefined;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const { data: words = [] } = useQuery<Word[]>({
    queryKey: ["group-words", groupId],
    queryFn: async () => {
      const response = await fetch(`/api/groups/${groupId}/words`);
      return response.json();
    }
  });

  const currentWord = words[currentWordIndex];

  const nextWord = () => {
    setShowAnswer(false);
    setCurrentWordIndex((prev) => (prev + 1) % words.length);
  };

  if (!currentWord) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">No words to study</h1>
        <p>This group has no words yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Study Session</h1>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{currentWord.dari_word}</h2>
              <p className="text-lg text-gray-600 mb-4">{currentWord.pronunciation}</p>
              
              {showAnswer ? (
                <>
                  <p className="text-xl mb-4">{currentWord.english_translation}</p>
                  <p className="text-lg text-gray-600 mb-6" dir="rtl">
                    {currentWord.example_sentence}
                  </p>
                  <Button onClick={nextWord}>Next Word</Button>
                </>
              ) : (
                <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
              )}
              
              <p className="text-sm text-gray-500 mt-6">
                Word {currentWordIndex + 1} of {words.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 