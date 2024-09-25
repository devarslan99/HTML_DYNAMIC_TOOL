import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true }, // Text of the question
    phrase: { type: String, required: true },   // Related phrase
    isPositive: { type: Boolean, required: true }, // Boolean flag to mark positivity
    id: { type: Number, required: true, unique: true }  // Unique identifier
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
