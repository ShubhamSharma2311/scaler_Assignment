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
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
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
        w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-lg sm:text-xl font-bold">Scheduling Platform</h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-6 py-3 ${location.pathname === '/' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <span>Event Types</span>
          </Link>
          <Link
            to="/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-6 py-3 ${location.pathname === '/bookings' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <span>Bookings</span>
          </Link>
          <Link
            to="/availability"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-6 py-3 ${location.pathname === '/availability' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
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
