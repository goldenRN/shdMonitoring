// components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/app/context/AuthContext';
// import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) {
    return null; // эсвэл loading spinner
  }

  return <>{children}</>;
};

// 'use client';

// import { useAuth } from '@/app/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/auth');
//     }
//   }, [user, loading, router]);

//   if (loading) return <p>Түр хүлээнэ үү...</p>;

//   return <>{children}</>;
// };
