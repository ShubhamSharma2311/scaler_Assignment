const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log('Starting database seeding...');

  await prisma.bookingAnswer.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.customQuestion.deleteMany();
  await prisma.dateOverride.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.eventType.deleteMany();

  const eventType1 = await prisma.eventType.create({
    data: {
      title: '30 Minute Meeting',
      description: 'A quick 30-minute meeting to discuss your project, goals, or any questions you may have.',
      duration: 30,
      slug: '30-min-meeting',
      color: '#3b82f6',
      bufferTime: 0,
      questions: {
        create: [
          {
            question: 'What would you like to discuss?',
            type: 'text',
            required: true
          }
        ]
      }
    }
  });

  const eventType2 = await prisma.eventType.create({
    data: {
      title: '60 Minute Consultation',
      description: 'An in-depth 60-minute consultation session for detailed discussions and planning.',
      duration: 60,
      slug: '60-min-consultation',
      color: '#8b5cf6',
      bufferTime: 15,
      questions: {
        create: [
          {
            question: 'What is your company name?',
            type: 'text',
            required: false
          },
          {
            question: 'How did you hear about us?',
            type: 'text',
            required: false
          }
        ]
      }
    }
  });

  const eventType3 = await prisma.eventType.create({
    data: {
      title: '15 Minute Quick Call',
      description: 'A brief 15-minute call for quick questions or introductions.',
      duration: 15,
      slug: '15-min-quick-call',
      color: '#10b981',
      bufferTime: 5
    }
  });

  console.log('Event types created successfully');

  const availabilities = [
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', timezone: 'UTC' },
    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', timezone: 'UTC' },
    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', timezone: 'UTC' },
    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', timezone: 'UTC' },
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', timezone: 'UTC' }
  ];

  await prisma.availability.createMany({ data: availabilities });
  console.log('Availability created successfully');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setHours(0, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);

  await prisma.booking.create({
    data: {
      eventTypeId: eventType1.id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
      timezone: 'UTC',
      status: 'confirmed',
      notes: 'Looking forward to discussing the new project proposal.'
    }
  });

  await prisma.booking.create({
    data: {
      eventTypeId: eventType2.id,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      date: dayAfterTomorrow,
      startTime: '14:00',
      endTime: '15:00',
      timezone: 'UTC',
      status: 'confirmed',
      notes: 'Need consultation on website redesign.'
    }
  });

  await prisma.booking.create({
    data: {
      eventTypeId: eventType3.id,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      date: nextWeek,
      startTime: '11:00',
      endTime: '11:15',
      timezone: 'UTC',
      status: 'confirmed'
    }
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  await prisma.booking.create({
    data: {
      eventTypeId: eventType1.id,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      date: yesterday,
      startTime: '13:00',
      endTime: '13:30',
      timezone: 'UTC',
      status: 'confirmed',
      notes: 'Past booking for testing.'
    }
  });

  console.log('Bookings created successfully');

  const blockedDate = new Date();
  blockedDate.setDate(blockedDate.getDate() + 5);

  await prisma.dateOverride.create({
    data: {
      date: blockedDate,
      isBlocked: true
    }
  });

  const customHoursDate = new Date();
  customHoursDate.setDate(customHoursDate.getDate() + 10);

  await prisma.dateOverride.create({
    data: {
      date: customHoursDate,
      isBlocked: false,
      startTime: '10:00',
      endTime: '14:00'
    }
  });

  console.log('Date overrides created successfully');
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
