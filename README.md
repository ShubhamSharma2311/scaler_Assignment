# CalScheduler - Modern Calendar Booking System

A modern, full-stack calendar scheduling application inspired by Cal.com. Built with React, Node.js, and PostgreSQL, this system allows users to create event types, manage availability, accept bookings through public links, and provides comprehensive booking management tools.

## Live Demo

**Application:** [Your Deployment Link Here]

**Note:** The backend is deployed on a free tier service, which may experience cold starts. If the application seems slow initially, please wait 30-60 seconds for the backend services to spin up.

## Demo Credentials (For Testing)

**Admin/User Access:**
- Email: `demo@example.com`
- Password: `demo123`

**Features to Test:**
- Create event types at `/event-types`
- Set availability at `/availability`
- View bookings at `/bookings`
- Test public booking at `/book/[event-slug]`

## API Documentation

**API Documentation:** Complete API documentation with interactive examples

The full API documentation is available after starting the server:

**View API Docs:** `http://localhost:3000/api-docs`

**Note:** Make sure your server is running locally at `http://localhost:3000`.

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Moment.js** with timezone - Date/time handling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Primary database
- **Nodemailer** - Email notifications
- **CORS** - Cross-origin resource sharing

## Project Structure

```
scaler_assignment/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Modal.jsx
│   │   │   ├── Calendar.jsx
│   │   │   └── TimeSlotPicker.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── EventTypes.jsx
│   │   │   ├── Availability.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── PublicBooking.jsx
│   │   │   └── BookingConfirmation.jsx
│   │   ├── services/        # API service functions
│   │   │   └── api.js
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── config/
│   │   └── database.js      # Database configuration
│   ├── controllers/         # Request handlers
│   │   ├── availabilityController.js
│   │   ├── bookingController.js
│   │   ├── dateOverrideController.js
│   │   └── eventTypeController.js
│   ├── routes/              # API routes
│   │   ├── availability.js
│   │   ├── bookings.js
│   │   ├── dateOverrides.js
│   │   └── eventTypes.js
│   ├── services/            # Business logic
│   │   └── emailService.js
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── seed.js          # Database seeding
│   │   └── migrations/      # Database migrations
│   ├── server.js            # Main server file
│   └── package.json
└── README.md
```

## Database Schema

The application uses PostgreSQL with Prisma ORM. The database consists of the following main entities:

### Core Entities

**EventType** - Event configuration and metadata
- `id`, `title`, `description`, `duration`, `slug`, `color`, `bufferTime`
- Custom questions support

**Availability** - User's weekly schedule
- `id`, `userId`, `dayOfWeek`, `startTime`, `endTime`, `timezone`
- Multiple time slots per day

**DateOverride** - Exceptions to regular availability
- `id`, `date`, `isBlocked`, `startTime`, `endTime`
- Block specific dates or set custom hours

**Booking** - User reservations
- `id`, `eventTypeId`, `name`, `email`, `date`, `startTime`, `endTime`
- Status tracking and notes

### Key Relationships

- EventTypes can have multiple Bookings
- Availability rules apply to EventTypes
- DateOverrides modify Availability
- Bookings reference EventTypes
- Each Booking has a unique time slot

## Local Development Setup

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (version 12 or higher)

### Step 1: Clone the Repository

```bash
git clone https://github.com/ShubhamSharma2311/scaler_Assignment.git
cd scaler_assignment
```

### Step 2: Backend Setup

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**

```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`:**

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/calscheduler_db"

# Server Configuration
PORT=3000

# Email Configuration (Optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Application URL
CLIENT_URL="http://localhost:5173"
```

5. **Run database migrations:**

```bash
npx prisma migrate dev
```

6. **Generate Prisma client:**

```bash
npx prisma generate
```

7. **Seed the database (optional):**

```bash
npm run seed
```

8. **Start the backend server:**

```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**

```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`:**

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

5. **Start the development server:**

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

### Step 4: Verify Installation

1. Open your browser and go to `http://localhost:5173`
2. You should see the calendar booking application
3. Navigate through the sidebar to test different features

## Key Features

### User Features

- **Event Types Management** - Create and configure custom event types with durations, colors, and buffer times
- **Availability Settings** - Set weekly availability with multiple time slots per day
- **Timezone Support** - Full timezone support for international scheduling
- **Date Overrides** - Block specific dates or set custom availability for exceptions
- **Public Booking Pages** - Share booking links with customizable URLs
- **Interactive Calendar** - Real-time date and time slot selection
- **Booking Confirmation** - Instant confirmation with email notifications
- **Booking Management** - View, reschedule, and cancel bookings
- **Custom Questions** - Add custom questions to booking forms
- **Dark Theme UI** - Modern dark theme inspired by Cal.com
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### Core Functionalities

- **Smart Scheduling** - Prevents double bookings and respects buffer times
- **Real-time Availability** - Dynamic slot calculation based on availability rules
- **Email Notifications** - Automated booking confirmations and reminders
- **Copy Booking Links** - One-click copy of public booking URLs
- **Calendar Views** - Month view calendar with date selection
- **Time Slot Display** - 12h/24h format support with visual indicators
- **Form Validation** - Client and server-side validation

## Authentication

The application currently operates without authentication, making it ideal for single-user or demo purposes. For production use, consider implementing:

- User registration and login
- JWT-based authentication
- Role-based access control
- Multi-user support with user-specific data

## UI/UX Features

- **Dark Theme** - Modern dark color scheme (black, zinc-900, zinc-800)
- **Reusable Components** - Modal, Calendar, and TimeSlotPicker components
- **Smooth Animations** - Transition effects and hover states
- **Accessibility** - Keyboard navigation and screen reader support
- **Loading States** - Visual feedback during API calls
- **Error Handling** - User-friendly error messages

## Email Notifications

The application sends email notifications for:
- New booking confirmations
- Booking cancellations
- Booking rescheduling
- Reminder emails (configurable)

Configure SMTP settings in the backend `.env` file to enable email functionality.

## Deployment

### Backend Deployment (Railway/Render)

1. Push your code to GitHub
2. Connect your repository to Railway/Render
3. Set environment variables
4. Deploy the backend service

### Frontend Deployment (Vercel/Netlify)

1. Push your code to GitHub
2. Connect your repository to Vercel/Netlify
3. Set `VITE_API_BASE_URL` to your backend URL
4. Deploy the frontend application

## Testing

To test the application:

1. **Create an Event Type:**
   - Navigate to `/event-types`
   - Click "New" and fill in the details
   - Copy the booking link

2. **Set Availability:**
   - Go to `/availability`
   - Enable days and set time slots
   - Add date overrides if needed

3. **Test Public Booking:**
   - Open the booking link in a new tab
   - Select a date and time slot
   - Fill in the booking form
   - Confirm the booking

4. **Manage Bookings:**
   - View bookings at `/bookings`
   - Test reschedule functionality
   - Test cancel functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## Developer

Built by **Shubham Sharma**

## Support

For support, email shubhamsharma@example.com or open an issue in the repository.

---

**Last updated:** January 2026

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
