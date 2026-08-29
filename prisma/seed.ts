import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.savedCollege.deleteMany()
  await prisma.review.deleteMany()
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()

  // Create colleges
  const iitDelhi = await prisma.college.create({
    data: {
      name: 'IIT Delhi',
      location: 'New Delhi',
      state: 'Delhi',
      fees: 200000,
      rating: 4.8,
      description: 'Indian Institute of Technology Delhi is one of the premier engineering institutions in India, known for cutting-edge research and excellent placements.',
      courses: {
        create: [
          { name: 'B.Tech Computer Science', duration: '4 years', fees: 200000 },
          { name: 'B.Tech Electrical Engineering', duration: '4 years', fees: 200000 },
          { name: 'M.Tech', duration: '2 years', fees: 25000 },
          { name: 'MBA', duration: '2 years', fees: 300000 },
        ]
      }
    }
  })

  const iitBombay = await prisma.college.create({
    data: {
      name: 'IIT Bombay',
      location: 'Mumbai',
      state: 'Maharashtra',
      fees: 220000,
      rating: 4.9,
      description: 'IIT Bombay is consistently ranked among the top engineering colleges in India with world-class faculty and infrastructure.',
      courses: {
        create: [
          { name: 'B.Tech Computer Science', duration: '4 years', fees: 220000 },
          { name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 220000 },
          { name: 'M.Tech', duration: '2 years', fees: 30000 },
        ]
      }
    }
  })

  const dtuDelhi = await prisma.college.create({
    data: {
      name: 'Delhi Technological University',
      location: 'New Delhi',
      state: 'Delhi',
      fees: 150000,
      rating: 4.2,
      description: 'DTU is one of the oldest and most prestigious technical universities in Delhi, offering a wide range of engineering programs.',
      courses: {
        create: [
          { name: 'B.Tech Computer Science', duration: '4 years', fees: 150000 },
          { name: 'B.Tech Civil Engineering', duration: '4 years', fees: 150000 },
          { name: 'M.Tech', duration: '2 years', fees: 20000 },
        ]
      }
    }
  })

  const vit = await prisma.college.create({
    data: {
      name: 'VIT Vellore',
      location: 'Vellore',
      state: 'Tamil Nadu',
      fees: 180000,
      rating: 4.1,
      description: 'VIT University is a deemed university known for its strong industry connections and excellent placement record.',
      courses: {
        create: [
          { name: 'B.Tech Computer Science', duration: '4 years', fees: 180000 },
          { name: 'B.Tech Electronics', duration: '4 years', fees: 180000 },
          { name: 'MBA', duration: '2 years', fees: 250000 },
        ]
      }
    }
  })

  const bits = await prisma.college.create({
    data: {
      name: 'BITS Pilani',
      location: 'Pilani',
      state: 'Rajasthan',
      fees: 500000,
      rating: 4.7,
      description: 'BITS Pilani is a top private university offering dual degree programs and known for its practice school internship program.',
      courses: {
        create: [
          { name: 'B.E. Computer Science', duration: '4 years', fees: 500000 },
          { name: 'B.E. Mechanical', duration: '4 years', fees: 500000 },
          { name: 'M.Sc. Mathematics', duration: '2 years', fees: 150000 },
        ]
      }
    }
  })

  const manipal = await prisma.college.create({
    data: {
      name: 'Manipal Institute of Technology',
      location: 'Manipal',
      state: 'Karnataka',
      fees: 350000,
      rating: 4.0,
      description: 'MIT Manipal is one of the most sought-after private engineering colleges in India with a strong alumni network.',
      courses: {
        create: [
          { name: 'B.Tech Computer Science', duration: '4 years', fees: 350000 },
          { name: 'B.Tech Biotechnology', duration: '4 years', fees: 350000 },
        ]
      }
    }
  })

  const srm = await prisma.college.create({
    data: {
      name: 'SRM Institute of Science and Technology',
      location: 'Chennai',
      state: 'Tamil Nadu',
      fees: 250000,
      rating: 3.9,
      description: 'SRM is one of the largest private universities in India with strong research programs and good placement support.',
      courses: {
        create: [
          { name: 'B.Tech Computer Science', duration: '4 years', fees: 250000 },
          { name: 'B.Tech Information Technology', duration: '4 years', fees: 250000 },
          { name: 'MBA', duration: '2 years', fees: 200000 },
        ]
      }
    }
  })

  const iitMadras = await prisma.college.create({
    data: {
      name: 'IIT Madras',
      location: 'Chennai',
      state: 'Tamil Nadu',
      fees: 210000,
      rating: 4.9,
      description: 'IIT Madras is ranked the top engineering institute in India by NIRF for several consecutive years.',
      courses: {
        create: [
          { name: 'B.Tech Computer Science', duration: '4 years', fees: 210000 },
          { name: 'B.Tech Aerospace Engineering', duration: '4 years', fees: 210000 },
          { name: 'M.Tech', duration: '2 years', fees: 28000 },
        ]
      }
    }
  })

  console.log('✅ Seed data created successfully')
  console.log(`Created ${8} colleges with courses`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })