
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
import BauchiMap from './components/BauchiMap';
import AboutSection from './components/AboutSection';
import SuccessStories from './components/SuccessStories';
import StoryDetail from './components/StoryDetail';
import PartnersList from './components/PartnersList';
import { AppSection, BlogPost } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [selectedStory, setSelectedStory] = useState<BlogPost | null>(null);

  React.useEffect(() => {
    const handleHashChange = () => {
      // Check for path based admin access first (Vercel fallback)
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = 'https://judsci-production-b036.up.railway.app' + window.location.pathname;
        return;
      }

      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setActiveSection(AppSection.ADMIN);
      } else if (Object.values(AppSection).includes(hash as AppSection)) {
        setActiveSection(hash as AppSection);
      }
    };

    // Check initial hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleReadStory = (post: BlogPost) => {
    setSelectedStory(post);
    setActiveSection(AppSection.NEWS_DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeSection) {
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
            <ProgramGrid onSelect={() => setActiveSection(AppSection.PROGRAMS)} onReadStory={handleReadStory} />
            <SuccessStories />
            <PartnersList onInquire={() => setActiveSection(AppSection.BOOKINGS)} />
            <NewsSection onReadStory={handleReadStory} onSeeAll={() => setActiveSection(AppSection.NEWS)} />
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
      case AppSection.ADMIN:
        return <AdminDashboard />;
      default:
        return <Hero onAction={() => setActiveSection(AppSection.DONATIONS)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        activeSection={activeSection}
        onNavigate={(section) => setActiveSection(section)}
      />
      <div className="flex-grow pt-16">
        {renderContent()}
      </div>
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-green-500 mb-4">JDPC Bauchi</h3>
            <p className="text-gray-400 max-w-sm">
              Promoting Justice, Development, and Peace in Bauchi State through sustainable community interventions and advocacy.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setActiveSection(AppSection.PROGRAMS)}>Our Programs</button></li>
              <li><button onClick={() => setActiveSection(AppSection.RESOURCES)}>Library</button></li>
              <li><button onClick={() => setActiveSection(AppSection.DONATIONS)}>Donor Hub</button></li>
              <li><button onClick={() => setActiveSection(AppSection.BOOKINGS)}>Legal Aid</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>St. John’s Catholic Cathedral,<br />P.O. Box 17, Bauchi.</li>
              <li><a href="mailto:judscib@gmail.com" className="hover:text-green-500 transition-colors">judscib@gmail.com</a></li>
              <li><a href="tel:+2348138293928" className="hover:text-green-500 transition-colors">+234 813 829 3928</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} JDPC Bauchi. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
