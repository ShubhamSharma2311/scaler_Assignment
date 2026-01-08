import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import EventTypes from './pages/EventTypes';
// import Bookings from './pages/Bookings';
// import Availability from './pages/Availability';
// import PublicBooking from './pages/PublicBooking';
// import BookingConfirmation from './pages/BookingConfirmation';

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
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-xl font-bold">Scheduling Platform</h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/"
            className={`flex items-center px-6 py-3 ${location.pathname === '/' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <span>Event Types</span>
          </Link>
          <Link
            to="/bookings"
            className={`flex items-center px-6 py-3 ${location.pathname === '/bookings' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <span>Bookings</span>
          </Link>
          <Link
            to="/availability"
            className={`flex items-center px-6 py-3 ${location.pathname === '/availability' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <span>Availability</span>
          </Link>
        </nav>
      </aside>
      
      <main className="flex-1">
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
