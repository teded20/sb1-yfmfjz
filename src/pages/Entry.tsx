import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import GolferSelect from '../components/GolferSelect';
import { Golfer, Tournament } from '../types';
import { DollarSign } from 'lucide-react';

function Entry() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [topGolfers, setTopGolfers] = useState<Golfer[]>([]);
  const [outsideGolfers, setOutsideGolfers] = useState<Golfer[]>([]);
  const [selectedTop, setSelectedTop] = useState<string[]>([]);
  const [selectedOutside, setSelectedOutside] = useState<string[]>([]);
  const [birdieTiebreaker, setBirdieTiebreaker] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadTournamentAndGolfers = async () => {
      try {
        // Get active tournament
        const tournamentsRef = collection(db, 'tournaments');
        const q = query(
          tournamentsRef,
          where('status', '==', 'upcoming')
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          toast.error('No active tournament found');
          navigate('/');
          return;
        }

        const tournamentData = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        } as Tournament;
        setTournament(tournamentData);

        // Get golfers
        const golfersRef = collection(db, 'golfers');
        const golfersSnapshot = await getDocs(golfersRef);
        const allGolfers = golfersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Golfer[];

        setTopGolfers(allGolfers.filter(g => g.rank <= 20));
        setOutsideGolfers(allGolfers.filter(g => g.rank > 20));
        setLoading(false);
      } catch (error) {
        console.error('Error loading tournament data:', error);
        toast.error('Failed to load tournament data');
      }
    };

    loadTournamentAndGolfers();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to submit an entry');
      return;
    }

    if (selectedTop.length !== 3 || selectedOutside.length !== 3) {
      toast.error('Please select all required golfers');
      return;
    }

    setSubmitting(true);
    try {
      const entry = {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        email: user.email,
        topGolfers: selectedTop,
        outsideGolfers: selectedOutside,
        birdieTiebreaker,
        timestamp: Date.now(),
        paid: false,
        tournamentId: tournament?.id
      };

      await addDoc(collection(db, 'entries'), entry);
      setSubmitted(true);
      toast.success('Entry submitted successfully!');
    } catch (error) {
      console.error('Error submitting entry:', error);
      toast.error('Failed to submit entry');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 text-center">
        <div className="mb-6">
          <DollarSign className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold mt-4 mb-2">Entry Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Please complete your entry by sending $25 via Venmo to:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="font-semibold text-lg">@Tyler-Edwards</p>
          </div>
          <div className="flex justify-center mb-6">
            <QRCodeSVG
              value="https://venmo.com/Tyler-Edwards"
              size={200}
              className="border-4 border-white shadow-lg rounded-lg"
            />
          </div>
          <button
            onClick={() => navigate('/leaderboard')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Enter Tournament Pool</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <GolferSelect
            golfers={topGolfers}
            selectedGolfers={selectedTop}
            onChange={setSelectedTop}
            max={3}
            label="Select 3 golfers from Top 20"
            disabled={submitting}
          />

          <GolferSelect
            golfers={outsideGolfers}
            selectedGolfers={selectedOutside}
            onChange={setSelectedOutside}
            max={3}
            label="Select 3 golfers outside Top 20"
            disabled={submitting}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiebreaker: Tournament Winner's Total Birdies
            </label>
            <input
              type="number"
              min="0"
              value={birdieTiebreaker}
              onChange={(e) => setBirdieTiebreaker(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold ${
              submitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-green-700 transition-colors'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Entry;