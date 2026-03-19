const mongoose = require('mongoose');
const ExerciseResult = require('../models/ExerciseResult');

// Real exercises data
const realExercises = [
  {
    _id: 'word-recognition-1',
    exerciseId: 'word-recognition-1',
    title: 'Basic Word Recognition',
    description: 'Practice recognizing and reading common sight words',
    difficulty: 'easy',
    exerciseType: 'word-recognition',
    content: [
      'the', 'and', 'is', 'it', 'in', 'you', 'that', 'he', 'was', 'for',
      'on', 'are', 'as', 'with', 'his', 'they', 'I', 'at', 'be', 'this',
      'have', 'from', 'or', 'one', 'had', 'but', 'not', 'what', 'all', 'were'
    ],
    instructions: 'Read each word aloud clearly. Focus on pronunciation and accuracy.',
    timeLimit: 180, // 3 minutes
    scoring: {
      correct: 10,
      incorrect: 0,
      skipped: 0
    }
  },
  {
    _id: 'word-recognition-2',
    exerciseId: 'word-recognition-2',
    title: 'Advanced Word Recognition',
    description: 'Practice reading more complex words and multi-syllable words',
    difficulty: 'medium',
    exerciseType: 'word-recognition',
    content: [
      'because', 'through', 'different', 'important', 'family',
      'beautiful', 'together', 'understand', 'yesterday', 'tomorrow',
      'knowledge', 'experience', 'environment', 'successful', 'confidence',
      'pronunciation', 'comprehension', 'achievement', 'opportunity', 'responsibility'
    ],
    instructions: 'Take your time with each word. Break down complex words into syllables if needed.',
    timeLimit: 240, // 4 minutes
    scoring: {
      correct: 15,
      incorrect: 0,
      skipped: 0
    }
  },
  {
    _id: 'sentence-reading-1',
    exerciseId: 'sentence-reading-1',
    title: 'Simple Sentence Reading',
    description: 'Practice reading simple sentences with proper fluency',
    difficulty: 'easy',
    exerciseType: 'sentence-reading',
    content: [
      'The cat sits on the mat.',
      'I like to read books.',
      'The sun is bright today.',
      'She plays with her friends.',
      'We go to school every day.',
      'The dog runs in the park.',
      'He eats his lunch quickly.',
      'They work hard on their project.',
      'The bird sings a beautiful song.',
      'I help my mom with chores.'
    ],
    instructions: 'Read each sentence at a comfortable pace. Focus on fluency and expression.',
    timeLimit: 300, // 5 minutes
    scoring: {
      correct: 20,
      incorrect: 0,
      skipped: 0
    }
  },
  {
    _id: 'sentence-reading-2',
    exerciseId: 'sentence-reading-2',
    title: 'Complex Sentence Reading',
    description: 'Practice reading longer, more complex sentences',
    difficulty: 'medium',
    exerciseType: 'sentence-reading',
    content: [
      'Although it was raining, we decided to go for a walk in the park.',
      'The students worked diligently on their science projects throughout the week.',
      'Because she practiced every day, her reading skills improved significantly.',
      'The library, which was built last year, has thousands of interesting books.',
      'When the storm passed, the children went outside to play in the sunshine.',
      'The teacher explained the difficult concept using several examples and diagrams.',
      'Despite the challenges, the team completed the project ahead of schedule.',
      'The ancient castle, standing on the hill, has a fascinating history.',
      'She carefully read the instructions before assembling the new bookshelf.',
      'The museum displays artifacts from various civilizations around the world.'
    ],
    instructions: 'Read each complex sentence carefully. Pay attention to punctuation and pauses.',
    timeLimit: 360, // 6 minutes
    scoring: {
      correct: 30,
      incorrect: 0,
      skipped: 0
    }
  },
  {
    _id: 'reading-comprehension-1',
    exerciseId: 'reading-comprehension-1',
    title: 'Reading Comprehension - Short Stories',
    description: 'Read short passages and answer comprehension questions',
    difficulty: 'medium',
    exerciseType: 'comprehension',
    content: [
      {
        passage: 'Emma loved visiting her grandmother\'s farm. Every summer, she would spend two weeks helping with the animals. Her favorite was a small brown pony named Cocoa. Emma would feed Cocoa carrots and brush his coat. In return, Cocoa would let Emma ride him around the farm. They would explore the fields and sometimes visit the nearby stream. Emma\'s grandmother would pack them a lunch with sandwiches and fresh fruit. These were Emma\'s happiest memories.',
        questions: [
          {
            question: 'Where did Emma visit every summer?',
            options: ['The beach', 'Her grandmother\'s farm', 'The city', 'The mountains'],
            correct: 1
          },
          {
            question: 'What was the name of Emma\'s favorite pony?',
            options: ['Brownie', 'Cocoa', 'Sparky', 'Thunder'],
            correct: 1
          },
          {
            question: 'What did Emma feed the pony?',
            options: ['Apples', 'Hay', 'Carrots', 'Sugar'],
            correct: 2
          },
          {
            question: 'How long did Emma stay at the farm?',
            options: ['One week', 'Two weeks', 'Three weeks', 'One month'],
            correct: 1
          }
        ]
      }
    ],
    instructions: 'Read the passage carefully and answer the questions that follow.',
    timeLimit: 600, // 10 minutes
    scoring: {
      correct: 25,
      incorrect: 0,
      skipped: 0
    }
  },
  {
    _id: 'reading-comprehension-2',
    exerciseId: 'reading-comprehension-2',
    title: 'Reading Comprehension - Science',
    description: 'Read science passages and demonstrate understanding',
    difficulty: 'hard',
    exerciseType: 'comprehension',
    content: [
      {
        passage: 'Photosynthesis is the process by which plants convert light energy into chemical energy. This process occurs in the chloroplasts of plant cells, where chlorophyll captures sunlight. The plant uses this energy to convert carbon dioxide and water into glucose and oxygen. Glucose serves as food for the plant, while oxygen is released into the atmosphere. This process is essential for life on Earth, as it produces the oxygen that humans and animals need to breathe. Without photosynthesis, most life forms would not exist.',
        questions: [
          {
            question: 'What is photosynthesis?',
            options: [
              'The process of plants growing',
              'Converting light energy into chemical energy',
              'How plants reproduce',
              'The way plants move'
            ],
            correct: 1
          },
          {
            question: 'Where does photosynthesis occur in plant cells?',
            options: ['Nucleus', 'Mitochondria', 'Chloroplasts', 'Cell membrane'],
            correct: 2
          },
          {
            question: 'What captures sunlight in photosynthesis?',
            options: ['Carbon dioxide', 'Water', 'Glucose', 'Chlorophyll'],
            correct: 3
          },
          {
            question: 'What is released into the atmosphere during photosynthesis?',
            options: ['Carbon dioxide', 'Oxygen', 'Glucose', 'Water'],
            correct: 1
          },
          {
            question: 'Why is photosynthesis essential for life?',
            options: [
              'It creates food for plants',
              'It produces oxygen for breathing',
              'Both A and B',
              'It makes plants green'
            ],
            correct: 2
          }
        ]
      }
    ],
    instructions: 'Read the science passage carefully and answer all questions to the best of your ability.',
    timeLimit: 720, // 12 minutes
    scoring: {
      correct: 40,
      incorrect: 0,
      skipped: 0
    }
  },
  {
    _id: 'phonics-1',
    exerciseId: 'phonics-1',
    title: 'Phonics Practice - Short Vowels',
    description: 'Practice reading words with short vowel sounds',
    difficulty: 'easy',
    exerciseType: 'phonics',
    content: [
      'cat', 'bat', 'hat', 'mat', 'rat',
      'pen', 'hen', 'ten', 'men', 'den',
      'pig', 'dig', 'big', 'wig', 'fig',
      'dog', 'log', 'fog', 'hog', 'jog',
      'sun', 'fun', 'run', 'bun', 'gun'
    ],
    instructions: 'Focus on the short vowel sound in each word. Say each word clearly.',
    timeLimit: 180, // 3 minutes
    scoring: {
      correct: 10,
      incorrect: 0,
      skipped: 0
    }
  },
  {
    _id: 'fluency-1',
    exerciseId: 'fluency-1',
    title: 'Reading Fluency Practice',
    description: 'Practice reading with proper speed and expression',
    difficulty: 'medium',
    exerciseType: 'fluency',
    content: [
      'The little rabbit hopped through the green meadow. It was looking for carrots to eat. Suddenly, it saw a big orange carrot sticking out of the ground. The rabbit pulled and pulled until the carrot came out. It was happy and started munching on its delicious snack.'
    ],
    instructions: 'Read the passage aloud at a comfortable pace. Focus on smooth reading and natural pauses.',
    timeLimit: 120, // 2 minutes
    scoring: {
      wordsPerMinute: 'calculated',
      accuracy: 'calculated',
      expression: 'manual'
    }
  }
];

