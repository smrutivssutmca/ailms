import React from 'react';

interface QuestionCardProps {
  question: string;
  options: string[];
  onSelect: (index: number) => void;
  selected?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, options, onSelect, selected }) => (
  <div className="mb-6 p-4 bg-white rounded shadow">
    <h3 className="mb-4 font-semibold">{question}</h3>
    <div className="space-y-2">
      {options.map((opt, idx) => (
        <button
          key={idx}
          className={`w-full text-left px-4 py-2 border rounded ${selected === idx ? 'bg-blue-100 border-blue-500' : ''}`}
          onClick={() => onSelect(idx)}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default QuestionCard;
