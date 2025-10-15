package com.fintrade.service;

import com.fintrade.entity.Transaction;
import com.fintrade.entity.User;
import com.fintrade.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByUser(User user) {
        return transactionRepository.findByUserOrderByTransactionDateDesc(user);
    }

    public List<Transaction> getTransactionsByUserAndSymbol(User user, String symbol) {
        return transactionRepository.findByUserAndSymbol(user, symbol);
    }

    public List<Transaction> getTransactionsByUserAndType(User user, Transaction.TransactionType transactionType) {
        return transactionRepository.findByUserAndTransactionType(user, transactionType);
    }

    public List<Transaction> getTransactionsByUserAndDateRange(User user, LocalDateTime startDate,
            LocalDateTime endDate) {
        return transactionRepository.findByUserAndTransactionDateBetween(user, startDate, endDate);
    }

    public List<Transaction> searchTransactionsBySymbol(User user, String symbol) {
        return transactionRepository.findByUserAndSymbolContainingIgnoreCase(user, symbol);
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public Transaction updateTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    public List<Transaction> getRecentTransactions(User user, int limit) {
        List<Transaction> allTransactions = getTransactionsByUser(user);
        return allTransactions.stream()
                .limit(limit)
                .toList();
    }
}
