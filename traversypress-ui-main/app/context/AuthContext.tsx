// app/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // cookie эсвэл localStorage-оос хэрэглэгчийг шалгах
  //   const savedUser = localStorage.getItem('user');
  //   if (savedUser) setUser(JSON.parse(savedUser));
  // }, []);
  

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   // нэмэлт мэдээллүүд...
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (token: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   login: () => {},
//   logout: () => {},
// });

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token'); // эсвэл cookie-оос ав
//     if (token) {
//       // backend-ээс хэрэглэгчийн мэдээлэл авах
//       fetch('https://your-api.com/api/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//         .then(res => res.json())
//         .then(data => {
//           setUser(data.user);
//           setLoading(false);
//         })
//         .catch(() => {
//           setUser(null);
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = (token: string) => {
//     localStorage.setItem('token', token);
//     // Дахин fetch хийж хэрэглэгч авна
//     fetch('https://your-api.com/api/me', {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(res => res.json())
//       .then(data => {
//         setUser(data.user);
//       });
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     router.push('/auth');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
