import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.savedCollege.deleteMany()
  await prisma.review.deleteMany()
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()

  const colleges = [
    { name: 'IIT Delhi', location: 'New Delhi', state: 'Delhi', fees: 200000, rating: 4.8, description: 'Indian Institute of Technology Delhi is one of the premier engineering institutions in India.', imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 200000 }, { name: 'B.Tech Electrical Engineering', duration: '4 years', fees: 200000 }, { name: 'M.Tech', duration: '2 years', fees: 25000 }] },
    { name: 'IIT Bombay', location: 'Mumbai', state: 'Maharashtra', fees: 220000, rating: 4.9, description: 'IIT Bombay is consistently ranked among the top engineering colleges in India.', imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 220000 }, { name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 220000 }, { name: 'M.Tech', duration: '2 years', fees: 30000 }] },
    { name: 'IIT Madras', location: 'Chennai', state: 'Tamil Nadu', fees: 210000, rating: 4.9, description: 'IIT Madras is ranked the top engineering institute in India by NIRF for several consecutive years.', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 210000 }, { name: 'B.Tech Aerospace Engineering', duration: '4 years', fees: 210000 }] },
    { name: 'IIT Kanpur', location: 'Kanpur', state: 'Uttar Pradesh', fees: 205000, rating: 4.8, description: 'IIT Kanpur is known for its strong research culture and excellent engineering programs.', imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 205000 }, { name: 'B.Tech Chemical Engineering', duration: '4 years', fees: 205000 }, { name: 'PhD', duration: '4 years', fees: 12000 }] },
    { name: 'IIT Kharagpur', location: 'Kharagpur', state: 'West Bengal', fees: 195000, rating: 4.7, description: 'The oldest IIT in India with a sprawling campus and excellent facilities.', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 195000 }, { name: 'B.Tech Civil Engineering', duration: '4 years', fees: 195000 }] },
    { name: 'BITS Pilani', location: 'Pilani', state: 'Rajasthan', fees: 500000, rating: 4.7, description: 'BITS Pilani is a top private university known for its practice school internship program.', imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', courses: [{ name: 'B.E. Computer Science', duration: '4 years', fees: 500000 }, { name: 'B.E. Mechanical', duration: '4 years', fees: 500000 }] },
    { name: 'Delhi Technological University', location: 'New Delhi', state: 'Delhi', fees: 150000, rating: 4.2, description: 'DTU is one of the oldest technical universities in Delhi with a wide range of engineering programs.', imageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 150000 }, { name: 'B.Tech Civil Engineering', duration: '4 years', fees: 150000 }] },
    { name: 'NSIT Delhi', location: 'New Delhi', state: 'Delhi', fees: 120000, rating: 4.1, description: 'Netaji Subhas Institute of Technology known for strong placements in top tech companies.', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 120000 }, { name: 'B.Tech Electronics', duration: '4 years', fees: 120000 }] },
    { name: 'VIT Vellore', location: 'Vellore', state: 'Tamil Nadu', fees: 180000, rating: 4.1, description: 'VIT University is a deemed university known for strong industry connections and excellent placements.', imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 180000 }, { name: 'B.Tech Electronics', duration: '4 years', fees: 180000 }] },
    { name: 'Manipal Institute of Technology', location: 'Manipal', state: 'Karnataka', fees: 350000, rating: 4.0, description: 'MIT Manipal is a sought-after private engineering college with a strong alumni network.', imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 350000 }, { name: 'B.Tech Biotechnology', duration: '4 years', fees: 350000 }] },
    { name: 'SRM Institute of Science and Technology', location: 'Chennai', state: 'Tamil Nadu', fees: 250000, rating: 3.9, description: 'SRM is one of the largest private universities in India with good placement support.', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 250000 }, { name: 'MBA', duration: '2 years', fees: 200000 }] },
    { name: 'NIT Trichy', location: 'Tiruchirappalli', state: 'Tamil Nadu', fees: 140000, rating: 4.5, description: 'NIT Trichy is consistently ranked among the top NITs with excellent academic programs.', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 140000 }, { name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 140000 }] },
    { name: 'NIT Warangal', location: 'Warangal', state: 'Telangana', fees: 135000, rating: 4.4, description: 'NIT Warangal is one of the oldest and most reputed NITs with strong industry connections.', imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 135000 }, { name: 'B.Tech Electronics', duration: '4 years', fees: 135000 }] },
    { name: 'IIIT Hyderabad', location: 'Hyderabad', state: 'Telangana', fees: 320000, rating: 4.6, description: 'IIIT Hyderabad is a research-focused institution known for excellence in computer science.', imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 320000 }, { name: 'M.Tech', duration: '2 years', fees: 85000 }] },
    { name: 'Christ University', location: 'Bangalore', state: 'Karnataka', fees: 180000, rating: 4.0, description: 'Christ University is known for its holistic education approach and strong liberal arts programs.', imageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80', courses: [{ name: 'BCA', duration: '3 years', fees: 180000 }, { name: 'MBA', duration: '2 years', fees: 350000 }] },
    { name: 'Amity University', location: 'Noida', state: 'Uttar Pradesh', fees: 280000, rating: 3.8, description: 'Amity University is one of the largest private universities in India with diverse programs.', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 280000 }, { name: 'BBA', duration: '3 years', fees: 220000 }] },
    { name: 'Jadavpur University', location: 'Kolkata', state: 'West Bengal', fees: 50000, rating: 4.4, description: 'Jadavpur University is one of the most reputed state universities with affordable fees.', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 50000 }, { name: 'B.Tech Electrical Engineering', duration: '4 years', fees: 50000 }] },
    { name: 'PSG College of Technology', location: 'Coimbatore', state: 'Tamil Nadu', fees: 120000, rating: 4.2, description: 'PSG College of Technology is one of the top engineering colleges in Tamil Nadu.', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 120000 }, { name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 120000 }] },
    { name: 'Thapar Institute of Engineering', location: 'Patiala', state: 'Punjab', fees: 320000, rating: 4.3, description: 'Thapar Institute is a top private engineering university with strong research culture.', imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 320000 }, { name: 'M.Tech', duration: '2 years', fees: 95000 }] },
    { name: 'BIT Mesra', location: 'Ranchi', state: 'Jharkhand', fees: 220000, rating: 4.0, description: 'Birla Institute of Technology Mesra is a deemed university with a beautiful campus.', imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', courses: [{ name: 'B.Tech Computer Science', duration: '4 years', fees: 220000 }, { name: 'B.Tech Electronics', duration: '4 years', fees: 220000 }] },
  ]

  for (const college of colleges) {
    await prisma.college.create({
      data: {
        name: college.name,
        location: college.location,
        state: college.state,
        fees: college.fees,
        rating: college.rating,
        description: college.description,
        imageUrl: college.imageUrl,
        courses: { create: college.courses }
      }
    })
  }

  console.log('Seed done: 20 colleges created')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
  