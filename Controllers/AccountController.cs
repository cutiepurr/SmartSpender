using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SmartSpender.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController(AppDbContext context) : ControllerBase
{
    // GET: api/Account
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Account>>> GetAccount()
    {
        return await context.Account.ToListAsync();
    }

    // GET: api/Account/5
    [HttpGet("{email}")]
    public async Task<ActionResult<Account>> GetAccount(string email)
    {
        var account = await context.Account.FindAsync(email);

        if (account == null) return NotFound();

        return account;
    }

    // PUT: api/Account/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{email}")]
    public async Task<IActionResult> PutAccount(string email, Account account)
    {
        if (email != account.Email) return BadRequest();

        context.Entry(account).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AccountExists(email))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    // POST: api/Account
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Account>> PostAccount(Account account)
    {
        if (AccountExists(account.Email)) return BadRequest();
        
        context.Account.Add(account);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetAccount", new { email = account.Email }, account);
    }

    // DELETE: api/Account/5
    [HttpDelete("{email}")]
    public async Task<IActionResult> DeleteAccount(string email)
    {
        var account = await context.Account.FindAsync(email);
        if (account == null) return NotFound();

        context.Account.Remove(account);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool AccountExists(string email)
    {
        return (context.Account?.Any(e => e.Email == email)).GetValueOrDefault();
    }
}