namespace SmartSpender.Extensions;

public static class DateTimeExtensions
{
    public static DateTime GetLastDateOfMonth(int year, int month)
    {
        return new DateTime(year, month, DateTime.DaysInMonth(year, month), 23, 59, 59);
    }
}