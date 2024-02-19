using Microsoft.EntityFrameworkCore;

using SmartSpender;
public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Transaction> Transaction { get; set; } = default!;

    public DbSet<Category> TransactionCategory { get; set; } = default!;

    public DbSet<Account> Account { get; set; } = default!;
}

