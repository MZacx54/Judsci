import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ImpactCounters from './components/ImpactCounters';
import ProgramGrid from './components/ProgramGrid';
import BookingSystem from './components/BookingSystem';
import ResourceLibrary from './components/ResourceLibrary';
import DonorHub from './components/DonorHub';
import NewsSection from './components/NewsSection';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import BauchiMap from './components/BauchiMap';
import AboutSection from './components/AboutSection';
import SuccessStories from './components/SuccessStories';
import StoryDetail from './components/StoryDetail';
import PartnersList from './components/PartnersList';
import { AppSection, BlogPost } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [selectedStory, setSelectedStory] = useState<BlogPost | null>(null);
  const { isAuthenticated } = useAuth();

  const navigate = (section: AppSection) => {
    setActiveSection(section);
    const path = section === AppSection.HOME ? '/' : `/${section}`;
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '');
      if (path === '' || path === 'home') {
        setActiveSection(AppSection.HOME);
      } else if (Object.values(AppSection).includes(path as AppSection)) {
        setActiveSection(path as AppSection);
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleReadStory = (post: BlogPost) => {
    setSelectedStory(post);
    setActiveSection(AppSection.NEWS_DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeSection as any) {
      case AppSection.HOME:
        return (
          <main>
            <Hero
              onDonate={() => setActiveSection(AppSection.DONATIONS)}
              onExplore={() => {
                const el = document.getElementById('impact-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <div id="impact-section">
              <ImpactCounters />
            </div>
            <BauchiMap />
            <ProgramGrid onSelect={() => navigate(AppSection.PROGRAMS)} onReadStory={handleReadStory} />
            <SuccessStories />
            <PartnersList onInquire={() => navigate(AppSection.BOOKINGS)} />
            <NewsSection onReadStory={handleReadStory} onSeeAll={() => navigate(AppSection.NEWS)} />
          </main>
        );
      case AppSection.PROGRAMS:
        return <ProgramGrid fullView={true} onReadStory={handleReadStory} />;
      case AppSection.BOOKINGS:
        return <BookingSystem />;
      case AppSection.RESOURCES:
        return <ResourceLibrary />;
      case AppSection.DONATIONS:
        return <DonorHub />;
      case AppSection.NEWS:
        return <NewsSection fullView={true} onReadStory={handleReadStory} />;
      case AppSection.NEWS_DETAIL:
        return selectedStory ? (
          <StoryDetail
            post={selectedStory}
            onBack={() => setActiveSection(AppSection.NEWS)}
          />
        ) : (
          <NewsSection fullView={true} onReadStory={handleReadStory} />
        );
      case AppSection.ABOUT:
        return <AboutSection />;
      default:
        return <Hero onAction={() => setActiveSection(AppSection.DONATIONS)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        activeSection={activeSection}
        onNavigate={(section) => navigate(section)}
      />
      <div className="flex-grow pt-16">
        {renderContent()}
      </div>
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-green-500 mb-4">JUDSCI Bauchi</h3>
            <p className="text-gray-400 max-w-sm">
              Justice Development and Social Cohesion Initiative (JUDSCI) Bauchi (also known as JDPC Bauchi). Promoting justice, development, and peace in the <strong>Bauchi Diocese</strong> (Bauchi and Gombe States).
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setActiveSection(AppSection.PROGRAMS)}>Our Programs</button></li>
              <li><button onClick={() => setActiveSection(AppSection.RESOURCES)}>Library</button></li>
              <li><button onClick={() => setActiveSection(AppSection.DONATIONS)}>Donor Hub</button></li>
              <li><button onClick={() => setActiveSection(AppSection.BOOKINGS)}>Consultations</button></li>
              <li><a href="https://judsci.org.ng/admin/" className="hover:text-green-500 transition-colors">Admin Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>St. John’s Catholic Cathedral,<br />P.O. Box 17, Bauchi.</li>
              <li><a href="mailto:support@judsci.org.ng" className="hover:text-green-500 transition-colors">support@judsci.org.ng</a></li>
              <li><a href="tel:+2348138293928" className="hover:text-green-500 transition-colors">+234 813 829 3928</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} JUDSCI Bauchi. All Rights Reserved.
          <div className="mt-2 text-xs text-gray-600">
            Designed and Developed by <a href="https://g.co/kgs/jJdzmHp" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors">Zacx Digital Agency</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
