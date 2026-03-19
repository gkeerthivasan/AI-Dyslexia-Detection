const mongoose = require('mongoose');
require('dotenv').config();

// Sample exercises
const exercises = [
  // Word Recognition Exercises
  {
    exerciseId: 'word_recognition_001',
    exerciseType: 'word_recognition',
    title: 'Basic Sight Words',
    difficulty: 'beginner',
    content: {
      words: ['the', 'and', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on'],
      displayTime: 2000
    },
    instructions: 'Look at each word for 2 seconds, then type what you saw.'
  },
  {
    exerciseId: 'word_recognition_002',
    exerciseType: 'word_recognition',
    title: 'Common Words',
    difficulty: 'intermediate',
    content: {
      words: ['because', 'through', 'different', 'important', 'beautiful', 'together', 'yesterday', 'tomorrow'],
      displayTime: 2500
    },
    instructions: 'Study each word carefully and type it from memory.'
  },
  
  // Phonics Drills
  {
    exerciseId: 'phonics_001',
    exerciseType: 'phonics_drill',
    title: 'B/D Confusion Practice',
    difficulty: 'beginner',
    content: {
      words: ['bat', 'bad', 'bed', 'bid', 'bud', 'dad', 'did', 'deed', 'dab', 'dub'],
      focus: 'b/d discrimination'
    },
    instructions: 'Read these similar-sounding words aloud clearly.'
  },
  {
    exerciseId: 'phonics_002',
    exerciseType: 'phonics_drill',
    title: 'P/Q Confusion Practice',
    difficulty: 'beginner',
    content: {
      words: ['pat', 'pet', 'pit', 'pot', 'put', 'quat', 'quip', 'quit', 'quip', 'quip'],
      focus: 'p/q discrimination'
    },
    instructions: 'Practice distinguishing between p and q sounds.'
  },
  {
    exerciseId: 'phonics_003',
    exerciseType: 'phonics_drill',
    title: 'Vowel Teams',
    difficulty: 'intermediate',
    content: {
      words: ['rain', 'read', 'road', 'team', 'boat', 'blue', 'green', 'brown'],
      focus: 'vowel teams'
    },
    instructions: 'Read words with vowel pairs correctly.'
  },
  
  // Sentence Reading
  {
    exerciseId: 'sentence_001',
    exerciseType: 'sentence_reading',
    title: 'Simple Sentences',
    difficulty: 'beginner',
    content: {
      sentences: [
        'The cat sat on the mat.',
        'I like to play with my friends.',
        'My dog is very friendly.',
        'We go to school every day.',
        'The sun is bright today.'
      ]
    },
    instructions: 'Read each sentence aloud clearly.'
  },
  {
    exerciseId: 'sentence_002',
    exerciseType: 'sentence_reading',
    title: 'Complex Sentences',
    difficulty: 'intermediate',
    content: {
      sentences: [
        'Although it was raining, we decided to go for a walk.',
        'The library, which has many books, is my favorite place.',
        'Because she studied hard, she passed the exam with flying colors.',
        'When the morning arrives, the birds begin to sing beautifully.'
      ]
    },
    instructions: 'Read these complex sentences with proper expression.'
  },
  
  // Comprehension Quizzes
  {
    exerciseId: 'comprehension_001',
    exerciseType: 'comprehension_quiz',
    title: 'Story Comprehension',
    difficulty: 'beginner',
    content: {
      passage: 'Tom has a red ball. He likes to play with his dog. The dog can catch the ball when Tom throws it. They play in the park every evening.',
      questions: [
        {
          question: 'What color is Tom\'s ball?',
          options: ['Blue', 'Red', 'Green', 'Yellow'],
          correct: 1
        },
        {
          question: 'Who plays with Tom?',
          options: ['His cat', 'His dog', 'His friend', 'His brother'],
          correct: 1
        },
        {
          question: 'Where do they play?',
          options: ['At home', 'In the yard', 'In the park', 'At school'],
          correct: 2
        }
      ]
    },
    instructions: 'Read the passage and answer the questions.'
  },
  {
    exerciseId: 'comprehension_002',
    exerciseType: 'comprehension_quiz',
    title: 'Science Comprehension',
    difficulty: 'intermediate',
    content: {
      passage: 'The water cycle is a continuous process that moves water around the Earth. Water evaporates from oceans and lakes, forms clouds, and returns to the ground as rain or snow. This process is essential for life on our planet.',
      questions: [
        {
          question: 'What is the water cycle?',
          options: [
            'A one-time event',
            'A continuous process',
            'A seasonal change',
            'A local phenomenon'
          ],
          correct: 1
        },
        {
          question: 'Where does water evaporate from?',
          options: ['Only oceans', 'Only lakes', 'Oceans and lakes', 'Only rivers'],
          correct: 2
        },
        {
          question: 'Why is the water cycle important?',
          options: [
            'It creates wind',
            'It is essential for life',
            'It controls temperature',
            'It makes clouds'
          ],
          correct: 1
        }
      ]
    },
    instructions: 'Read the passage carefully and choose the best answers.'
  },
  
  // Speed Reading
  {
    exerciseId: 'speed_001',
    exerciseType: 'speed_reading',
    title: 'Quick Reading Practice',
    difficulty: 'beginner',
    content: {
      passage: 'Quick brown fox jumps over lazy dogs. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!',
      targetWPM: 80,
      timeLimit: 30
    },
    instructions: 'Read this text as quickly and accurately as possible.'
  },
  {
    exerciseId: 'speed_002',
    exerciseType: 'speed_reading',
    title: 'Speed Challenge',
    difficulty: 'intermediate',
    content: {
      passage: 'The amazing journey of discovery begins with a single step into the unknown. Every great achievement in human history started as someone\'s dream, transformed through persistence and dedication into reality.',
      targetWPM: 120,
      timeLimit: 45
    },
    instructions: 'Challenge yourself to read this passage at a good pace.'
  }
];

// Seed function
async function seedExercises() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const Exercise = require('../models/ExerciseResult');
    
    // Check if exercises already exist
    const existingCount = await mongoose.connection.db.collection('exercises').countDocuments();
    
    if (existingCount > 0) {
      console.log('Exercises already exist. Skipping seed.');
      return;
    }
    
    // Insert exercises
    await mongoose.connection.db.collection('exercises').insertMany(exercises);
    console.log(`Successfully seeded ${exercises.length} exercises`);
    
  } catch (error) {
    console.error('Error seeding exercises:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedExercises();
}

module.exports = { seedExercises, exercises };
