import React from 'react';
import { Link } from 'react-router-dom';
import { Golf, Trophy, Clock, DollarSign } from 'lucide-react';

function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to Golf Pool Pro
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join the most exciting major golf tournament pools. Pick your players,
          track live scores, and compete for prizes in our professional pool
          management system.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-md p-6 transform transition duration-300 hover:scale-105">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
            <Golf className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Pick Your Players</h3>
          <p className="text-gray-600">
            Select 3 players from the top 20 favorites and 3 players from outside
            the top 20.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transform transition duration-300 hover:scale-105">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <Trophy className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Live Leaderboard</h3>
          <p className="text-gray-600">
            Track your position in real-time with our live updating leaderboard
            system.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transform transition duration-300 hover:scale-105">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Daily Updates</h3>
          <p className="text-gray-600">
            Get daily leader updates and tournament summaries straight to your
            inbox.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transform transition duration-300 hover:scale-105">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
            <DollarSign className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Win Prizes</h3>
          <p className="text-gray-600">
            Compete for prize pools that grow with more participants. Daily prizes
            available!
          </p>
        </div>
      </div>

      <div className="text-center space-y-6">
        <Link
          to="/entry"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transform transition duration-300 hover:bg-green-700 hover:scale-105"
        >
          Enter This Week's Pool
        </Link>
        
        <p className="text-gray-600">
          Entry deadline: Thursday at midnight Central Time
        </p>
      </div>

      <div className="mt-16 bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold">1</span>
            </div>
            <div>
              <h3 className="font-semibold">Sign Up and Pick Players</h3>
              <p className="text-gray-600">
                Create an account, pick your players, and submit your entry before
                the Thursday deadline.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold">2</span>
            </div>
            <div>
              <h3 className="font-semibold">Pay Entry Fee</h3>
              <p className="text-gray-600">
                Submit your $25 entry fee via Venmo to secure your spot in the
                pool.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold">3</span>
            </div>
            <div>
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-gray-600">
                Follow your picks' performance on our live leaderboard throughout
                the tournament.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold">4</span>
            </div>
            <div>
              <h3 className="font-semibold">Win Prizes</h3>
              <p className="text-gray-600">
                Top finishers win cash prizes, with additional daily leader prizes
                for larger pools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;