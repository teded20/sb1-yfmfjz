import { collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Tournament, Golfer } from '../types';

const RAPID_API_KEY = 'ec34e27eb0mshc4a776c20e717bfp127602jsn97ffbe5d0d3a';
const RAPID_API_HOST = 'golf-leaderboard-data.p.rapidapi.com';

export async function updateTournamentScores(tournamentId: string) {
  try {
    const tournament = await getTournament(tournamentId);
    if (!tournament) return;

    const response = await fetch(
      'https://golf-leaderboard-data.p.rapidapi.com/leaderboard/662',
      {
        headers: {
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': RAPID_API_HOST
        }
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch tournament data');
    
    const data = await response.json();
    
    // Update golfer scores in Firestore
    const golfersRef = collection(db, 'golfers');
    const updates = data.results.leaderboard.map(async (player: any) => {
      const q = query(golfersRef, where('name', '==', player.player_name));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const golferDoc = snapshot.docs[0];
        return updateDoc(doc(db, 'golfers', golferDoc.id), {
          score: player.total_to_par,
          thru: player.thru,
          today: player.today_to_par,
          total: player.total_strokes,
          position: player.position
        });
      }
    });

    await Promise.all(updates.filter(Boolean));

    // Update tournament info
    const tournamentRef = doc(db, 'tournaments', tournamentId);
    await updateDoc(tournamentRef, {
      currentRound: data.results.round,
      lastUpdate: Date.now(),
    });

  } catch (error) {
    console.error('Error updating tournament scores:', error);
    throw error;
  }
}

async function getTournament(id: string): Promise<Tournament | null> {
  try {
    const tournamentRef = doc(db, 'tournaments', id);
    const snapshot = await getDocs(query(collection(db, 'tournaments'), where('id', '==', id)));
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Tournament;
  } catch (error) {
    console.error('Error getting tournament:', error);
    return null;
  }
}

// Rate limit the API calls
let lastUpdate = 0;
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

export async function updateScoresIfNeeded(tournamentId: string) {
  const now = Date.now();
  if (now - lastUpdate >= UPDATE_INTERVAL) {
    await updateTournamentScores(tournamentId);
    lastUpdate = now;
  }
}