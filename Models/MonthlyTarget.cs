using System.ComponentModel.DataAnnotations;

namespace SmartSpender;

public class MonthlyTarget
{
    [Key] public Guid Id { get; set; }

    [MaxLength(50)] public string Email { get; set; } = default!;

    public int? Year { get; set; }

    public int? Month { get; set; }

    public double Amount { get; set; }

    public DateTime? Until
    {
        get
        {
            if (Year == null || Month == null) return null;
            
            return new DateTime(Year.Value, Month.Value, DateTime.DaysInMonth(Year.Value, Month.Value), 23, 59, 59);
        }
    }
}