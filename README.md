# CalScheduler - Modern Calendar Booking System

A modern, full-stack calendar scheduling application inspired by Cal.com. Built with React, Node.js, and PostgreSQL, this system allows users to create event types, manage availability, accept bookings through public links, and provides comprehensive booking management tools.

## Live Demo

**Application:** [scaler-assignment-eta.vercel.app]

**Note:** The backend is deployed on a free tier service, which may experience cold starts. If the application seems slow initially, please wait 30-60 seconds for the backend services to spin up.

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

3. **Create a `.env` file in the backend directory:**

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/scheduling_platform?schema=public"

# Server Configuration
PORT=5000
```

Replace `your_password` with your PostgreSQL password.

4. **Run database migrations:**

```bash
npx prisma migrate dev
```

6. **Generate Prisma client:**

```bash
npx prisma generate
```

7. **Seed the database (optional):**

```bash
node prisma/seed.js
```

8. **Start the backend server:**

```bash
npm start
```

The backend API will be available at `http://localhost:5000`

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

**Note:** The frontend is configured to connect to the backend at `http://localhost:5000/api` by default.

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Developer

Built by **Shubham Sharma**

