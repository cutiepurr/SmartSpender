using Microsoft.AspNetCore.Mvc;
using SmartSpender.Controllers.FilterAttributes;

namespace SmartSpender.Controllers;

[EmailFilter]
public abstract class AuthorizedControllerBase : ControllerBase
{
    public string Email { get; set; }
}