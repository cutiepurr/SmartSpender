using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace SmartSpender.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Transactions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransaction(
        int page = 0, int count = 50, int year = -1, int month = -1)
    {
        if (_context.Transaction == null) return NotFound();

        var email = await GetUserEmailFromToken();
        if (email == null) return NotFound();

        var transactions = GetTransactionByEmail(_context.Transaction, email);
        transactions = GetTransactionByYearMonth(transactions, year, month);

        var paginatedTransactions = transactions
            .OrderByDescending(transaction => transaction.Timestamp)
            .Skip(page * count).Take(count);

        if (!paginatedTransactions.Any()) return NotFound();
        return await paginatedTransactions.ToListAsync();
    }

    // GET: api/Transactions/count
    [HttpGet("count")]
    public async Task<ActionResult<int>> GetCountTransaction(int year = -1, int month = -1)
    {
        if (_context.Transaction == null) return NotFound();

        var email = await GetUserEmailFromToken();
        if (email == null) return NotFound();

        var transactions = GetTransactionByEmail(_context.Transaction, email);
        transactions = GetTransactionByYearMonth(transactions, year, month);

        return await transactions.CountAsync();
    }

    // GET: api/Transactions/amount
    [HttpGet("amount")]
    public async Task<ActionResult<double>> GetTotalAmount(CategoryType? categoryType = null, int year = -1,
        int month = -1)
    {
        if (_context.Transaction == null) return NotFound();

        var email = await GetUserEmailFromToken();
        if (email == null) return NotFound();

        var transactions = GetTransactionByEmail(_context.Transaction, email);
        transactions = GetTransactionByYearMonth(transactions, year, month);
        transactions = GetTransactionByCategory(transactions, categoryType);

        return await transactions.SumAsync(transaction => transaction.Amount);
    }

    // GET: api/Transactions/amount/during
    [HttpGet("amount/during")]
    public async Task<ActionResult<IEnumerable<object>>> GetAmountsFromMonthToMonth(
        CategoryType? categoryType = null, int startYear = -1, int startMonth = -1, int endYear = -1, int endMonth = -1)
    {
        if (_context.Transaction == null) return NotFound();

        var email = await GetUserEmailFromToken();
        if (email == null) return NotFound();

        var transactions = GetTransactionByEmail(_context.Transaction, email);
        transactions = GetTransactionDuring(transactions, startYear, startMonth, endYear, endMonth);
        transactions = GetTransactionByCategory(transactions, categoryType);

        var result = from transaction in transactions
            group transaction by new { transaction.Timestamp.Month, transaction.Timestamp.Year }
            into grouped
            select new
            {
                grouped.Key.Month,
                grouped.Key.Year,
                Amount = grouped.Sum(i3 => i3.Amount)
            };

        return await result.ToListAsync();
    }

    private static IQueryable<Transaction> GetTransactionByEmail(IQueryable<Transaction> transactions, string email)
    {
        return transactions.Where(item => item.Email == email);
    }

    private IQueryable<Transaction> GetTransactionByCategory(IQueryable<Transaction> transactions,
        CategoryType? categoryType)
    {
        var categories = _context.TransactionCategory;
        return from transaction in transactions
            join category in categories on transaction.CategoryID equals category.ID
            where categoryType == null || category.CategoryType == categoryType.Value
            select transaction;
    }

    private IQueryable<Transaction> GetTransactionByYearMonth(IQueryable<Transaction> transactions, int year = -1,
        int month = -1)
    {
        return GetTransactionDuring(transactions, year, month, year, month);
    }

    private IQueryable<Transaction> GetTransactionDuring(IQueryable<Transaction> transactions,
        int startYear = -1, int startMonth = -1, int endYear = -1, int endMonth = -1)
    {
        if (startYear != -1)
        {
            transactions = transactions.Where(transaction => transaction.Timestamp.Year >= startYear);

            if (startMonth != -1)
            {
                var startDate = new DateTime(startYear, startMonth, 1);
                transactions = transactions.Where(transaction => transaction.Timestamp.CompareTo(startDate) >= 0);
            }
        }

        if (endYear != -1)
        {
            transactions = transactions.Where(transaction => transaction.Timestamp.Year <= endYear);

            if (endMonth != -1)
            {
                var endDate = new DateTime(endYear, endMonth, DateTime.DaysInMonth(endYear, endMonth));
                transactions = transactions.Where(transaction => transaction.Timestamp.CompareTo(endDate) <= 0);
            }
        }

        return transactions;
    }

    // GET: api/Transactions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetTransaction(long id)
    {
        if (_context.Transaction == null) return NotFound();
        var transaction = await _context.Transaction.FindAsync(id);

        if (transaction == null) return NotFound();

        return transaction;
    }

    // PUT: api/Transactions/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTransaction(long id, Transaction transaction)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return NotFound();

        if (id != transaction.ID) return BadRequest();
        if (transaction.Email != email) return Unauthorized();

        _context.Entry(transaction).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TransactionExists(id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    // POST: api/Transactions
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
    {
        if (_context.Transaction == null) return Problem("Entity set 'AppDbContext.Transaction'  is null.");
        var email = await GetUserEmailFromToken();
        if (email == null) return NotFound();
        if (transaction.Email != email) return Unauthorized();

        _context.Transaction.Add(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTransaction", new { id = transaction.ID }, transaction);
    }

    // DELETE: api/Transactions/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(long id)
    {
        if (_context.Transaction == null) return NotFound();
        var transaction = await _context.Transaction.FindAsync(id);
        if (transaction == null) return NotFound();

        var email = await GetUserEmailFromToken();
        if (email == null) return NotFound();
        if (transaction.Email != email) return Unauthorized();

        _context.Transaction.Remove(transaction);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Transactions
    [HttpDelete]
    public async Task<IActionResult> DeleteTransactions(IEnumerable<long> idList)
    {
        if (_context.Transaction == null) return NotFound();
        var email = await GetUserEmailFromToken();
        if (email == null) return NotFound();

        var transactions = _context.Transaction.Where(item => idList.Contains(item.ID));

        if (transactions.IsNullOrEmpty()) return NotFound();
        if (transactions.Any(item => item.Email != email)) return Unauthorized();

        _context.Transaction.RemoveRange(transactions);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TransactionExists(long id)
    {
        return (_context.Transaction?.Any(e => e.ID == id)).GetValueOrDefault();
    }

    private static async Task<Account?> GetUser(string? token)
    {
        if (token == null) return null;

        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
        var result = await client.GetStreamAsync("https://linh-nguyen.au.auth0.com/userinfo");
        return await JsonSerializer.DeserializeAsync<Account>(result);
    }

    private async Task<string?> GetUserEmailFromToken()
    {
        var email = HttpContext.Session.GetString("UserEmail");
        if (!string.IsNullOrEmpty(email)) return email;

        var accessToken = await HttpContext.GetTokenAsync("access_token");
        var user = await GetUser(accessToken);
        if (user == null) return null;

        HttpContext.Session.SetString("UserEmail", user.Email);
        return user.Email;
    }
}