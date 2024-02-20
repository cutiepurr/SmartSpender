using Microsoft.EntityFrameworkCore;
using SmartSpender;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Transaction> Transaction { get; set; } = default!;

    public DbSet<Category> Category { get; set; } = default!;

    public DbSet<Account> Account { get; set; } = default!;
}