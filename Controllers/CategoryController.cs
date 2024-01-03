using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SmartSpender.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Category
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionCategory>>> GetTransactionCategory()
        {
          if (_context.TransactionCategory == null)
          {
              return NotFound();
          }
            return await _context.TransactionCategory.ToListAsync();
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionCategory>> GetTransactionCategory(long id)
        {
          if (_context.TransactionCategory == null)
          {
              return NotFound();
          }
            var transactionCategory = await _context.TransactionCategory.FindAsync(id);

            if (transactionCategory == null)
            {
                return NotFound();
            }

            return transactionCategory;
        }

        // PUT: api/Category/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransactionCategory(long id, TransactionCategory transactionCategory)
        {
            if (id != transactionCategory.ID)
            {
                return BadRequest();
            }

            _context.Entry(transactionCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionCategoryExists(id))
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

        // POST: api/Category
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TransactionCategory>> PostTransactionCategory(TransactionCategory transactionCategory)
        {
          if (_context.TransactionCategory == null)
          {
              return Problem("Entity set 'AppDbContext.TransactionCategory'  is null.");
          }
            _context.TransactionCategory.Add(transactionCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransactionCategory", new { id = transactionCategory.ID }, transactionCategory);
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransactionCategory(long id)
        {
            if (_context.TransactionCategory == null)
            {
                return NotFound();
            }
            var transactionCategory = await _context.TransactionCategory.FindAsync(id);
            if (transactionCategory == null)
            {
                return NotFound();
            }

            _context.TransactionCategory.Remove(transactionCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TransactionCategoryExists(long id)
        {
            return (_context.TransactionCategory?.Any(e => e.ID == id)).GetValueOrDefault();
        }
    }
}
