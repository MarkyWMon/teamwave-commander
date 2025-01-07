import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import type { Team } from '@/types/team';

const TEAMS_COLLECTION = 'teams';

export const createTeam = async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firebase not initialized');

  const now = Timestamp.now();
  const teamWithDates = {
    ...teamData,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, TEAMS_COLLECTION), teamWithDates);
  return { id: docRef.id, ...teamWithDates };
};

export const getTeams = async (isOpponent: boolean = false) => {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firebase not initialized');

  const q = query(
    collection(db, TEAMS_COLLECTION),
    where('isOpponent', '==', isOpponent)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Team[];
};

export const updateTeam = async (id: string, teamData: Partial<Omit<Team, 'id' | 'createdAt'>>) => {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firebase not initialized');

  const updateData = {
    ...teamData,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(doc(db, TEAMS_COLLECTION, id), updateData);
};

export const deleteTeam = async (id: string) => {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firebase not initialized');

  await deleteDoc(doc(db, TEAMS_COLLECTION, id));
};