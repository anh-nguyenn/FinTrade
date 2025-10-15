package com.fintrade.controller;

import com.fintrade.entity.Portfolio;
import com.fintrade.entity.User;
import com.fintrade.service.PortfolioService;
import com.fintrade.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<Portfolio>> getAllPortfolios(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Portfolio> portfolios = portfolioService.getPortfoliosByUser(user);
        return ResponseEntity.ok(portfolios);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Portfolio>> searchPortfolios(@RequestParam String symbol,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Portfolio> portfolios = portfolioService.searchPortfoliosBySymbol(user, symbol);
        return ResponseEntity.ok(portfolios);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, BigDecimal>> getPortfolioSummary(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        BigDecimal totalValue = portfolioService.getTotalPortfolioValue(user);
        BigDecimal totalProfitLoss = portfolioService.getTotalProfitLoss(user);

        return ResponseEntity.ok(Map.of(
                "totalValue", totalValue,
                "totalProfitLoss", totalProfitLoss));
    }

    @PostMapping("/add")
    public ResponseEntity<Portfolio> addToPortfolio(@RequestBody Map<String, Object> request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        String symbol = (String) request.get("symbol");
        String companyName = (String) request.get("companyName");
        BigDecimal quantity = new BigDecimal(request.get("quantity").toString());
        BigDecimal price = new BigDecimal(request.get("price").toString());

        Portfolio portfolio = portfolioService.addToPortfolio(user, symbol, companyName, quantity, price);
        return ResponseEntity.ok(portfolio);
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeFromPortfolio(@RequestBody Map<String, Object> request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        String symbol = (String) request.get("symbol");
        BigDecimal quantity = new BigDecimal(request.get("quantity").toString());

        Portfolio portfolio = portfolioService.removeFromPortfolio(user, symbol, quantity);

        if (portfolio == null) {
            return ResponseEntity.ok(Map.of("message", "Portfolio item removed successfully"));
        } else {
            return ResponseEntity.ok(portfolio);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Portfolio> updatePortfolio(@PathVariable Long id, @RequestBody Portfolio portfolio,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Optional<Portfolio> existingPortfolio = portfolioService.getPortfolioByUserAndSymbol(user,
                portfolio.getSymbol());
        if (existingPortfolio.isPresent() && existingPortfolio.get().getId().equals(id)) {
            portfolio.setId(id);
            portfolio.setUser(user);
            Portfolio updatedPortfolio = portfolioService.updatePortfolio(portfolio);
            return ResponseEntity.ok(updatedPortfolio);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePortfolio(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Optional<Portfolio> portfolio = portfolioService.getPortfolioByUserAndSymbol(user, "");
        if (portfolio.isPresent() && portfolio.get().getId().equals(id)) {
            portfolioService.deletePortfolio(id);
            return ResponseEntity.ok(Map.of("message", "Portfolio item deleted successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
