import { motion } from 'framer-motion';
import { BiologyQuestion } from '@/data/biologyQuestions';

interface QuestionCardProps {
  question: BiologyQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

import { useState, useEffect } from 'react';

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const isCorrect = selectedAnswer === question.correctAnswer;
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [question]);
  
  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    onAnswer(answer === question.correctAnswer);
    
    // Show explanation after a short delay for better UX
    setTimeout(() => {
      setShowExplanation(true);
    }, 800);
  };
  
  // Determine difficulty badge color
  const getDifficultyColor = () => {
    switch(question.difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium opacity-90">题目 {question.id}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor()}`}>
            {question.difficulty === 'easy' ? '简单' : question.difficulty === 'medium' ? '中等' : '困难'}
          </span>
        </div>
        <div className="mt-1 text-xs opacity-80">{question.topic}</div>
      </div>
      
      {/* Question Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {question.question}
        </h3>
        
        {/* Answer Buttons */}
         {selectedAnswer === null && (
           <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.button
              onClick={() => handleAnswer(true)}
              className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fa-solid fa-check mr-2"></i>正确
            </motion.button>
            
            <motion.button
              onClick={() => handleAnswer(false)}
              className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fa-solid fa-times mr-2"></i>错误
            </motion.button>
          </div>
        )}
        
        {/* Answer Feedback */}
        {selectedAnswer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-4 rounded-xl mb-4 ${
              isCorrect 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                isCorrect 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {isCorrect ? (
                  <i className="fa-solid fa-check"></i>
                ) : (
                  <i className="fa-solid fa-times"></i>
                )}
              </div>
              <h4 className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect 
                  ? '回答正确！' 
                  : `回答错误，正确答案是：${question.correctAnswer ? '正确' : '错误'}`}
              </h4>
            </div>
          </motion.div>
        )}
        
        {/* Explanation */}
         {selectedAnswer !== null && showExplanation && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             transition={{ duration: 0.5 }}
             className="bg-gray-50 border border-gray-200 rounded-xl p-4"
           >
             <h4 className="font-medium text-gray-700 mb-2 flex items-center">
               <i className="fa-solid fa-book-open mr-2 text-blue-500"></i>解析
             </h4>
             <p className="text-gray-600 text-sm leading-relaxed">
               {question.explanation}
             </p>
           </motion.div>
         )}
      </div>
    </div>
  );
}