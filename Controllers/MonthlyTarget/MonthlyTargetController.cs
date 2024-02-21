using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace SmartSpender.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class MonthlyTargetController(AppDbContext context) : AuthorizedControllerBase
{
    // GET: api/MonthlyTarget
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MonthlyTarget>>> GetMonthlyTarget()
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        var targets = TargetsByEmail(email);
        return await targets.ToListAsync();
    }

    // GET: api/MonthlyTarget/latest
    [HttpGet("latest")]
    public async Task<ActionResult<MonthlyTarget>> GetLatestMonthlyTarget()
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        var targets = TargetsByEmail(email);
        return (await targets.OrderBy(item => item.Year).ThenBy(item => item.Month).LastOrDefaultAsync())!;
    }

    // GET: api/MonthlyTarget/{year}/{month}
    [HttpGet("{year}/{month}")]
    public async Task<ActionResult<MonthlyTarget>> GetMonthlyTarget(int year, int month)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        var targetDate = GetLastDate(year, month);
        var targets = TargetsByEmail(email);

        if (targets.IsNullOrEmpty()) return NotFound();

        var monthlyTarget = (await targets.ToListAsync())
                            .Where(item => item.Until != null && item.Until.Value.CompareTo(targetDate) >= 0)
                            .OrderBy(item => item.Year).ThenBy(item => item.Month).FirstOrDefault() ??
                            await targets.FirstOrDefaultAsync(item => item.Until == null);

        if (monthlyTarget == null) return NotFound();

        return monthlyTarget;
    }

    // GET: api/MonthlyTarget/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MonthlyTarget>> GetMonthlyTarget(Guid id)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        var monthlyTarget = await context.MonthlyTarget.FindAsync(id);

        if (monthlyTarget == null) return NotFound();

        if (monthlyTarget.Email != email) return Forbid();

        return monthlyTarget;
    }

    // PUT: api/MonthlyTarget/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMonthlyTarget(Guid id, MonthlyTarget monthlyTarget)
    {
        if (id != monthlyTarget.Id) return BadRequest();

        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        if (monthlyTarget.Email != email) return Forbid();

        var targets = TargetsByEmail(email);
        if (targets.Where(item => item.Id != id)
            .Any(item => item.Year == monthlyTarget.Year && item.Month == monthlyTarget.Month)) return BadRequest();

        context.Entry(monthlyTarget).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MonthlyTargetExists(id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // POST: api/MonthlyTarget
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<MonthlyTarget>> PostMonthlyTarget(MonthlyTarget monthlyTarget)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        if (monthlyTarget.Email != email) return Forbid();

        var targets = TargetsByEmail(email);
        if (targets.Any(item => item.Year == monthlyTarget.Year && item.Month == monthlyTarget.Month))
        {
            return BadRequest("Timestamp already exists");
        }

        context.MonthlyTarget.Add(monthlyTarget);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetMonthlyTarget", new { id = monthlyTarget.Id }, monthlyTarget);
    }

    // DELETE: api/MonthlyTarget/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMonthlyTarget(Guid id)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return BadRequest();

        var monthlyTarget = await context.MonthlyTarget.FindAsync(id);
        if (monthlyTarget == null) return NotFound();

        if (monthlyTarget.Email != email) return Forbid();

        context.MonthlyTarget.Remove(monthlyTarget);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool MonthlyTargetExists(Guid id)
    {
        return context.MonthlyTarget.Any(e => e.Id == id);
    }

    private DateTime GetLastDate(int year, int month)
    {
        return new DateTime(year, month, DateTime.DaysInMonth(year, month), 23, 59, 59);
    }

    private IQueryable<MonthlyTarget> TargetsByEmail(string email)
    {
        return context.MonthlyTarget.Where(item => item.Email == email);
    }
}