const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PortfolioItem = require('./models/PortfolioItem');
const Testimonial = require('./models/Testimonial');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');

    // Clear existing data
    await PortfolioItem.deleteMany();
    await Testimonial.deleteMany();
    console.log('Existing data cleared');

    // Portfolio Data
    const portfolioData = [
      {
        title: "OWN YOUR POWER",
        ratio: "4:5",
        category: "Poster",
        isExclusive: false,
        mediaUrl: "/card_own_power.png"
      },
      {
        title: "BUILD YOUR BRAND",
        ratio: "4:5",
        category: "Social Post",
        isExclusive: false,
        mediaUrl: "/card_build_brand.png"
      },
      {
        title: "NO LIMITS",
        ratio: "16:9",
        category: "YouTube Thumbnail",
        isExclusive: false,
        mediaUrl: "/card_no_limits.png"
      },
      {
        title: "UNLEASH CREATIVITY",
        ratio: "16:9",
        category: "Banner",
        isExclusive: true,
        mediaUrl: "/card_unleash.png"
      }
    ];

    await PortfolioItem.insertMany(portfolioData);
    console.log('Portfolio data seeded');

    // 17 Real Client Reviews
    const testimonialData = [
      {
        name: 'Verified Creator',
        country: 'UK',
        role: 'YouTube Creator',
        rating: 5.0,
        text: 'The freelancer delivered what I was looking for ! Will definitely come back again'
      },
      {
        name: 'Verified Manager',
        country: 'Canada',
        role: 'Social Media Manager',
        rating: 4.3,
        text: "They consistently shows impressive creativity and attention to detail in their social media designs , ensuring visually appealing deliverables, while quality is exceptional and I've been pleased each time with the results"
      },
      {
        name: 'Verified Creator',
        country: 'USA',
        role: 'OnlyFans Creator',
        rating: 5.0,
        text: 'Enjoyed working with this editor. He was open to suggestions and very creative'
      },
      {
        name: 'Verified Creator',
        country: 'USA',
        role: 'YouTube Creator',
        rating: 5.0,
        text: 'super chill to work with and always nails the vibe I want'
      },
      {
        name: 'Verified Manager',
        country: 'USA',
        role: 'Social Media Manager',
        rating: 4.7,
        text: 'Obsessed with how clean the designs look. I Never had to ask for revisions twice , We will work with them again'
      },
      {
        name: 'Verified Creator',
        country: 'Australia',
        role: 'OnlyFans Creator',
        rating: 5.0,
        text: 'This guy gets the OF aesthetic so well.'
      },
      {
        name: 'Verified Creator',
        country: 'Brazil',
        role: 'YouTube Creator',
        rating: 5.0,
        text: 'Honestly one of the easiest freelancers I’ve worked with. Listens, suggests cool ideas, and delivers on time'
      },
      {
        name: 'Verified Creator',
        country: 'Austria',
        role: 'YouTube Creator',
        rating: 4.9,
        text: 'Pricing feels fair and the quality matches what you pay'
      },
      {
        name: 'Verified Creator',
        country: 'USA',
        role: 'Content Creator',
        rating: 4.8,
        text: 'The designs for my posts were solid, not overdone but still eye-catching, worked perfectly for my Instagram'
      },
      {
        name: 'Verified Creator',
        country: 'India',
        role: 'Content Creator',
        rating: 5.0,
        text: "I wanted a layout design format for my reels and i was so impressed by the design, it's looking better and attractive than my previous design"
      },
      {
        name: 'Verified Creator',
        country: 'Poland',
        role: 'OnlyFans Creator',
        rating: 5.0,
        text: "Worked with him for my OnlyFans promotional videos and posters, everything looked clean and hot. Really happy with the results , I'll keep this team for my upcoming contents too"
      },
      {
        name: 'Verified Manager',
        country: 'USA',
        role: 'OnlyFans Manager',
        rating: 4.9,
        text: 'Handled the designs and content layout for one of my creators really well and easy to work with'
      },
      {
        name: 'Verified Creator',
        country: 'USA',
        role: 'OnlyFans Creator',
        rating: 5.0,
        text: "Clear communication, I'm impressed with the banners he designed for my Twitter page and Onlyfans"
      },
      {
        name: 'Verified Creator',
        country: 'India',
        role: 'Content Creator',
        rating: 5.0,
        text: "I'm still working with this designer, I love how he understands the theme and niche of my content"
      },
      {
        name: 'Verified Creator',
        country: 'USA',
        role: 'TikTok Creator',
        rating: 5.0,
        text: 'Got my TikTok videos edited  and they turned out really clean and engaging.'
      },
      {
        name: 'Verified Creator',
        country: 'USA',
        role: 'Creator',
        rating: 4.5,
        text: "I'm happy that i worked with this editor, I had my unedited footages from years and he co operated with me and done with final edited contents for my adult site"
      },
      {
        name: 'Verified Creator',
        country: 'India',
        role: 'Content Creator',
        rating: 5.0,
        text: 'Working with him from 2 years and i love my team'
      }
    ];

    await Testimonial.insertMany(testimonialData);
    console.log('17 Testimonials seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
