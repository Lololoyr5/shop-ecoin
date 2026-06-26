import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { Home, Search, MessageCircle, User, Plus, Coins, Menu, X, Heart, Package, Shield, Bell, ShoppingBag, Gift, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        
        const profiles = await base44.entities.UserProfile.filter({ user_email: userData.email });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
        }

        // Check unread messages
                  const messages = await base44.entities.Message.filter({ receiver_email: userData.email, is_read: false });
                  setUnreadMessages(messages.length);

                  // Check unread notifications
                  const notifications = await base44.entities.Notification.filter({ user_email: userData.email, is_read: false });
                  setUnreadNotifications(notifications.length);
      } catch (e) {
        console.log('No user logged in');
      }
      setTimeout(() => setIsLoading(false), 1500);
    };
    loadUser();
  }, []);

  const navItems = [
        { name: 'Accueil', icon: Home, page: 'Home' },
        { name: 'Shorts', icon: Zap, page: 'Shorts' },
        { name: 'Explorer', icon: Search, page: 'Explore' },
        { name: 'Vendre', icon: Plus, page: 'Sell' },
        { name: 'Favoris', icon: Heart, page: 'Favorites' },
        { name: 'Messages', icon: MessageCircle, page: 'Messages', badge: unreadMessages },
        { name: 'Notifications', icon: Bell, page: 'Notifications', badge: unreadNotifications },
        { name: 'Ma Boutique', icon: ShoppingBag, page: 'MyShop' },
        { name: 'Promouvoir', icon: TrendingUp, page: 'PromoteProduct' },
        { name: 'Code Promo', icon: Gift, page: 'RedeemCode' },
        { name: 'Profil', icon: User, page: 'Profile' },
      ];

  const mobileNavItems = [
    { name: 'Accueil', icon: Home, page: 'Home' },
    { name: 'Shorts', icon: Zap, page: 'Shorts' },
    { name: 'Explorer', icon: Search, page: 'Explore' },
    { name: 'Messages', icon: MessageCircle, page: 'Messages', badge: unreadMessages },
    { name: 'Profil', icon: User, page: 'Profile' },
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --accent-primary: #000000;
          --accent-secondary: #1a1a1a;
          --gold-accent: #D4AF37;
        }
        
        .luxury-card {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          transition: all 0.2s ease;
        }
        
        .luxury-card:hover {
          border-color: #D4AF37;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .gold-text {
          color: #D4AF37;
        }
      `}</style>

      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <span className="text-2xl font-serif font-bold text-black tracking-tight">Shop-E</span>
          </Link>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all relative ${
                    currentPageName === item.page
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.name}</span>
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to={createPageUrl('Admin')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    currentPageName === 'Admin'
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium text-sm">Admin</span>

                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              {profile && (
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                  <Coins className="w-4 h-4 text-black" />
                  <span className="font-semibold text-black">{profile.ecoins_balance || 10}</span>
                  <span className="text-gray-500 text-sm">E-Coins</span>
                </div>
              )}
              {user ? (
                <Link to={createPageUrl('Profile')}>
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold text-sm">
                    {user.full_name?.[0] || user.email?.[0] || 'U'}
                  </div>
                </Link>
              ) : (
                <Button 
                  onClick={() => base44.auth.redirectToLogin()}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Connexion
                </Button>
              )}
            </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <span className="text-xl font-serif font-bold text-black">Shop-E</span>
          </Link>

          <div className="flex items-center gap-3">
            {profile && (
              <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                <Coins className="w-4 h-4 text-black" />
                <span className="font-semibold text-black text-sm">{profile.ecoins_balance || 10}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-black"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="border-t border-gray-200 bg-white">
              <nav className="p-4 grid grid-cols-3 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                      currentPageName === item.page
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-24 md:pt-28 pb-24 md:pb-8 min-h-screen">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex justify-around py-2 pb-4">
          {mobileNavItems.map((item) => (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all relative ${
                currentPageName === item.page
                  ? 'text-black'
                  : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <item.icon className={`w-5 h-5 ${item.page === 'Sell' ? 'bg-black p-1.5 rounded-full text-white w-9 h-9' : ''}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
