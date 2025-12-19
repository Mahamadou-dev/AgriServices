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
    <nav className="bg-gradient-to-r from-emerald-800 via-green-800 to-teal-800 text-white shadow-lg sticky top-0 z-50 border-b border-emerald-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-4xl group-hover:scale-110 transition-transform">🌾</span>
            <span className="text-2xl font-extrabold tracking-tight drop-shadow-sm">AgriServices</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200
                    flex items-center gap-2
                    ${isActive(link.href)
                      ? 'bg-white/15 text-white shadow-inner border border-white/10'
                      : 'hover:bg-white/10 text-white/90 hover:text-white'}
                  `}
                >
                  <span className="text-lg xl:text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2 xl:gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center px-4 py-2 bg-white/10 rounded-full border border-white/10">
                  <span className="text-lg mr-2">👤</span>
                  <span className="text-base font-semibold tracking-tight">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 px-5 py-2.5 rounded-xl text-base font-semibold transition-all hover:shadow-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-xl text-base font-semibold hover:bg-white/10 transition-all border border-white/10"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-emerald-800 px-5 py-2 rounded-xl text-base font-bold hover:bg-emerald-50 transition-all shadow-md border border-emerald-100"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-white/10 border border-white/10"
                aria-label="Ouvrir le menu mobile"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-5 py-3 rounded-xl font-semibold transition-all
                    flex items-center gap-3
                    ${isActive(link.href)
                      ? 'bg-white/15 text-white border border-white/10'
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
