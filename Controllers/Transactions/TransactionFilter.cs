using Microsoft.EntityFrameworkCore;

namespace SmartSpender.Controllers;

public class TransactionFilter
{
    private readonly AppDbContext _context;
    
    /// <summary>
    ///     Filter <paramref name="transactions" /> using the factory design pattern.
    /// </summary>
    /// <remarks>
    ///     Use provided methods to filter the transaction, e.g. <see cref="ByEmail" /> filters the transaction
    ///     by the provided email. Use <see cref="Apply" /> afterwards to obtain the filtered result.
    /// </remarks>
    public TransactionFilter(AppDbContext context)
    {
        _context = context;
        Transactions = context.Transaction;
    }

    private IQueryable<Transaction> Transactions { get; set; }

    public TransactionFilter ByEmail(string email)
    {
        Transactions = Transactions.Where(item => item.Email == email);
        return this;
    }

    public TransactionFilter ByCategory(CategoryType? categoryType)
    {
        if (categoryType == null) return this;
        Transactions = from transaction in Transactions
            join category in _context.Category on transaction.CategoryId equals category.CategoryId
            where category.CategoryType == categoryType.Value
            select transaction;
        return this;
    }

    public TransactionFilter FromDate(int startYear, int startMonth)
    {
        if (startYear != -1)
        {
            Transactions = Transactions.Where(transaction => transaction.Timestamp.Year >= startYear);

            if (startMonth != -1)
            {
                var startDate = new DateTime(startYear, startMonth, 1);
                Transactions = Transactions.Where(transaction => transaction.Timestamp.CompareTo(startDate) >= 0);
            }
        }

        return this;
    }

    public TransactionFilter ToDate(int endYear, int endMonth)
    {
        if (endYear != -1)
        {
            Transactions = Transactions.Where(transaction => transaction.Timestamp.Year <= endYear);

            if (endMonth != -1)
            {
                var endDate = new DateTime(endYear, endMonth, DateTime.DaysInMonth(endYear, endMonth));
                Transactions = Transactions.Where(transaction => transaction.Timestamp.CompareTo(endDate) <= 0);
            }
        }

        return this;
    }

    public IQueryable<Transaction> Apply()
    {
        return Transactions;
    }
}