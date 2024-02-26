using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace SmartSpender.Controllers;

[Route("api/[controller]")]
public class TransactionsController(AppDbContext context) : AuthorizedApiControllerBase
{
    // GET: api/Transactions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransaction(
        int page = 0, int count = 50, int year = -1, int month = -1)
    {
        var transactions = new TransactionFilter(context).ByEmail(Email)
            .FromDate(year, month).ToDate(year, month).Apply();

        var paginatedTransactions = transactions
            .OrderByDescending(transaction => transaction.Timestamp)
            .Skip(page * count).Take(count);

        if (!paginatedTransactions.Any()) return NoContent();
        return await paginatedTransactions.ToListAsync();
    }

    // GET: api/Transactions/count
    [HttpGet("count")]
    public async Task<ActionResult<int>> GetCountTransaction(int year = -1, int month = -1)
    {
        var transactions = new TransactionFilter(context).ByEmail(Email)
            .FromDate(year, month).ToDate(year, month).Apply();

        return await transactions.CountAsync();
    }

    // GET: api/Transactions/amount
    [HttpGet("amount")]
    public async Task<ActionResult<object>> GetTotalAmount(int year = -1, int month = -1)
    {
        var wantTransactions = new TransactionFilter(context).ByEmail(Email).ByCategory(CategoryType.Want)
            .FromDate(year, month).ToDate(year, month).Apply();

        var needTransaction = new TransactionFilter(context).ByEmail(Email).ByCategory(CategoryType.Need)
            .FromDate(year, month).ToDate(year, month).Apply();

        var wants = await wantTransactions.SumAsync(transaction => transaction.Amount);
        var needs = await needTransaction.SumAsync(transaction => transaction.Amount);

        return new
        {
            Wants = wants,
            Needs = needs,
            Total = wants + needs
        };
    }
    
    // GET: api/Transactions/amount/category
    [HttpGet("amount/category")]
    public async Task<ActionResult<List<object>>> GetTotalAmountByCategory(int year = -1, int month = -1)
    {
        var transactions = new TransactionFilter(context).ByEmail(Email)
            .FromDate(year, month).ToDate(year, month).Apply();

        var result = new List<object>();
        foreach (var category in await context.Category.ToListAsync())
        {
            var amount = await transactions.Where(item => item.CategoryId == category.CategoryId)
                .SumAsync(item => item.Amount);
            result.Add(new
            {
                Amount = amount,
                Category = category
            });
        }

        return result;
    }
    

    // GET: api/Transactions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetTransaction(Guid id)
    {
        var transaction = await context.Transaction.FindAsync(id);

        if (transaction == null) return NotFound();
        if (transaction.Email != Email) return Forbid();

        return transaction;
    }

    // PUT: api/Transactions/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTransaction(Guid id, Transaction transaction)
    {
        if (id != transaction.Id) return BadRequest();

        if (transaction.Email != Email) return Forbid();

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
        if (transaction.Email != Email) return Forbid();

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

        if (transaction.Email != Email) return Forbid();

        context.Transaction.Remove(transaction);
        await context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Transactions
    [HttpDelete]
    public async Task<IActionResult> DeleteTransactions(IEnumerable<Guid> idList)
    {
        var transactions = context.Transaction.Where(item => idList.Contains(item.Id));

        if (transactions.IsNullOrEmpty()) return NotFound();
        if (transactions.Any(item => item.Email != Email)) return Forbid();

        context.Transaction.RemoveRange(transactions);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool TransactionExists(Guid id)
    {
        return (context.Transaction?.Any(e => e.Id == id)).GetValueOrDefault();
    }
}