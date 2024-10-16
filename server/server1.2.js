import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import Question from './questionModel.js'; // Importing the Mongoose model
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: '*', // Allows all origins
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to MongoDB');
    // Add predefined questions after successful connection
    // addPredefinedQuestions();
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Predefined questions
const predefinedQuestions = [
    { question: "The provider holds strong conviction about the adequacy of their care.", phrase: "Holds conviction that proper care was rendered", isPositive: true, id: 1 },
    { question: "The provider effectively explains the adequacy of the care provided in conversation with counsel.", phrase: "Effectively explains adequacy of care informally", isPositive: true, id: 2 },
    { question: "The provider effectively projects strong and credible conviction about the adequacy of the care provided when questioned adversely.", phrase: "Effectively explains adequacy of care under fire", isPositive: true, id: 3 },
    { question: "The provider demonstrates recognition of central versus incidental questions, not getting bogged down in peripheral inquiries.", phrase: "Recognizes core v. peripheral questions", isPositive: true, id: 4 },
    { question: "The provider retains a composed demeanor during challenging questions.", phrase: "Handles hypotheticals effectively", isPositive: true, id: 5 },
    { question: "The provider handles hypothetical questions well.", phrase: "Answers directly not evasively", isPositive: true, id: 6 },
    { question: "The provider answers challenging questions head-on without evasiveness.", phrase: "Demonstrates master of medical issues", isPositive: true, id: 7 },
    { question: "The provider projects mastery of the medical issues in the case.", phrase: "Conveys medical issues clearly and simply", isPositive: true, id: 8 },
    { question: "The provider conveys medical concepts in a clear and comprehensible manner.", phrase: "Demonstrates English language proficiency", isPositive: true, id: 9 },
    { question: "The provider's English language proficiency does not impede clear communication.", phrase: "Maintains composure when facing ridicule", isPositive: true, id: 10 },
    { question: "The provider maintains composure and retains a dignified presence in the face of aggression/ridicule from the questioner.", phrase: "Projects integrity, good faith, credibility", isPositive: true, id: 11 },
    { question: "The provider robustly projects integrity, good-faith, and credibility.", phrase: "Retains integrity and verbal clarity under fire", isPositive: true, id: 12 },
    { question: "The provider becomes intimidated and at times at a loss for words during adverse questioning.", phrase: "Demonstrates comprehension of questions", isPositive: false, id: 13 },
    { question: "The provider sometimes exhibits problems with comprehension of important questions asked.", phrase: "Shows humility and responsiveness versus arrogance/dismissiveness", isPositive: false, id: 14 },
    { question: "The provider too often conveys problematic dismissiveness/arrogance in their response style.", phrase: "Not unduly hampered by anxiety", isPositive: true, id: 15 }
];

// Function to add predefined questions to the database
const addPredefinedQuestions = async () => {
    console.log("Adding Questions");
    try {
        // Loop through predefined questions
        for (const questionData of predefinedQuestions) {
            // Check if the question already exists in the database
            const existingQuestion = await Question.findOne({ id: questionData.id });
            if (!existingQuestion) {
                // If the question doesn't exist, add it to the database
                console.log('Question Donot');
                const newQuestion = new Question(questionData);
                await newQuestion.save();
                console.log(`Question with id ${questionData.id} added to the database.`);
            } else {
                console.log(`Question with id ${questionData.id} already exists in the database.`);
            }
        }
    } catch (err) {
        console.error('Error adding predefined questions:', err);
    }
};

// Basic health check endpoint
app.get("/", (req, res) => {
    // addPredefinedQuestions();
    res.json(`Server is running`);

});

// CRUD Operations

// Create a new question
app.post('/api/add-question', async (req, res) => {
    const { newQuestion, newPhrase, isPositive, index } = req.body;
    if (!newQuestion || !newPhrase || typeof isPositive === 'undefined' || typeof index === 'undefined') {
        return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    try {
        // Step 1: Fetch all questions with id >= index and sort them in descending order
        const questionsToShift = await Question.find({ id: { $gte: Number(index+1) } }).sort({ id: -1 });

        // Step 2: Increment the ids one by one to prevent duplicate id conflict
        for (const question of questionsToShift) {
            question.id += 1;
            await question.save();
        }

        // Step 3: Now create the new question with the given index (id)
        const newQuestionObj = new Question({
            question: newQuestion,
            phrase: newPhrase,
            isPositive,
            id: Number(index+1)
        });

        // Step 4: Save the new question
        await newQuestionObj.save();

        res.json({ success: true, message: 'Question added successfully' });
    } catch (err) {
        console.error('Error adding question:', err);
        res.status(500).json({ success: false, message: 'Error adding question' });
    }
});



// Update an existing question
app.post('/api/update-data', async (req, res) => {
    const { id, question, phrase, isPositive } = req.body;

    try {
        const updatedQuestion = await Question.findOneAndUpdate(
            { id },
            {
                $set: {
                    question: question || undefined,
                    phrase: phrase || undefined,
                    isPositive: typeof isPositive === 'boolean' ? isPositive : undefined
                }
            },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        res.json({ success: true, message: 'Data updated successfully', updatedQuestion });
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ success: false, message: 'Error updating data' });
    }
});

// Delete a question
app.delete('/api/delete-question/:id', async (req, res) => {
    const questionId = parseInt(req.params.id, 10);

    if (isNaN(questionId)) {
        return res.status(400).json({ success: false, message: 'Invalid question ID' });
    }

    try {
        // First, delete the question with the specified questionId
        const deletedQuestion = await Question.findOneAndDelete({ id: questionId });

        if (!deletedQuestion) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        // Then, decrement the id of all questions with id > questionId (after deletion)
        await Question.updateMany(
            { id: { $gt: questionId } },   // Select questions with id > deleted question's id
            { $inc: { id: -1 } }           // Decrement their id by 1
        );

        res.json({ success: true, message: 'Question deleted and IDs updated successfully' });
    } catch (err) {
        console.error('Error deleting question:', err);
        res.status(500).json({ success: false, message: 'Error deleting question' });
    }
});


// Fetch all questions
app.get('/api/data', async (req, res) => {
    try {
        // Fetch and sort questions by 'id' in ascending order
        const questions = await Question.find({}).sort({ id: 1 });
        res.json(questions);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
