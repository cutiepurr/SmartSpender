using System.ComponentModel.DataAnnotations;

namespace SmartSpender;

public class Account
{
    public long Id { get; set; }
    
    [MaxLength(50)]
    public required string FirstName { get; set; }
    
    [MaxLength(50)]
    public required string LastName { get; set; }
    
    [MaxLength(50)]
    public required string Email { get; set; }
}