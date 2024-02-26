using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartSpender.Extensions;

namespace SmartSpender.Controllers;

[Route("api/[controller]")]
public class MonthlyTargetController(AppDbContext context) : AuthorizedApiControllerBase
{
    private IQueryable<MonthlyTarget> Targets => context.MonthlyTarget.Where(item => item.Email == Email);
    
    // GET: api/MonthlyTarget
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MonthlyTarget>>> GetMonthlyTarget()
    {
        return await Targets.ToListAsync();
    }

    // GET: api/MonthlyTarget/latest
    [HttpGet("latest")]
    public async Task<ActionResult<MonthlyTarget>> GetLatestMonthlyTarget()
    {
        return (await Targets.OrderBy(item => item.Year).ThenBy(item => item.Month).LastOrDefaultAsync())!;
    }

    // GET: api/MonthlyTarget/{year}/{month}
    [HttpGet("{year}/{month}")]
    public async Task<ActionResult<MonthlyTarget>> GetMonthlyTarget(int year, int month)
    {
        var targetDate = DateTimeExtensions.GetLastDateOfMonth(year, month);

        if (Targets.IsNullOrEmpty()) return NotFound();

        var monthlyTarget = (await Targets.ToListAsync())
                            .Where(item => item.Until != null && item.Until.Value.CompareTo(targetDate) >= 0)
                            .OrderBy(item => item.Year).ThenBy(item => item.Month).FirstOrDefault() ??
                            await Targets.FirstOrDefaultAsync(item => item.Until == null);

        if (monthlyTarget == null) return NotFound();

        return monthlyTarget;
    }

    // GET: api/MonthlyTarget/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MonthlyTarget>> GetMonthlyTarget(Guid id)
    {
        var monthlyTarget = await context.MonthlyTarget.FindAsync(id);

        if (monthlyTarget == null) return NotFound();

        if (monthlyTarget.Email != Email) return Forbid();

        return monthlyTarget;
    }

    // PUT: api/MonthlyTarget/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMonthlyTarget(Guid id, MonthlyTarget monthlyTarget)
    {
        if (id != monthlyTarget.Id) return BadRequest();

        if (monthlyTarget.Email != Email) return Forbid();

        if (Targets.Where(item => item.Id != id)
            .Any(item => item.Year == monthlyTarget.Year && item.Month == monthlyTarget.Month))
        {
            return BadRequest("Timestamp already exists");
        }

        if (monthlyTarget.Amount < 0) return BadRequest("Target amount must be positive");

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
        if (monthlyTarget.Email != Email) return Forbid();

        if (Targets.Any(item => item.Year == monthlyTarget.Year && item.Month == monthlyTarget.Month))
        {
            return BadRequest("Timestamp already exists");
        }
        
        if (monthlyTarget.Amount < 0) return BadRequest("Target amount must be positive");

        context.MonthlyTarget.Add(monthlyTarget);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetMonthlyTarget", new { id = monthlyTarget.Id }, monthlyTarget);
    }

    // DELETE: api/MonthlyTarget/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMonthlyTarget(Guid id)
    {
        var monthlyTarget = await context.MonthlyTarget.FindAsync(id);
        if (monthlyTarget == null) return NotFound();

        if (monthlyTarget.Email != Email) return Forbid();

        context.MonthlyTarget.Remove(monthlyTarget);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool MonthlyTargetExists(Guid id)
    {
        return context.MonthlyTarget.Any(e => e.Id == id);
    }
}