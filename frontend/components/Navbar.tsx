'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, authAPI } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Tableau de bord', icon: '📊' },
    { href: '/farmers', label: 'Agriculteurs', icon: '👨‍🌾' },
    { href: '/crops', label: 'Cultures', icon: '🌱' },
    { href: '/predictions', label: 'Prédictions', icon: '📈' },
    { href: '/billing', label: 'Facturation', icon: '💰' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🌾</span>
            <span className="text-xl font-bold tracking-tight">AgriServices</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    flex items-center gap-2
                    ${isActive(link.href) 
                      ? 'bg-white/20 text-white shadow-inner' 
                      : 'hover:bg-white/10 text-white/90 hover:text-white'}
                  `}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center px-3 py-1.5 bg-white/10 rounded-full">
                  <span className="text-lg mr-2">👤</span>
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/90 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-50 transition-all shadow-md"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition-all
                    flex items-center gap-3
                    ${isActive(link.href) 
                      ? 'bg-white/20 text-white' 
                      : 'hover:bg-white/10 text-white/90'}
                  `}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
