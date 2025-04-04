"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AppUser, UserRole } from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Hook to check if user is admin and handle redirection
export function useAdminAuth() {
  const { user, loading, error } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== UserRole.ADMIN) {
        router.push('/admin/unauthorized');
      }
    }
  }, [user, loading, router]);

  return { 
    user: user?.role === UserRole.ADMIN ? user : null,
    loading,
    error
  };
}

// Check if a user is already logged in from session
export function useAuthState() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          setLoading(true);
          if (firebaseUser) {
            const userData = await getUserData(firebaseUser.uid);
            if (userData) {
              setUser(userData);
              await updateDoc(doc(db, 'users', firebaseUser.uid), {
                lastLogin: serverTimestamp()
              });
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
          setUser(null);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { user, loading, error };
}

// React hook to protect routes that require authentication
export function useRequireAuth(requiredRole?: UserRole) {
  const { user, loading } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    } else if (!loading && user && requiredRole && user.role !== requiredRole) {
      router.push('/admin');
    }
  }, [user, loading, router, requiredRole]);

  return { user, loading };
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<{ success: boolean; message?: string; user?: AppUser }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userData = await getUserData(firebaseUser.uid);
    if (!userData) {
      return {
        success: false,
        message: 'User account data is missing. Please contact an administrator.'
      };
    }

    if (!userData.isActive) {
      await firebaseSignOut(auth);
      return {
        success: false,
        message: 'Your account is deactivated. Please contact an administrator.'
      };
    }

    return {
      success: true,
      user: userData
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
    return {
      success: false,
      message: errorMessage
    };
  }
}

// Sign out
export async function signOut(): Promise<boolean> {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
}

// Get user data from Firestore
export async function getUserData(uid: string): Promise<AppUser | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        id: uid,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
        lastLogin: data.lastLogin instanceof Timestamp
          ? data.lastLogin.toDate().toISOString()
          : data.lastLogin
      } as AppUser;
    }

    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

// Create a new user (Admin function)
export async function createUser(
  email: string,
  password: string,
  displayName: string,
  role: UserRole = UserRole.VIEWER
): Promise<{ success: boolean; message?: string; userId?: string }> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: 'A user with this email already exists'
      };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const newUser: Omit<AppUser, 'id'> = {
      email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...newUser,
      createdAt: serverTimestamp()
    });

    return {
      success: true,
      userId: firebaseUser.uid
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error creating user';
    return {
      success: false,
      message: errorMessage
    };
  }
}

// Update a user's role or status (Admin function)
export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  isActive?: boolean
): Promise<boolean> {
  try {
    const updateData: any = { role: newRole };
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    await updateDoc(doc(db, 'users', userId), updateData);
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}

// Get all users (Admin function)
export async function getAllUsers(): Promise<AppUser[]> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);

    const users: AppUser[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
        lastLogin: data.lastLogin instanceof Timestamp
          ? data.lastLogin.toDate().toISOString()
          : data.lastLogin
      } as AppUser);
    });

    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}