import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QuestionCard from './QuestionCard';
import { biologyQuestions, getRandomQuestions, getQuestionsByTopic, BiologyQuestion } from '@/data/biologyQuestions';

interface QuizContainerProps {
  isEndlessChallenge?: boolean;
  topicChallenge?: string;
  autoStart?: boolean;
  onExit?: () => void;
}


export default function QuizContainer({ isEndlessChallenge = false, topicChallenge, autoStart = false, onExit }: QuizContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<BiologyQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answerSelected, setAnswerSelected] = useState(false);
  const [showAnswerPrompt, setShowAnswerPrompt] = useState(false);
  
  // Auto-start quiz if prop is true
  useEffect(() => {
    if (autoStart && !quizStarted && !showResults) {
      startQuiz();
    }
  }, [autoStart, quizStarted, showResults]);

  const [questionResults, setQuestionResults] = useState<Array<{id: number, isCorrect: boolean}>>([]);
  
  // Initialize quiz with random questions
  const startQuiz = () => {
    setLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      // If endless challenge, get questions sorted by difficulty (easy -> medium -> hard)
      // Otherwise, get random 10 questions
  const quizQuestions = isEndlessChallenge 
    ? getRandomQuestions(100) 
    : topicChallenge 
      ? getQuestionsByTopic(topicChallenge)
      : getRandomQuestions(10);
      
      console.log('Quiz questions loaded:', quizQuestions.length);
      
      setQuestions(quizQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuestionResults([]); // Reset results tracking
      setQuizStarted(true);
      setShowResults(false);
      setLoading(false);
    }, 800);
  };
  
  // Handle answer submission
  const handleAnswer = (isCorrect: boolean) => {
    // Add question result to tracking array
    setQuestionResults(prev => [...prev, {
      id: questions[currentQuestionIndex].id,
      isCorrect
    }]);
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    setAnswerSelected(true);
    setShowAnswerPrompt(false);
  };
  
  // Move to next question
  const nextQuestion = () => {
    if (!answerSelected) {
      setShowAnswerPrompt(true);
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setAnswerSelected(false);
    } else {
      // End of quiz
      setShowResults(true);
    }
  };
  
  // Restart quiz
  const restartQuiz = () => {
    startQuiz();
  };
  
  // Go back to home screen
  const exitQuiz = () => {
    setQuizStarted(false);
    setShowResults(false);
    onExit?.();
  };
  
  // Calculate progress percentage
  const progressPercentage = questions.length > 0 
    ? ((currentQuestionIndex + 1) / questions.length) * 100 
    : 0;
  
   // 当autoStart为true时，不显示初始界面
  if (!quizStarted && !showResults && !autoStart) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-8">
          <i className="fa-solid fa-dna text-5xl text-blue-600"></i>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">生物知识挑战</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          测试你的高考生物知识！回答判断题，挑战自己的生物学水平，每题都有详细解析帮助你巩固知识。
        </p>
        
        <motion.button
          onClick={startQuiz}
          className="py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fa-solid fa-play mr-2"></i>开始挑战
        </motion.button>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>共有 {biologyQuestions.length} 道题目，每次随机抽取 10 道</p>
        </div>
      </div>
    );
  }
  
  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-lg">
          <div className="text-white text-4xl font-bold">
            {((score / questions.length) * 100).toFixed(0)}%
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">挑战完成！</h1>
        <p className="text-xl text-gray-600 mb-8">
          你答对了 {score} 道题，共 {questions.length} 道题
        </p>
        
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-left">答题统计</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">正确率</span>
            <span className="font-medium">{((score / questions.length) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full"
              style={{ width: `${(score / questions.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-50 p-3 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">正确</div>
            </div>
            <div className="bg-red-50 p-3 rounded-xl">
              <div className="text-2xl font-bold text-red-600">{questions.length - score}</div>
              <div className="text-sm text-gray-600">错误</div>
            </div>
          </div>
        </div>
        
         <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 mb-8">
             <h3 className="text-lg font-semibold text-gray-700 mb-4 text-left">答题情况</h3>
             <div className="h-60 overflow-y-auto pr-2">
               <div className="grid grid-cols-10 gap-1 mb-2">
                 {questionResults.map((result, index) => (
                   <div 
                     key={result.id}
                     className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer hover:scale-110 transition-transform ${
                       result.isCorrect 
                         ? 'bg-green-100 text-green-800 border border-green-200' 
                         : 'bg-red-100 text-red-800 border border-red-200'
                     }`}
                     title={`题目 ${result.id}: ${result.isCorrect ? '正确' : '错误'}`}
                     onClick={() => {
                       const question = questions.find(q => q.id === result.id);
                       if (question) {
                         alert(`题目 ${question.id}: ${question.question}\n\n解析: ${question.explanation}`);
                       }
                     }}
                   >
                     {index + 1}
                   </div>
                 ))}
               </div>
               <p className="text-xs text-gray-500 mt-2 text-left">
                 <i className="fa-solid fa-circle-info mr-1"></i> 点击题号可查看对应题目解析
               </p>
             </div>
           </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            onClick={restartQuiz}
            className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa-solid fa-redo mr-2"></i>再试一次
          </motion.button>
          
          <motion.button
            onClick={exitQuiz}
            className="py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa-solid fa-home mr-2"></i>返回主页
          </motion.button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Quiz Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEndlessChallenge ? '无尽挑战' : 
             topicChallenge ? `${topicChallenge}专题` : 
             '随机挑战'}
          </h2>
          <div className="text-gray-600">
            <i className="fa-solid fa-scoreboard mr-1"></i>得分: {score}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
          <motion.div
            className="bg-gradient-to-r from-blue-400 to-indigo-600 h-2 rounded-full"
            style={{ width: `${progressPercentage}%` }}
            transition={{ width: { duration: 0.5, ease: "easeInOut" } }}
          ></motion.div>
        </div>
        
        <div className="text-xs text-gray-500 text-right">
          题目 {currentQuestionIndex + 1}/{questions.length}
        </div>
      </div>
      
      {/* Quiz Content */}
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">加载题目中...</p>
          </div>
        ) : questions.length > 0 ? (
          <div className="w-full">
            <QuestionCard
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
            />
            
            {/* Next Question Button */}
            <div className="mt-6 text-center">
             {showAnswerPrompt && (
               <div className="mb-4 text-red-500 text-sm animate-shake">
                 <i className="fa-solid fa-exclamation-circle mr-1"></i> 请先选择答案
               </div>
             )}
             
             <motion.button
               onClick={nextQuestion}
               disabled={!answerSelected}
               className={`py-3 px-6 font-medium rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                 answerSelected 
                   ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400' 
                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
               }`}
               whileHover={answerSelected ? { scale: 1.05 } : undefined}
               whileTap={answerSelected ? { scale: 0.95 } : undefined}
             >
               {currentQuestionIndex < questions.length - 1 ? (
                 <>
                   下一题 <i className="fa-solid fa-arrow-right ml-2"></i>
                 </>
               ) : (
                 <>
                   查看结果 <i className="fa-solid fa-chart-line ml-2"></i>
                 </>
               )}
             </motion.button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">没有可用题目</p>
            <button
              onClick={startQuiz}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg"
            >
              重新加载
            </button>
          </div>
        )}
      </div>
      
      {/* Exit Button */}
      <div className="p-4 text-center">
        <button
          onClick={exitQuiz}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <i className="fa-solid fa-sign-out-alt mr-1"></i>退出挑战
        </button>
      </div>
    </div>
  );
}