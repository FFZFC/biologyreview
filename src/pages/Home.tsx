import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import QuizContainer from '../components/QuizContainer';
import { biologyQuestions } from '../data/biologyQuestions';


export default function Home() {
  const [isEndlessChallenge, setIsEndlessChallenge] = useState<boolean | null>(null);
  const [topicChallenge, setTopicChallenge] = useState<string | null>(null);
  const [showTeamInfo, setShowTeamInfo] = useState(false);
  const [showTopicMenu, setShowTopicMenu] = useState(false);
  // 移除难度菜单相关状态
  const modalRef = useRef<HTMLDivElement>(null);
  
   // Get all topics from biology questions
  const topics = [
    "分子与细胞", "遗传与进化", "稳态与调节", "生物与环境", "生物技术与工程"
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <i className="fa-solid fa-dna text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-800">生物知识复习</h1>
          </div>
      <div className="flex items-center space-x-4 text-gray-500">
        <span className="text-sm">作者: FFZFC</span>
        <i 
          className="fa-solid fa-question-circle cursor-pointer hover:text-blue-500 transition-colors" 
          onClick={() => setShowTeamInfo(true)}
        ></i>
      </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-160px)]">
          {(isEndlessChallenge !== null || topicChallenge) ? (
             <QuizContainer 
               isEndlessChallenge={isEndlessChallenge || false} 
               topicChallenge={topicChallenge || undefined}
                
               autoStart={true}
                onExit={() => {
                  setIsEndlessChallenge(null);
                  setTopicChallenge(null);
                }}
             />
         ) : (
           <div className="flex flex-col items-center justify-center h-full gap-8">
             <div className="text-center">
               <h2 className="text-[clamp(1.8rem,5vw,2.5rem)] font-bold text-gray-800 mb-4">生物知识挑战</h2>
               <p className="text-gray-600 max-w-md mx-auto">
                 测试你的生物学知识水平，提升高考应试能力。两种挑战模式供你选择！
               </p>
             </div>
             
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {/* 随机挑战按钮 */}
                <button
                  onClick={() => {
                    setIsEndlessChallenge(false);
                     setTopicChallenge(null);
                     console.log("随机挑战模式已启动");
                   }}
                  className="py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <i className="fa-solid fa-random mr-2"></i>随机挑战
                </button>
                
                {/* 无尽挑战按钮 */}
                <button
                  onClick={() => {
                    setIsEndlessChallenge(true);
                     setTopicChallenge(null);
                     console.log("无尽挑战模式已启动");
                   }}
                  className="py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <i className="fa-solid fa-fire mr-2"></i>无尽挑战
                </button>
                
                 {/* 专项突破按钮 */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowTopicMenu(!showTopicMenu);
                    }}
                    className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    <i className="fa-solid fa-book-open mr-2"></i>专项突破
                  </button>
                  
                  {showTopicMenu && (
                    <div className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                      {topics.map(topic => (
                        <button
                          key={topic}
                          onClick={() => {
                            setTopicChallenge(topic);
                            setIsEndlessChallenge(null);
                            setShowTopicMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-green-50 text-gray-800 transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
             
              <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10题</div>
                  <div className="text-gray-600">随机挑战</div>
                  <p className="text-xs text-gray-500 mt-2">每次随机抽取10道题</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">100题</div>
                   <div className="text-gray-600">无尽挑战</div>
                   <p className="text-xs text-gray-500 mt-2">随机抽取100道题目</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center col-span-2">
                  <div className="text-3xl font-bold text-green-600 mb-2">{biologyQuestions.length}题</div>
                  <div className="text-gray-600">题库总量</div>
                  <p className="text-xs text-gray-500 mt-2">覆盖全部知识点</p>
                </div>
              </div>
           </div>
         )}
      </main>

       {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 生物知识挑战 | 高考生物复习助手</p>
          <p className="mt-1"><i className="fa-solid fa-users mr-1"></i>交流群：1056812836</p>
         </div>
        </footer>
        
        {/* 团队信息模态框 */}
        {showTeamInfo && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" 
            onClick={() => setShowTeamInfo(false)}
          >
            <motion.div 
              ref={modalRef}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">制作团队</h3>
                <button 
                  onClick={() => setShowTeamInfo(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <i className="fa-solid fa-user text-blue-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">作者</p>
                    <p className="font-medium">FFZFC</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <i className="fa-solid fa-hand-holding-heart text-green-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">赞助</p>
                    <p className="font-medium">mankind</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">© 2025 生物知识复习</p>
              </div>
            </motion.div>
          </div>
        )}
     </div>
  );
}