const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const AlumniProfile = require('../models/AlumniProfile');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const createSampleAlumni = async () => {
    try {
        console.log('🔄 Creating sample alumni data...\n');

        // Create alumni users
        const alumniUsers = [
            {
                name: 'John Doe',
                email: 'john.alumni@example.com',
                password: 'password123',
                role: 'alumni',
                isApproved: true
            },
            {
                name: 'Jane Smith',
                email: 'jane.alumni@example.com',
                password: 'password123',
                role: 'alumni',
                isApproved: true
            },
            {
                name: 'Mike Johnson',
                email: 'mike.alumni@example.com',
                password: 'password123',
                role: 'alumni',
                isApproved: true
            }
        ];

        // Create users
        const createdUsers = await User.create(alumniUsers);
        console.log(`✅ Created ${createdUsers.length} alumni users`);

        // Create alumni profiles
        const alumniProfiles = [
            {
                user: createdUsers[0]._id,
                batch: 2020,
                degree: 'B.Tech',
                branch: 'Computer Science',
                currentCompany: 'Google',
                designation: 'Software Engineer',
                skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                linkedin: 'https://linkedin.com/in/johndoe',
                github: 'https://github.com/johndoe',
                about: 'Passionate software engineer with 3+ years of experience in full-stack development.',
                location: 'San Francisco, CA'
            },
            {
                user: createdUsers[1]._id,
                batch: 2019,
                degree: 'B.Tech',
                branch: 'Information Technology',
                currentCompany: 'Microsoft',
                designation: 'Senior Developer',
                skills: ['Python', 'Django', 'AWS', 'Docker'],
                linkedin: 'https://linkedin.com/in/janesmith',
                github: 'https://github.com/janesmith',
                about: 'Cloud architect and backend specialist with expertise in scalable systems.',
                location: 'Seattle, WA'
            },
            {
                user: createdUsers[2]._id,
                batch: 2021,
                degree: 'M.Tech',
                branch: 'Data Science',
                currentCompany: 'Amazon',
                designation: 'Data Scientist',
                skills: ['Machine Learning', 'Python', 'TensorFlow', 'SQL'],
                linkedin: 'https://linkedin.com/in/mikejohnson',
                github: 'https://github.com/mikejohnson',
                about: 'Data scientist specializing in ML models and predictive analytics.',
                location: 'Austin, TX'
            }
        ];

        const createdProfiles = await AlumniProfile.create(alumniProfiles);
        console.log(`✅ Created ${createdProfiles.length} alumni profiles\n`);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Sample alumni data created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📝 Sample Alumni Users:');
        alumniUsers.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.name} (${user.email})`);
        });
        console.log('\n🔑 Password for all: password123');
        console.log('\n🌐 Now visit your Alumni Directory to see the data!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

createSampleAlumni();
