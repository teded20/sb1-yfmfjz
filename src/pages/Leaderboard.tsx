import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Trophy, Clock, DollarSign } from 'lucide-react';
import { db } from '../firebase';
import { Entry, Tournament } from '../types';
import { updateScoresIfNeeded } from '../utils/api';

function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const loadTournamentAndEntries = async () => {
      try {
        // Get active tournament
        const tournamentsRef = collection(db, 'tournaments');
        const tournamentQuery = query(
          tournamentsRef,
          where('status', 'in', ['upcoming', 'active'])
        );
        const tournamentSnapshot = await getDocs(tournamentQuery);
        
        if (tournamentSnapshot.empty) {
          setLoading(false);
          return;
        }

        const tournamentData = {
          id: tournamentSnapshot.docs[0].id,
          ...tournamentSnapshot.docs[0].data()
        } as Tournament;
        setTournament(tournamentData);

        // Update scores if tournament is active
        if (tournamentData.status === 'active') {
          await updateScoresIfNeeded(tournamentData.id);
        }

        // Get entries
        const entriesRef = collection(db, 'entries');
        const entriesQuery = query(
          entriesRef,
          where('tournamentId', '==', tournamentData.id),
          orderBy('totalScore', 'asc')
        );
        const entriesSnapshot = await getDocs(entriesQuery);
        
        const entriesData = entriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Entry[];

        setEntries(entriesData);
        setLastUpdate(new Date());
        setLoading(false);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        setLoading(false);
      }
    };

    loadTournamentAndEntries();
    const interval = setInterval(loadTournamentAndEntries, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">No Active Tournament</h2>
        <p className="text-gray-600 mt-2">Check back later for upcoming tournaments.</p>
      </div>
    );
  }

  const calculatePrize = (position: number) => {
    const entryCount = entries.length;
    const totalPot = entryCount * 25;
    const payoutPositions = Math.floor(entryCount / 25) + 2;
    
    if (position > payoutPositions) return 0;
    
    let prizeMoney = 0;
    if (position === 1) {
      prizeMoney = totalPot * 0.4;
    } else if (position === 2) {
      prizeMoney = totalPot * 0.2;
    } else {
      prizeMoney = (totalPot * 0.4) / (payoutPositions - 2);
    }
    
    return Math.floor(prizeMoney);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tournament.name}</h1>
            <p className="text-gray-600">
              Round {tournament.currentRound} • {entries.length} Entries • 
              ${entries.length * 25} Total Pot
            </p>
          </div>
          {lastUpdate && (
            <div className="text-sm text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Last updated: {format(lastUpdate, 'h:mm a')}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left">Pos</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Prize</th>
                <th className="px-4 py-3 text-center">Paid</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={`border-b border-gray-100 ${
                    index < Math.floor(entries.length / 25) + 2
                      ? 'bg-green-50'
                      : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    {index + 1}
                    {index === 0 && (
                      <Trophy className="w-4 h-4 text-yellow-500 inline ml-1" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{entry.userName}</td>
                  <td className="px-4 py-3 text-right">
                    {entry.totalScore || 'E'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {calculatePrize(index + 1) > 0 && (
                      <span className="text-green-600 font-medium">
                        ${calculatePrize(index + 1)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {entry.paid ? (
                      <DollarSign className="w-4 h-4 text-green-500 inline" />
                    ) : (
                      <span className="text-red-500">•</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Prize Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Total Prize Pool</h3>
            <p className="text-2xl text-green-600">${entries.length * 25}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Payout Positions</h3>
            <p className="text-2xl text-green-600">
              {Math.floor(entries.length / 25) + 2}
            </p>
          </div>
          {entries.length >= 100 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Daily Leader Prize</h3>
              <p className="text-2xl text-green-600">
                ${Math.floor(entries.length / 50) * 50}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;