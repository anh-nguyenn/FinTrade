package com.fintrade.controller;

import com.fintrade.entity.Transaction;
import com.fintrade.entity.User;
import com.fintrade.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/all")
    public ResponseEntity<List<Transaction>> getAllTransactions(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Transaction> transactions = transactionService.getTransactionsByUser(user);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Transaction>> getRecentTransactions(@RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Transaction> transactions = transactionService.getRecentTransactions(user, limit);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Transaction>> searchTransactions(@RequestParam String symbol,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Transaction> transactions = transactionService.searchTransactionsBySymbol(user, symbol);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Transaction>> filterTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        List<Transaction> transactions;

        if (type != null) {
            Transaction.TransactionType transactionType = Transaction.TransactionType.valueOf(type.toUpperCase());
            transactions = transactionService.getTransactionsByUserAndType(user, transactionType);
        } else if (startDate != null && endDate != null) {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            transactions = transactionService.getTransactionsByUserAndDateRange(user, start, end);
        } else {
            transactions = transactionService.getTransactionsByUser(user);
        }

        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/create")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Map<String, Object> request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        String symbol = (String) request.get("symbol");
        String companyName = (String) request.get("companyName");
        Transaction.TransactionType transactionType = Transaction.TransactionType
                .valueOf(((String) request.get("transactionType")).toUpperCase());
        BigDecimal quantity = new BigDecimal(request.get("quantity").toString());
        BigDecimal price = new BigDecimal(request.get("price").toString());
        BigDecimal commission = request.get("commission") != null ? new BigDecimal(request.get("commission").toString())
                : BigDecimal.ZERO;
        String notes = (String) request.get("notes");

        Transaction transaction = new Transaction(symbol, companyName, transactionType, quantity, price, commission,
                notes, user);
        Transaction createdTransaction = transactionService.createTransaction(transaction);

        return ResponseEntity.ok(createdTransaction);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Transaction> transaction = transactionService.getTransactionById(id);

        if (transaction.isPresent() && transaction.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.ok(transaction.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction transaction,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Optional<Transaction> existingTransaction = transactionService.getTransactionById(id);
        if (existingTransaction.isPresent() && existingTransaction.get().getUser().getId().equals(user.getId())) {
            transaction.setId(id);
            transaction.setUser(user);
            Transaction updatedTransaction = transactionService.updateTransaction(transaction);
            return ResponseEntity.ok(updatedTransaction);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Optional<Transaction> transaction = transactionService.getTransactionById(id);
        if (transaction.isPresent() && transaction.get().getUser().getId().equals(user.getId())) {
            transactionService.deleteTransaction(id);
            return ResponseEntity.ok(Map.of("message", "Transaction deleted successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
