using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace SmartSpender.Controllers
{
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
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransaction(int page = 0, int count = 50, int year = -1, int month = -1)
        {
            if (_context.Transaction == null)
            {
                return NotFound();
            }

            var transactions = GetTransactionByYearMonth(year, month);

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
            if (_context.Transaction == null)
            {
                return NotFound();
            }

            var transactions = GetTransactionByYearMonth(year, month);

            return await transactions.CountAsync();
        }

        // GET: api/Transactions/amount
        [HttpGet("amount")]
        public async Task<ActionResult<double>> GetTotalAmount(CategoryType? type = null,int year = -1, int month = -1)
        {
            if (_context.Transaction == null)
            {
                return NotFound();
            }

            var transactions = GetTransactionByYearMonth(year, month);
            transactions = GetTransactionByCategory(transactions, type);

            return await transactions.SumAsync(transaction => transaction.Amount);
        }

        // GET: api/Transactions/amount/during
        [HttpGet("amount/during")]
        public async Task<ActionResult<IEnumerable<object>>> GetAmountsFromMonthToMonth(CategoryType? type = null, int startYear = -1, int startMonth = -1, int endYear = -1, int endMonth = -1)
        {
            if (_context.Transaction == null)
            {
                return NotFound();
            }

            var transactions = GetTransactionDuring(startYear, startMonth, endYear, endMonth);
            transactions = GetTransactionByCategory(transactions, type);

            var result = from transaction in transactions
            group transaction by new {transaction.Timestamp.Month, transaction.Timestamp.Year} into grouped
            select new {
                grouped.Key.Month,
                grouped.Key.Year,
                Amount = grouped.Sum(i3 => i3.Amount)
            };

            return await result.ToListAsync();
        }

        private IQueryable<Transaction> GetTransactionByCategory(IQueryable<Transaction> transactions, CategoryType? type) {
            return from transaction in transactions
            join category in _context.TransactionCategory on transaction.CategoryID equals category.ID
            where type == null || category.CategoryType == type.Value
            select transaction;
        }

        private IQueryable<Transaction> GetTransactionByYearMonth(int year = -1, int month = -1)
        {
            return GetTransactionDuring(year, month, year, month);
        }

        private IQueryable<Transaction> GetTransactionDuring(int startYear = -1, int startMonth = -1, int endYear = -1, int endMonth = -1)
        {
            IQueryable<Transaction> transactions = _context.Transaction;

            if (startYear != -1) {
                transactions = transactions.Where(transaction => transaction.Timestamp.Year >= startYear);

                if (startMonth == -1) {
                    var startDate = new DateTime(startYear, startMonth, 1);
                    transactions = transactions.Where(transaction => transaction.Timestamp.CompareTo(startDate) >= 0);
                }
            }

            if (endYear != -1) {
                transactions = transactions.Where(transaction => transaction.Timestamp.Year <= endYear);

                if (endMonth == -1) {
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
            if (_context.Transaction == null)
            {
                return NotFound();
            }
            var transaction = await _context.Transaction.FindAsync(id);

            if (transaction == null)
            {
                return NotFound();
            }

            return transaction;
        }

        // PUT: api/Transactions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(long id, Transaction transaction)
        {
            if (id != transaction.ID)
            {
                return BadRequest();
            }

            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Transactions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
        {
            if (_context.Transaction == null)
            {
                return Problem("Entity set 'AppDbContext.Transaction'  is null.");
            }
            _context.Transaction.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransaction", new { id = transaction.ID }, transaction);
        }

        // POST: api/Transactions/default
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("default")]
        public async Task<ActionResult<Transaction>> PostDefault()
        {
            if (_context.Transaction == null)
            {
                return Problem("Entity set 'AppDbContext.Transaction'  is null.");
            }
            var transaction = new Transaction()
            {
                ID = 0,
                Description = "Transaction 1",
                Timestamp = DateTime.Now,
                Amount = 100
            };

            _context.Transaction.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransaction", new { id = transaction.ID }, transaction);
        }

        // DELETE: api/Transactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(long id)
        {
            if (_context.Transaction == null)
            {
                return NotFound();
            }
            var transaction = await _context.Transaction.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transaction.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TransactionExists(long id)
        {
            return (_context.Transaction?.Any(e => e.ID == id)).GetValueOrDefault();
        }
    }
}