// Get all exercises
const getExercises = async (req, res) => {
  try {
    const { difficulty, type } = req.query;
    
    // Filter real exercises based on query parameters
    let exercises = realExercises;
    if (difficulty) {
      exercises = exercises.filter(ex => ex.difficulty === difficulty);
    }
    if (type) {
      exercises = exercises.filter(ex => ex.exerciseType === type);
    }
    
    // Try database first, fallback to real exercises
    try {
      if (mongoose.connection.readyState === 1) { // Connected
        const dbExercises = await mongoose.connection.db
          .collection('exercises')
          .find({})
          .toArray();
        
        if (dbExercises.length > 0) {
          exercises = dbExercises;
        }
      }
    } catch (dbError) {
      console.warn('Database error, using real exercises:', dbError.message);
    }
    
    res.status(200).json({
      success: true,
      data: { exercises }
    });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching exercises.'
    });
  }
};

// Get single exercise
const getExercise = async (req, res) => {
  try {
    let exercise = null;
    
    // Try database first
    try {
      if (mongoose.connection.readyState === 1) { // Connected
        exercise = await mongoose.connection.db
          .collection('exercises')
          .findOne({ exerciseId: req.params.id });
      }
    } catch (dbError) {
      console.warn('Database error, using real exercises:', dbError.message);
    }
    
    // Fallback to real exercises
    if (!exercise) {
      exercise = realExercises.find(ex => ex.exerciseId === req.params.id);
    }
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { exercise }
    });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching exercise.'
    });
  }
};

