# Scheduling Platform (Cal.com Clone)

A full-stack scheduling and booking web application that replicates Cal.com's design and user experience. Users can create event types, set their availability, and allow others to book time slots through a public booking page.

## Tech Stack

### Frontend
- React.js (with Vite)
- React Router DOM (for routing)
- Tailwind CSS (for styling)
- Axios (for API calls)
- Moment.js with timezone support (for date/time handling)

### Backend
- Node.js with Express.js
- Prisma ORM (for database management)
- PostgreSQL (database)
- Nodemailer (for email notifications)
- CORS (for cross-origin requests)

## Features Implemented

### Core Features
1. **Event Types Management**
   - Create, edit, and delete event types
   - Configure title, description, duration, URL slug, color, and buffer time
   - Copy public booking links to clipboard
   - Add custom questions for bookings

2. **Availability Settings**
   - Set available days of the week
   - Define time slots for each day
   - Support for multiple time ranges per day
   - Timezone selection
   - Date overrides (block specific dates or set custom hours)

3. **Public Booking Page**
   - Calendar view for date selection
   - Display available time slots based on availability settings
   - Booking form with name, email, and notes
   - Custom questions support
   - Prevent double booking
   - Booking confirmation page with details

4. **Bookings Dashboard**
   - View upcoming and past bookings
   - Filter bookings by status
   - Cancel bookings
   - Reschedule bookings with calendar interface

### Bonus Features
- Responsive design for mobile, tablet, and desktop
- Date overrides for blocking dates or setting custom hours
- Rescheduling flow for existing bookings
- Email notifications on booking confirmation and cancellation
- Buffer time between meetings
- Custom booking questions with validation
- Color-coded event types for visual organization

## Database Schema

The application uses PostgreSQL with the following models:

### EventType
- Stores event type information (title, description, duration, slug, color, buffer time)
- Has relationships with Booking and CustomQuestion

### Availability
- Stores weekly availability schedule
- Defines available days and time ranges
- Supports timezone configuration

### DateOverride
- Allows blocking specific dates
- Enables custom hours for specific dates
- Overrides default availability settings

### Booking
- Stores all booking information
- Links to EventType
- Contains guest details and booking status
- Related to BookingAnswer for custom questions

### CustomQuestion
- Stores custom questions for event types
- Supports different question types (text, textarea, number)
- Configurable as required or optional

### BookingAnswer
- Stores answers to custom questions
- Links booking responses to questions

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)
- npm or yarn package manager
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sclar_assignment
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sclarDB;

# Exit PostgreSQL
\q
```

### 3. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following content:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/sclarDB"
PORT=5000
EMAIL_USER="your-gmail@gmail.com"
EMAIL_APP_PASSWORD="your-16-char-app-password"
OWNER_EMAIL="your-email@gmail.com"
```

Replace the following:
- `USERNAME`: Your PostgreSQL username
- `PASSWORD`: Your PostgreSQL password
- `your-gmail@gmail.com`: Gmail account for sending emails
- `your-16-char-app-password`: Gmail App Password (see Email Setup section)
- `your-email@gmail.com`: Email address to receive booking notifications

Run Prisma migrations to create database tables:

```bash
npx prisma migrate dev
```

Seed the database with sample data:

```bash
node prisma/seed.js
```

Start the backend server:

```bash
npm start
```

The backend server will run on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application will run on `http://localhost:5173`

## Email Setup (Gmail)

To enable email notifications, you need to generate a Gmail App Password:

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled
4. Go to Security > 2-Step Verification > App passwords
5. Select "Mail" as the app and "Other" as the device
6. Name it "Scheduling Platform"
7. Copy the generated 16-character password
8. Use this password in the `EMAIL_APP_PASSWORD` field in your `.env` file

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Access the application:
   - Admin Dashboard: `http://localhost:5173`
   - Public Booking Page: `http://localhost:5173/book/{event-slug}`

### Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
```

The production files will be generated in the `frontend/dist` directory.

## API Endpoints

### Event Types
- `GET /api/event-types` - Get all event types
- `GET /api/event-types/:slug` - Get event type by slug
- `POST /api/event-types` - Create new event type
- `PUT /api/event-types/:id` - Update event type
- `DELETE /api/event-types/:id` - Delete event type

### Availability
- `GET /api/availability` - Get all availability settings
- `POST /api/availability/bulk` - Bulk update availability

### Date Overrides
- `GET /api/date-overrides` - Get all date overrides
- `POST /api/date-overrides` - Create date override
- `DELETE /api/date-overrides/:id` - Delete date override

### Bookings
- `GET /api/bookings` - Get all bookings (supports query params: type, status)
- `GET /api/bookings/:id` - Get specific booking
- `GET /api/bookings/slots` - Get available time slots (requires: slug, date, timezone)
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `PATCH /api/bookings/:id/reschedule` - Reschedule booking

## Project Structure

```
sclar_assignment/
├── backend/
│   ├── config/
│   │   └── database.js          # Prisma client configuration
│   ├── controllers/
│   │   ├── availabilityController.js
│   │   ├── bookingController.js
│   │   ├── dateOverrideController.js
│   │   └── eventTypeController.js
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.js              # Database seeding script
│   │   └── migrations/          # Database migrations
│   ├── routes/
│   │   ├── availability.js
│   │   ├── bookings.js
│   │   ├── dateOverrides.js
│   │   └── eventTypes.js
│   ├── services/
│   │   └── emailService.js      # Email notification service
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express server entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── Availability.jsx
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── EventTypes.jsx
│   │   │   └── PublicBooking.jsx
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.css
│   │   ├── App.jsx              # Main app component with routing
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Sample Data

