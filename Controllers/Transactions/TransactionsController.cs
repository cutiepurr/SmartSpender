using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace SmartSpender.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class TransactionsController(AppDbContext context) : AuthorizedControllerBase
{
    // GET: api/Transactions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransaction(
        int page = 0, int count = 50, int year = -1, int month = -1)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        var transactions = new TransactionFilter(context).ByEmail(email)
            .FromDate(year, month).ToDate(year, month).Apply();

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
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        var transactions = new TransactionFilter(context).ByEmail(email)
            .FromDate(year, month).ToDate(year, month).Apply();

        return await transactions.CountAsync();
    }

    // GET: api/Transactions/amount
    [HttpGet("amount")]
    public async Task<ActionResult<double>> GetTotalAmount(CategoryType? categoryType = null, int year = -1,
        int month = -1)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        var transactions = new TransactionFilter(context).ByEmail(email).ByCategory(categoryType)
            .FromDate(year, month).ToDate(year, month).Apply();

        return await transactions.SumAsync(transaction => transaction.Amount);
    }

    // GET: api/Transactions/amount/during
    [HttpGet("amount/during")]
    public async Task<ActionResult<IEnumerable<object>>> GetAmountsFromMonthToMonth(
        CategoryType? categoryType = null, int startYear = -1, int startMonth = -1, int endYear = -1, int endMonth = -1)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        var transactions = new TransactionFilter(context).ByEmail(email).ByCategory(categoryType)
            .FromDate(startYear, startMonth).ToDate(endYear, endMonth).Apply();

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

    // GET: api/Transactions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetTransaction(Guid id)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();
        
        var transaction = await context.Transaction.FindAsync(id);

        if (transaction == null) return NotFound();
        if (transaction.Email != email) return Forbid();

        return transaction;
    }

    // PUT: api/Transactions/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTransaction(Guid id, Transaction transaction)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        if (id != transaction.Id) return BadRequest();
        
        if (transaction.Email != email) return Forbid();

        context.Entry(transaction).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TransactionExists(id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // POST: api/Transactions
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();
        
        if (transaction.Email != email) return Forbid();

        context.Transaction.Add(transaction);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetTransaction", new { id = transaction.Id }, transaction);
    }

    // DELETE: api/Transactions/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(Guid id)
    {
        var transaction = await context.Transaction.FindAsync(id);
        if (transaction == null) return NotFound();

        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();
        
        if (transaction.Email != email) return Forbid();

        context.Transaction.Remove(transaction);
        await context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Transactions
    [HttpDelete]
    public async Task<IActionResult> DeleteTransactions(IEnumerable<Guid> idList)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        var transactions = context.Transaction.Where(item => idList.Contains(item.Id));

        if (transactions.IsNullOrEmpty()) return NotFound();
        if (transactions.Any(item => item.Email != email)) return Forbid();

        context.Transaction.RemoveRange(transactions);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool TransactionExists(Guid id)
    {
        return (context.Transaction?.Any(e => e.Id == id)).GetValueOrDefault();
    }
}