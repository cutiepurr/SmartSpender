using Microsoft.EntityFrameworkCore;

using SmartSpender;
public class AppDbContext : DbContext
{
    private static List<string> DefaultCategories = new() {
        "Home", "Utilities", "Groceries", "Eating out", "Shopping", "Entertainment", "Others"
    };

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
        DefaultCategories.ForEach(category => TransactionCategory?.Add(new TransactionCategory(category)));
    }

    public DbSet<Transaction> Transaction { get; set; } = default!;

    public DbSet<TransactionCategory> TransactionCategory { get; set; }
}

