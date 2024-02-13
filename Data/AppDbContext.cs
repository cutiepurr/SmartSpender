using Microsoft.EntityFrameworkCore;

using SmartSpender;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Transaction> Transaction { get; set; } = default!;

    public DbSet<TransactionCategory> TransactionCategory { get; set; } = default!;

    public DbSet<Account> Account { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Transaction>()
            .HasOne(e => e.Category)
            .WithMany()
            .HasForeignKey(e => e.CategoryID)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .IsRequired();
    }
}

