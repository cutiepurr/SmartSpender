using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace SmartSpender.Controllers.FilterAttributes;

public class EmailFilter : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var controller = context.Controller as AuthorizedControllerBase;
        var email = await GetUserEmailFromToken(context);

        if (email == null) context.Result = new BadRequestObjectResult("Not authenticated");
        else if (controller != null) controller.Email = email;

        await next();
    }

    private async Task<Account?> GetUser(ActionExecutingContext context)
    {
        var token = await context.HttpContext.GetTokenAsync("access_token");
        if (token == null) return null;

        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
        var result = await client.GetStreamAsync("https://linh-nguyen.au.auth0.com/userinfo");
        return await JsonSerializer.DeserializeAsync<Account>(result);
    }

    private async Task<string?> GetUserEmailFromToken(ActionExecutingContext context)
    {
        var email = context.HttpContext.Session.GetString("UserEmail");
        if (!string.IsNullOrEmpty(email)) return email;

        var user = await GetUser(context);
        if (user == null) return null;

        context.HttpContext.Session.SetString("UserEmail", user.Email);
        return user.Email;
    }
}