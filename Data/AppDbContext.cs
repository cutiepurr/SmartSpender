using Microsoft.EntityFrameworkCore;
using SmartSpender;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Transaction> Transaction { get; set; } = default!;

    public DbSet<Category> Category { get; set; } = default!;

    public DbSet<Account> Account { get; set; } = default!;

    public DbSet<MonthlyTarget> MonthlyTarget { get; set; } = default!;
}