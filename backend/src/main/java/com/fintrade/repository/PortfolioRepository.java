package com.fintrade.repository;

import com.fintrade.entity.Portfolio;
import com.fintrade.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    List<Portfolio> findByUser(User user);

    List<Portfolio> findByUserOrderBySymbolAsc(User user);

    Optional<Portfolio> findByUserAndSymbol(User user, String symbol);

    List<Portfolio> findByUserAndSymbolContainingIgnoreCase(User user, String symbol);
}
