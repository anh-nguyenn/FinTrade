package com.fintrade.repository;

import com.fintrade.entity.Transaction;
import com.fintrade.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);

    List<Transaction> findByUserOrderByTransactionDateDesc(User user);

    List<Transaction> findByUserAndSymbol(User user, String symbol);

    List<Transaction> findByUserAndTransactionType(User user, Transaction.TransactionType transactionType);

    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserAndTransactionDateBetween(@Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND t.symbol LIKE %:symbol% ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserAndSymbolContainingIgnoreCase(@Param("user") User user, @Param("symbol") String symbol);
}
