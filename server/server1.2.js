import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import Question from './models/questionModel.js'; // Importing the Mongoose model

const app = express();
const PORT = 3000;

app.use(cors({
    origin: '*', // Allows all origins
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://saadumer5476:aaSSddFF%40123%23@html.uewjc.mongodb.net/?retryWrites=true&w=majority&appName=html', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Basic health check endpoint
app.get("/", (req, res) => {
    res.json(`Server is running`);
});

// Create a new question
app.post('/api/add-question', async (req, res) => {
    const { question, phrase, isPositive } = req.body;

    if (!question || !phrase || typeof isPositive === 'undefined') {
        return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    try {
        const lastQuestion = await Question.findOne().sort({ id: -1 });
        const newId = lastQuestion ? lastQuestion.id + 1 : 1;

        const newQuestion = new Question({
            question,
            phrase,
            isPositive,
            id: newId
        });

        await newQuestion.save();
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
        const deletedQuestion = await Question.findOneAndDelete({ id: questionId });

        if (!deletedQuestion) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        res.json({ success: true, message: 'Question deleted successfully' });
    } catch (err) {
        console.error('Error deleting question:', err);
        res.status(500).json({ success: false, message: 'Error deleting question' });
    }
});

// Fetch all questions
app.get('/api/data', async (req, res) => {
    try {
        const questions = await Question.find({});
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
