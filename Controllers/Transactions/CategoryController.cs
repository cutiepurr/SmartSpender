using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public async Task<ActionResult<IEnumerable<Category>>> GetTransactionCategory()
        {
            if (_context.Category.IsNullOrEmpty()) await PostDefaultCategory();

            if (_context.Category == null) return NotFound();
            
            return await _context.Category.ToListAsync();
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        public ActionResult<Category> GetTransactionCategory(int id)
        {
            if (_context.Category.IsNullOrEmpty()) PostDefaultCategory();
            return DefaultCategory.Categories[id];
        }

        // POST: api/Category
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        private async Task<ActionResult<Category>> PostTransactionCategory(Category category)
        {
            if (_context.Category == null)
            {
                return Problem("Entity set 'AppDbContext.Category'  is null.");
            }
            _context.Category.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransactionCategory", new { id = category.CategoryId }, category);
        }

        private async Task<ActionResult<IEnumerable<Category>>> PostDefaultCategory()
        {
            var categories = new List<Category>();
            foreach (var category in DefaultCategory.Categories)
            {
                var temp = await PostTransactionCategory(category);
                if (temp.Value != null) categories.Add(temp.Value);
            }
            return categories;
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        private async Task<IActionResult> DeleteTransactionCategory(long id)
        {
            if (_context.Category == null)
            {
                return NotFound();
            }
            var transactionCategory = await _context.Category.FindAsync(id);
            if (transactionCategory == null)
            {
                return NotFound();
            }

            _context.Category.Remove(transactionCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Category
        [HttpDelete]
        private async Task<IActionResult> DeleteAllCategories() {
            if (_context.Category == null)
            {
                return NotFound();
            }

            _context.Category.RemoveRange(_context.Category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