// Save exercise result
const saveExerciseResult = async (req, res) => {
  try {
    const {
      exerciseId,
      exerciseType,
      exerciseTitle,
      difficulty,
      score,
      errors,
      timeTaken,
      maxTime,
      feedback
    } = req.body;
    
    if (!exerciseId || !exerciseType || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Exercise ID, type, and score are required.'
      });
    }
    
    const result = new ExerciseResult({
      userId: req.user._id,
      exerciseId,
      exerciseType,
      exerciseTitle: exerciseTitle || 'Untitled Exercise',
      difficulty: difficulty || 'beginner',
      score: Math.max(0, Math.min(100, score)), // Ensure score is between 0-100
      errors: errors || [],
      timeTaken: timeTaken || 0,
      maxTime: maxTime || 300,
      feedback: feedback || ''
    });
    
    await result.save();
    
    res.status(201).json({
      success: true,
      message: 'Exercise result saved successfully.',
      data: { 
        result: {
          id: result._id,
          score: result.score,
          performanceLevel: result.getPerformanceLevel()
        }
      }
    });
  } catch (error) {
    console.error('Save exercise result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving exercise result.'
    });
  }
};

// Get user's exercise results
const getUserExerciseResults = async (req, res) => {
  try {
    const { type, difficulty, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = { userId: req.user._id };
    if (type) filter.exerciseType = type;
    if (difficulty) filter.difficulty = difficulty;
    
    const results = await ExerciseResult.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);
    
    const total = await ExerciseResult.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        results,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get exercise results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching exercise results.'
    });
  }
};

// Get exercise statistics
const getExerciseStats = async (req, res) => {
  try {
    const stats = await ExerciseResult.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$exerciseType',
          totalAttempts: { $sum: 1 },
          avgScore: { $avg: '$score' },
          bestScore: { $max: '$score' },
          avgTime: { $avg: '$timeTaken' }
        }
      },
      {
        $group: {
          _id: null,
          totalCompleted: { $sum: '$totalAttempts' },
          avgScore: { $avg: '$avgScore' },
          typeStats: {
            $push: {
              type: '$_id',
              stats: {
                attempts: '$totalAttempts',
                avgScore: '$avgScore',
                bestScore: '$bestScore',
                avgTime: '$avgTime'
              }
            }
          }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalCompleted: 0,
      avgScore: 0,
      typeStats: []
    };
    
    res.status(200).json({
      success: true,
      data: { stats: result }
    });
  } catch (error) {
    console.error('Get exercise stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching exercise statistics.'
    });
  }
};

module.exports = {
  getExercises,
  getExercise,
  saveExerciseResult,
  getUserExerciseResults,
  getExerciseStats
};
