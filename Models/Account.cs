using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SmartSpender;

public class Account
{
    [Key]
    [property: JsonPropertyName("email")]
    public required string Email { get; set; }
    
    [property: JsonPropertyName("given_name")]
    public string GivenName { get; set; } = null!;

    [property: JsonPropertyName("family_name")]
    public string FamilyName { get; set; } = null!;
}