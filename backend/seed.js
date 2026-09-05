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

    // Portfolio Data (23 Distinct Items Across Ratios)
    const portfolioData = [
      // 4:5 Posters (8 Items)
      { _id: 'p1', id: 'p1', title: 'Work Poster 1', img: '/uploads/img_1787333949894_1jmf0.jpg', mediaUrl: '/uploads/img_1787333949894_1jmf0.jpg', ratio: '4:5', category: 'Design', tag: 'Design' },
      { _id: 'p2', id: 'p2', title: 'Work Poster 2', img: '/uploads/img_1787333959824_d5d5t.jpg', mediaUrl: '/uploads/img_1787333959824_d5d5t.jpg', ratio: '4:5', category: 'Design', tag: 'Design' },
      { _id: 'p3', id: 'p3', title: 'Work Poster 3', img: '/uploads/img_1787333971022_a6gxa.png', mediaUrl: '/uploads/img_1787333971022_a6gxa.png', ratio: '4:5', category: 'Design', tag: 'Design' },
      { _id: 'p4', id: 'p4', title: 'Work Poster 4', img: '/uploads/img_1787333981872_baixa.png', mediaUrl: '/uploads/img_1787333981872_baixa.png', ratio: '4:5', category: 'Design', tag: 'Design' },
      { _id: 'p5', id: 'p5', title: 'Work Poster 5', img: '/uploads/img_1787333992992_iyf98.jpg', mediaUrl: '/uploads/img_1787333992992_iyf98.jpg', ratio: '4:5', category: 'Design', tag: 'Design' },
      { _id: 'p6', id: 'p6', title: 'Work Poster 6', img: '/uploads/img_1787334002671_273ss.jpg', mediaUrl: '/uploads/img_1787334002671_273ss.jpg', ratio: '4:5', category: 'Design', tag: 'Design' },
      { _id: 'p7', id: 'p7', title: 'Work Poster 7', img: '/uploads/img_1787334017008_lj9un.jpg', mediaUrl: '/uploads/img_1787334017008_lj9un.jpg', ratio: '4:5', category: 'Design', tag: 'Design' },
      { _id: 'p8', id: 'p8', title: 'Work Poster 8', img: '/uploads/img_1787334033661_lxfkj.jpg', mediaUrl: '/uploads/img_1787334033661_lxfkj.jpg', ratio: '4:5', category: 'Design', tag: 'Design' },
      // 16:9 Thumbnails (12 Items)
      { _id: 't1', id: 't1', title: 'Widescreen Work 1', img: '/uploads/img_1787334805662_b1tw7.jpg', mediaUrl: '/uploads/img_1787334805662_b1tw7.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      { _id: 't2', id: 't2', title: 'Widescreen Work 2', img: '/uploads/img_1787335251860_szynt.jpg', mediaUrl: '/uploads/img_1787335251860_szynt.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      { _id: 't3', id: 't3', title: 'Widescreen Work 3', img: '/uploads/img_1787335265295_lkbrl.jpg', mediaUrl: '/uploads/img_1787335265295_lkbrl.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      { _id: 't4', id: 't4', title: 'Widescreen Work 4', img: '/uploads/img_1787335277827_huaja.jpg', mediaUrl: '/uploads/img_1787335277827_huaja.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      { _id: 't5', id: 't5', title: 'Widescreen Work 5', img: '/uploads/img_1787335292227_aqdyj.jpg', mediaUrl: '/uploads/img_1787335292227_aqdyj.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      { _id: 't6', id: 't6', title: 'Widescreen Work 6', img: '/uploads/img_1787335301578_kbkua.jpg', mediaUrl: '/uploads/img_1787335301578_kbkua.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      { _id: 't7', id: 't7', title: 'Widescreen Work 7', img: '/uploads/img_1787335313226_ekbud.jpg', mediaUrl: '/uploads/img_1787335313226_ekbud.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      { _id: 't8', id: 't8', title: 'Widescreen Work 8', img: '/uploads/img_1787335327424_4ukqc.jpg', mediaUrl: '/uploads/img_1787335327424_4ukqc.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      { _id: 't9', id: 't9', title: 'Widescreen Work 9', img: '/uploads/img_1787335385637_80rgz.jpg', mediaUrl: '/uploads/img_1787335385637_80rgz.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      { _id: 't10', id: 't10', title: 'Widescreen Work 10', img: '/uploads/img_1787335404823_ywbus.jpg', mediaUrl: '/uploads/img_1787335404823_ywbus.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      { _id: 't11', id: 't11', title: 'Widescreen Work 11', img: '/uploads/img_1787335417213_44yop.jpg', mediaUrl: '/uploads/img_1787335417213_44yop.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      { _id: 't12', id: 't12', title: 'Widescreen Work 12', img: '/uploads/img_1787335427940_6edkw.jpg', mediaUrl: '/uploads/img_1787335427940_6edkw.jpg', ratio: '16:9', category: 'Video Editing', tag: 'Video Editing' },
      // Banner Items (3 Items)
      { _id: 'b1', id: 'b1', title: 'Ultra Wide Banner 1', img: '/uploads/img_1787335466696_5zgbr.jpg', mediaUrl: '/uploads/img_1787335466696_5zgbr.jpg', ratio: 'Banner', category: 'Banner Design', tag: 'Banner Design' },
      { _id: 'b2', id: 'b2', title: 'Ultra Wide Banner 2', img: '/uploads/img_1787335477095_2pm9i.jpg', mediaUrl: '/uploads/img_1787335477095_2pm9i.jpg', ratio: 'Banner', category: 'Banner Design', tag: 'Banner Design' },
      { _id: 'b3', id: 'b3', title: 'Ultra Wide Banner 3', img: '/uploads/img_1787335486546_tep7i.jpg', mediaUrl: '/uploads/img_1787335486546_tep7i.jpg', ratio: 'Banner', category: 'Banner Design', tag: 'Banner Design' },
    ];

    await PortfolioItem.insertMany(portfolioData);
    console.log('Portfolio data seeded successfully with 23 distinct items');

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
