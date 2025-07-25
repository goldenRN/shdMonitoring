// // components/ProtectedRoute.tsx
// 'use client';

// import { useAuth } from '@/app/context/AuthContext';
// // import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) {
//       router.push('/auth');
//     }
//   }, [user, router]);

//   if (!user) {
//     return null; // эсвэл loading spinner
//   }

//   return <>{children}</>;
// };

'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth');
      } else if (user.role !== 'admin') {
        router.push('/not-authorized'); // эсвэл login page
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return null; // Эсвэл <Spinner />
  }

  return <>{children}</>;
};
