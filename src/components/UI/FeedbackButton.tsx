import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Brain, TrendingUp } from 'lucide-react';
import { Button } from './Button';

interface FeedbackButtonProps {
  onFeedback: (isCorrect: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function FeedbackButton({ onFeedback, disabled = false, className = '' }: FeedbackButtonProps) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleFeedback = (correct: boolean) => {
    setIsCorrect(correct);
    setFeedbackGiven(true);
    onFeedback(correct);
  };

  if (feedbackGiven) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center space-x-1 text-sm text-green-400">
          <Brain className="h-4 w-4" />
          <span>Thanks! Model updated</span>
        </div>
        {isCorrect ? (
          <ThumbsUp className="h-4 w-4 text-green-400" />
        ) : (
          <ThumbsDown className="h-4 w-4 text-red-400" />
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-gray-400">Was this prediction correct?</span>
      <Button
        onClick={() => handleFeedback(true)}
        disabled={disabled}
        size="sm"
        variant="secondary"
        icon={ThumbsUp}
        className="text-green-400 hover:text-green-300"
      >
        Yes
      </Button>
      <Button
        onClick={() => handleFeedback(false)}
        disabled={disabled}
        size="sm"
        variant="secondary"
        icon={ThumbsDown}
        className="text-red-400 hover:text-red-300"
      >
        No
      </Button>
    </div>
  );
}