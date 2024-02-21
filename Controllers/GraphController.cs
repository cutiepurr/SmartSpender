using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace SmartSpender.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class GraphController(AppDbContext context) : AuthorizedControllerBase
{
    // GET: api/Graph/12month
    [HttpGet("12month")]
    public async Task<object> Get12MonthSpending()
    {
        var (year, month, _) = DateTime.Today;
        return new
        {
            Wants = await GetAmountsFromMonthToMonth(CategoryType.Want, year - 1, month, year, month),
            Needs = await GetAmountsFromMonthToMonth(CategoryType.Need, year - 1, month, year, month),
            Targets = await GetMonthlyTargetsFrom(year - 1, month)
        };
    }

    private async Task<IEnumerable<object>> GetAmountsFromMonthToMonth(
        CategoryType? categoryType = null, int startYear = -1, int startMonth = -1, int endYear = -1, int endMonth = -1)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return null!;

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

    private async Task<IEnumerable<MonthlyTarget>> GetMonthlyTargetsFrom(int year, int month)
    {
        var email = await GetUserEmailFromToken();
        if (email == null) return null!;

        var targetDate = GetLastDate(year, month);
        var targets = TargetsByEmail(email);

        if (targets.IsNullOrEmpty()) return targets;

        var monthlyTarget = (await targets.ToListAsync())
            .Where(item => item.Until != null && item.Until.Value.CompareTo(targetDate) >= 0)
            .OrderBy(item => item.Year).ThenBy(item => item.Month);

        return monthlyTarget.ToList();
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