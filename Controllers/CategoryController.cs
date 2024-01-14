using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

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
        public ActionResult<IEnumerable<TransactionCategory>> GetTransactionCategory()
        {
            if (_context.TransactionCategory.IsNullOrEmpty()) PostDefaultCategory();
            return DefaultCategory.Categories;
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        public ActionResult<TransactionCategory> GetTransactionCategory(int id)
        {
            if (_context.TransactionCategory.IsNullOrEmpty()) PostDefaultCategory();
            return DefaultCategory.Categories[id];
        }

        // POST: api/Category
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        private async Task<ActionResult<TransactionCategory>> PostTransactionCategory(TransactionCategory transactionCategory)
        {
            if (_context.TransactionCategory == null)
            {
                return Problem("Entity set 'AppDbContext.TransactionCategory'  is null.");
            }
            _context.TransactionCategory.Add(transactionCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransactionCategory", new { id = transactionCategory.ID }, transactionCategory);
        }

        private ActionResult<IEnumerable<TransactionCategory>> PostDefaultCategory()
        {
            var categories = new List<TransactionCategory>();
            DefaultCategory.Categories.ForEach(async category =>
            {
                var temp = await PostTransactionCategory(category);
                if (temp.Value != null) categories.Add(temp.Value);
            });
            return categories;
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

        // DELETE: api/Category
        [HttpDelete]
        public async Task<IActionResult> DeleteAllCategories() {
            if (_context.TransactionCategory == null)
            {
                return NotFound();
            }

            _context.TransactionCategory.RemoveRange(_context.TransactionCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
