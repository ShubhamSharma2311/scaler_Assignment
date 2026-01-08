import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import EventTypes from './pages/EventTypes';
import Bookings from './pages/Bookings';
import Availability from './pages/Availability';
import PublicBooking from './pages/PublicBooking';
import BookingConfirmation from './pages/BookingConfirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/book/:slug" element={<PublicBooking />} />
        <Route path="/confirmation/:id" element={<BookingConfirmation />} />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

function Dashboard() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-black">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-800 text-white rounded-md"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-zinc-900 border-r border-zinc-800 text-white transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-lg sm:text-xl font-semibold">Cal Clone</h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-6 py-3 transition-colors ${
              location.pathname === '/' 
                ? 'bg-zinc-800 text-white border-l-2 border-white' 
                : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Event Types</span>
          </Link>
          <Link
            to="/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-6 py-3 transition-colors ${
              location.pathname === '/bookings' 
                ? 'bg-zinc-800 text-white border-l-2 border-white' 
                : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Bookings</span>
          </Link>
          <Link
            to="/availability"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-6 py-3 transition-colors ${
              location.pathname === '/availability' 
                ? 'bg-zinc-800 text-white border-l-2 border-white' 
                : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Availability</span>
          </Link>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-1 w-full lg:w-auto">
        <Routes>
          <Route path="/" element={<EventTypes />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/availability" element={<Availability />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
