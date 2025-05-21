const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect('mongodb+srv://awaisalibusiness:awais123@may20.bxapq2s.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String, // 'income' or 'expense'
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes
app.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        const balance = transactions.reduce((acc, curr) => {
            return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
        }, 0);
        res.render('index', { transactions, balance });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/transaction', async (req, res) => {
    try {
        const { description, amount, type } = req.body;
        const transaction = new Transaction({
            description,
            amount: parseFloat(amount),
            type
        });
        await transaction.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.delete('/transaction/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 