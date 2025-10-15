package com.fintrade.service;

import com.fintrade.entity.Portfolio;
import com.fintrade.entity.User;
import com.fintrade.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    public Portfolio createPortfolio(Portfolio portfolio) {
        return portfolioRepository.save(portfolio);
    }

    public List<Portfolio> getPortfoliosByUser(User user) {
        return portfolioRepository.findByUserOrderBySymbolAsc(user);
    }

    public Optional<Portfolio> getPortfolioByUserAndSymbol(User user, String symbol) {
        return portfolioRepository.findByUserAndSymbol(user, symbol);
    }

    public List<Portfolio> searchPortfoliosBySymbol(User user, String symbol) {
        return portfolioRepository.findByUserAndSymbolContainingIgnoreCase(user, symbol);
    }

    public Portfolio updatePortfolio(Portfolio portfolio) {
        return portfolioRepository.save(portfolio);
    }

    public void deletePortfolio(Long id) {
        portfolioRepository.deleteById(id);
    }

    public Portfolio addToPortfolio(User user, String symbol, String companyName,
            BigDecimal quantity, BigDecimal price) {
        Optional<Portfolio> existingPortfolio = getPortfolioByUserAndSymbol(user, symbol);

        if (existingPortfolio.isPresent()) {
            Portfolio portfolio = existingPortfolio.get();
            BigDecimal newQuantity = portfolio.getQuantity().add(quantity);
            BigDecimal newTotalCost = portfolio.getTotalCost().add(quantity.multiply(price));
            BigDecimal newAveragePrice = newTotalCost.divide(newQuantity, 2, BigDecimal.ROUND_HALF_UP);

            portfolio.setQuantity(newQuantity);
            portfolio.setAveragePrice(newAveragePrice);
            portfolio.setCurrentPrice(price); // Update current price

            return updatePortfolio(portfolio);
        } else {
            Portfolio newPortfolio = new Portfolio(symbol, companyName, quantity, price, price, user);
            return createPortfolio(newPortfolio);
        }
    }

    public Portfolio removeFromPortfolio(User user, String symbol, BigDecimal quantity) {
        Optional<Portfolio> existingPortfolio = getPortfolioByUserAndSymbol(user, symbol);

        if (existingPortfolio.isPresent()) {
            Portfolio portfolio = existingPortfolio.get();
            BigDecimal newQuantity = portfolio.getQuantity().subtract(quantity);

            if (newQuantity.compareTo(BigDecimal.ZERO) <= 0) {
                deletePortfolio(portfolio.getId());
                return null;
            } else {
                portfolio.setQuantity(newQuantity);
                return updatePortfolio(portfolio);
            }
        }

        return null;
    }

    public BigDecimal getTotalPortfolioValue(User user) {
        List<Portfolio> portfolios = getPortfoliosByUser(user);
        return portfolios.stream()
                .map(Portfolio::getTotalValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalProfitLoss(User user) {
        List<Portfolio> portfolios = getPortfoliosByUser(user);
        return portfolios.stream()
                .map(Portfolio::getProfitLoss)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
