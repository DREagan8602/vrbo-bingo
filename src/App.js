import React, { useState } from 'react';
import { 
  Rocket, 
  TrendingUp, 
  Umbrella, 
  Plane, 
  Camera,
  Sun,
  Map,
  MapPin,
  Star
} from 'lucide-react';

// Replace this URL with your new Google Script deployment URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyrSdJX_105J4W_8bU-MeC9uSjraSxQMNLFOa86c9Taf2sp1c5RXFgcrsw8k7-WUWN2iQ/exec';

const generateBingoNumbers = () => {
  const generateColumn = (prefix, min, max, count) => {
    const numbers = new Set();
    while (numbers.size < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(`${prefix}${num}`);
    }
    return Array.from(numbers);
  };

  const B = generateColumn('B', 1, 15, 5);
  const I = generateColumn('I', 16, 30, 5);
  const N = generateColumn('N', 31, 45, 5);
  const G = generateColumn('G', 46, 60, 5);
  const O = generateColumn('O', 61, 75, 5);

  const card = [];
  for (let i = 0; i < 5; i++) {
    card.push(B[i], I[i], N[i], G[i], O[i]);
  }

  card[12] = "Vrbo";
  return card;
};

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [bingoCard, setBingoCard] = useState([]);
  const [error, setError] = useState('');
  const [showJourney, setShowJourney] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    const newCard = generateBingoNumbers();
    setBingoCard(newCard);
    setShowJourney(true);
    
    try {
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('bingoCard', JSON.stringify(newCard));

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      console.log('Form submission response:', response);

      // Start loading animation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setLoadingProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowJourney(false);
            setSubmitted(true);
            setTimeout(() => setAnimationComplete(true), 100);
          }, 500);
        }
      }, 50);

    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to send bingo card. Please try again.');
      setShowJourney(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] via-[#e8f1f8] to-[#dde8f3] p-8">
      <div className="max-w-2xl mx-auto relative">
        {showJourney && (
          <div className="fixed inset-0 bg-gradient-to-br from-[#1a3346] via-[#294c6b] to-[#1a3346] flex items-center justify-center z-50">
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 animate-pulse">
                <Star className="w-8 h-8 text-yellow-300 opacity-60" />
              </div>
              <div className="absolute top-20 right-20 animate-pulse delay-100">
                <MapPin className="w-8 h-8 text-red-400 opacity-60" />
              </div>
              <div className="absolute bottom-20 left-20 animate-pulse delay-200">
                <Plane className="w-8 h-8 text-blue-400 opacity-60 transform rotate-45" />
              </div>
              <div className="absolute bottom-10 right-10 animate-pulse delay-300">
                <Sun className="w-8 h-8 text-orange-400 opacity-60" />
              </div>
            </div>
            
            <div className="text-center space-y-8 px-4 py-8 rounded-2xl backdrop-blur-lg bg-white/10">
              <h2 className="text-5xl font-bold text-white animate-pulse mb-4">
                Journey to January
                <Star className="inline ml-2 w-8 h-8 text-yellow-400" />
              </h2>
              
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-white/5 rounded-2xl transform rotate-2 scale-105"></div>
                <div className="absolute inset-0 bg-white/5 rounded-2xl transform -rotate-2 scale-105"></div>
                
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
                  <div className="flex justify-center space-x-8">
                    <div className="transform hover:scale-110 transition-transform">
                      <Rocket className="w-16 h-16 text-blue-400 animate-bounce" />
                    </div>
                    <div className="transform hover:scale-110 transition-transform">
                      <TrendingUp className="w-16 h-16 text-green-400 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-white text-2xl font-medium">Preparing your adventure...</p>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${loadingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-white/80 text-sm">{loadingProgress}% Complete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!submitted ? (
          <div className="bg-white/90 rounded-2xl shadow-2xl p-8 relative backdrop-blur-lg border border-white/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center space-x-2">
                <span className="text-2xl">🌴</span>
                <div className="bg-gradient-to-r from-[#294c6b] via-[#1a3346] to-[#294c6b] text-transparent bg-clip-text">
                  <h1 className="text-5xl font-bold mb-2">
                    Vrbo Journey to January Bingo
                  </h1>
                </div>
                <span className="text-2xl">🏖️</span>
              </div>
              <p className="text-gray-600 mt-4 text-lg flex items-center justify-center gap-2">
                <span>✈️</span>
                Relax, you're playing Vrbo bingo
                <span>🌊</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-lg font-medium mb-2 text-[#294c6b] flex items-center gap-2"
                >
                  <span>📧</span> Enter your email to get your bingo card
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 p-3 border-2 border-[#294c6b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294c6b] shadow-sm"
                    placeholder="you@example.com"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#294c6b] to-[#1a3346] text-white px-6 py-3 rounded-lg hover:from-[#1a3346] hover:to-[#294c6b] transition-all duration-200 font-semibold flex items-center gap-2 hover:scale-105 transform shadow-lg"
                  >
                    <span>Generate Card</span>
                    <Rocket className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className={`bg-white/90 rounded-2xl shadow-2xl p-8 relative backdrop-blur-lg border border-white/50 transform transition-all duration-500 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center space-x-2">
                <span className="text-2xl">🎉🎉</span>
                <div className="bg-gradient-to-r from-[#294c6b] via-[#1a3346] to-[#294c6b] text-transparent bg-clip-text">
                  <h1 className="text-4xl font-bold mb-2">
                    Vrbo Journey to January Bingo
                  </h1>
                </div>
                <span className="text-2xl">🎉🎉</span>
              </div>
              <p className="text-gray-600 mt-1 italic text-lg">Relax, you're playing Vrbo bingo</p>
            </div>

            <div className="bg-gradient-to-br from-[#f8fafc] to-white p-8 rounded-xl mb-6 shadow-lg">
              <div className="grid grid-cols-5 gap-4 mb-4">
                {['B', 'I', 'N', 'G', 'O'].map((letter) => (
                  <div key={letter} className="flex items-center justify-center">
                    <span className="text-3xl font-bold bg-gradient-to-br from-[#294c6b] to-[#1a3346] text-transparent bg-clip-text">{letter}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-4">
                {bingoCard.map((item, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg
                      ${item === 'Vrbo' 
                        ? 'bg-gradient-to-br from-[#294c6b] to-[#1a3346] text-white font-bold shadow-lg transform hover:scale-105' 
                        : 'bg-white border-2 border-[#294c6b] hover:bg-blue-50'}
                      text-center transition-all duration-200 hover:shadow-lg
                    `}
                  >
                    <span className={`text-lg ${item === 'Vrbo' ? 'text-white' : 'text-[#294c6b]'}`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-gray-600 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-4 rounded-lg shadow-inner">
              <p className="font-medium">Your bingo card has been sent to {email}</p>
              <p className="mt-2 text-sm flex items-center justify-center gap-2">
                <span>🧳</span>
                Pack your bags and check your email for how to play! 
                <span>🏝️</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;