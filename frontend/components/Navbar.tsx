'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, authAPI } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold flex items-center">
              🌾 AgriServices
            </Link>
            {user && (
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md ${
                    pathname === '/dashboard' ? 'bg-green-600' : 'hover:bg-green-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/farmers"
                  className={`px-3 py-2 rounded-md ${
                    pathname.startsWith('/farmers') ? 'bg-green-600' : 'hover:bg-green-600'
                  }`}
                >
                  Farmers
                </Link>
                <Link
                  href="/predictions"
                  className={`px-3 py-2 rounded-md ${
                    pathname === '/predictions' ? 'bg-green-600' : 'hover:bg-green-600'
                  }`}
                >
                  Predictions
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">👤 {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:bg-green-600 px-4 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
