using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSpender.Controllers.FilterAttributes;

namespace SmartSpender.Controllers;

[Authorize]
[EmailFilter]
[ApiController]
public abstract class AuthorizedApiControllerBase : ControllerBase
{
    public string Email { get; set; }
}