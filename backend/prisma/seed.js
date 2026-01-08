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
      title: '30 Min Interview',
      description: 'A quick 30-minute interview to discuss your background and experience.',
      duration: 30,
      slug: '30-min-interview',
      color: '#3b82f6',
      bufferTime: 0
    }
  });

  const eventType2 = await prisma.eventType.create({
    data: {
      title: 'Quick Chat',
      description: 'A brief 15-minute call for quick questions.',
      duration: 15,
      slug: 'quick-chat',
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

  await prisma.booking.create({
    data: {
      eventTypeId: eventType1.id,
      name: 'John Doe',
      email: 'john@example.com',
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
      timezone: 'UTC',
      status: 'confirmed',
      notes: 'Looking forward to the meeting.'
    }
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  await prisma.booking.create({
    data: {
      eventTypeId: eventType2.id,
      name: 'Jane Smith',
      email: 'jane@example.com',
      date: yesterday,
      startTime: '14:00',
      endTime: '14:15',
      timezone: 'UTC',
      status: 'confirmed'
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