The database seed script creates:
- 2 sample event types (30 Min Interview, Quick Chat)
- Default availability (Monday to Friday, 9:00 AM - 5:00 PM)
- 2 sample bookings (1 upcoming, 1 past)
- 1 date override for demonstration

## User Flow

### Admin Side (No Login Required)

1. **Event Types Management**
   - Navigate to the Event Types page
   - Create new event types with custom settings
   - Add custom questions for bookings
   - Copy booking links to share

2. **Availability Settings**
   - Navigate to the Availability page
   - Set weekly schedule with time ranges
   - Add date overrides for holidays or special days
   - Select timezone

3. **Bookings Dashboard**
   - View upcoming and past bookings
   - Cancel bookings when needed
   - Reschedule bookings to new time slots

### Public Booking Side

1. Access the public booking link (shared by admin)
2. Select a date from the calendar
3. Choose an available time slot
4. Fill in name, email, notes, and custom questions
5. Confirm the booking
6. Receive confirmation email
7. View confirmation page with booking details

## Email Notifications

The application sends HTML-formatted email notifications for:

1. **Booking Confirmation** (to guest and owner)
   - Event details with color-coded design
   - Date, time, and duration information
   - Guest information
   - Additional notes if provided
   - Next steps for the guest

2. **Booking Cancellation** (to guest and owner)
   - Cancellation notice
   - Original booking details
   - Booking reference number

## Deployment Recommendations

### Backend Deployment
- **Recommended Platforms**: Railway, Render, Heroku
- Ensure PostgreSQL database is provisioned
- Set all environment variables in the platform
- Run Prisma migrations after deployment

### Frontend Deployment
- **Recommended Platforms**: Vercel, Netlify, Railway
- Build the production bundle before deployment
- Update API base URL to point to deployed backend
- Configure environment variables if needed

### Database Deployment
- **Recommended Services**: Railway PostgreSQL, Supabase, Neon
- Ensure connection string is properly configured
- Run migrations on production database
- Consider database backups

## Assumptions Made

1. **Single User System**: The application assumes a default user is logged in for the admin side. No authentication system is implemented as per requirements.

2. **UTC Timezone**: All bookings are stored in UTC timezone for consistency. The application uses moment-timezone for timezone conversions.

3. **Email Service**: Gmail SMTP is used for sending emails. For production, consider using dedicated email services like SendGrid or AWS SES.

4. **Business Hours**: Default availability is set to Monday-Friday, 9:00 AM - 5:00 PM. Users can customize this through the Availability page.

5. **Buffer Time**: Buffer time is applied after each booking to prevent back-to-back meetings.

6. **Date Overrides**: When a date override is set, it completely overrides the default availability for that specific date.

7. **Booking Validation**: The system prevents double booking by checking for existing bookings at the same time slot before confirmation.

8. **Custom Questions**: Event types can have unlimited custom questions. Questions can be marked as required or optional.

9. **Time Slots**: Available time slots are generated based on event duration and existing bookings.

10. **Responsive Design**: The UI is fully responsive and works on mobile, tablet, and desktop devices.

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists and credentials are correct

### Email Not Sending
- Verify Gmail App Password is correct
- Check if 2-Step Verification is enabled in Google Account
- Ensure EMAIL_USER and EMAIL_APP_PASSWORD are set correctly

### Port Already in Use
- Backend: Change PORT in .env file
- Frontend: Vite will automatically suggest another port

### Prisma Migration Errors
- Try resetting the database: `npx prisma migrate reset`
- Check database connection string
- Ensure PostgreSQL service is running

## Development Notes

### Code Quality
- Clean, modular code with separation of concerns
- RESTful API design with proper HTTP methods
- Error handling implemented throughout the application
- Input validation on both frontend and backend

### Performance Considerations
- Efficient database queries with Prisma ORM
- Proper indexing on frequently queried fields
- Optimized React rendering with proper state management
- Minimal bundle size with code splitting

### Security Features
- Input sanitization to prevent SQL injection
- CORS configured for cross-origin requests
- Environment variables for sensitive data
- Email validation on both client and server

## Future Enhancements

Potential improvements for the application:
- User authentication and multi-user support
- Integration with calendar services (Google Calendar, Outlook)
- Video conferencing integration (Zoom, Google Meet)
- Payment integration for paid bookings
- SMS notifications
- Recurring bookings
- Team scheduling
- Advanced analytics dashboard
- Multiple timezone support for guests
- iCal calendar file generation

## Support

For issues, questions, or contributions, please refer to the project repository or contact the development team.

## License

This project is created as part of an assignment for Sclar.

---

**Note**: This application is a demonstration project built for educational purposes. For production use, additional security measures, testing, and optimizations should be implemented.
