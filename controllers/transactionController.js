const Transaction = require('../models/Transaction');

// Get all transactions and calculate balance
exports.getTransactions = async (req, res) => {
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
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
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
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
}; 