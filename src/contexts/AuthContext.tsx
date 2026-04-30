import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, email: string | null) => {
    try {
      console.log(`[AUTH] Fetching profile for: ${uid}`);
      const docRef = doc(db, 'profiles', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('[AUTH] Profile found');
        setProfile(docSnap.data());
      } else {
        console.log('[AUTH] Profile NOT found, creating initial profile...');
        const newProfile = {
          uid,
          email,
          onboardingCompleted: false,
          createdAt: new Date().toISOString(),
          vehicleType: 'proprio'
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
        console.log('[AUTH] Initial profile created');
      }
    } catch (error) {
      console.error('[AUTH] Error loading profile:', error);
    }
  };

  useEffect(() => {
    console.log('[AUTH] Initializing auth listener');
    
    // Defensive timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('[AUTH] Loading timeout reached (8s). Forcing loading = false');
        setLoading(false);
      }
    }, 8000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log(`[AUTH] State changed: ${currentUser ? 'User Logged In (' + currentUser.uid + ')' : 'User Logged Out'}`);
      setUser(currentUser);
      
      try {
        if (currentUser) {
          await fetchProfile(currentUser.uid, currentUser.email);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('[AUTH] Critical error in auth state callback:', error);
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
        console.log('[AUTH] Loading set to false');
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid, user.email);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
