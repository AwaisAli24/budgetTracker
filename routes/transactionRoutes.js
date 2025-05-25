const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Get all transactions
router.get('/', transactionController.getTransactions);

// Create a new transaction
router.post('/transaction', transactionController.createTransaction);

// Delete a transaction
router.delete('/transaction/:id', transactionController.deleteTransaction);

module.exports = router; 