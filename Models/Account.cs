using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SmartSpender;

public class Account
{
    public long Id { get; set; }
    
    [property: JsonPropertyName("given_name")]
    public string GivenName { get; set; } = null!;

    [property: JsonPropertyName("family_name")]
    public string FamilyName { get; set; } = null!;

    [property: JsonPropertyName("email")]
    public required string Email { get; set; }
}