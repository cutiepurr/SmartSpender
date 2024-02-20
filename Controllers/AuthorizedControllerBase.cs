using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace SmartSpender.Controllers;

public abstract class AuthorizedControllerBase : ControllerBase
{
    private async Task<Account?> GetUser()
    {
        var token = await HttpContext.GetTokenAsync("access_token");
        if (token == null) return null;

        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
        var result = await client.GetStreamAsync("https://linh-nguyen.au.auth0.com/userinfo");
        return await JsonSerializer.DeserializeAsync<Account>(result);
    }

    protected async Task<string?> GetUserEmailFromToken()
    {
        var email = HttpContext.Session.GetString("UserEmail");
        if (!string.IsNullOrEmpty(email)) return email;

        var user = await GetUser();
        if (user == null) return null;

        HttpContext.Session.SetString("UserEmail", user.Email);
        return user.Email;
    }
}