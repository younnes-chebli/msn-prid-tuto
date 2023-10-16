using Microsoft.AspNetCore.Authorization;
using prid_tuto.Models;

namespace prid_tuto.Helpers;

public class AuthorizedAttribute : AuthorizeAttribute
{
    public AuthorizedAttribute(params Role[] roles) : base() {
        var rolesNames = new List<string>();
        var names = Enum.GetNames(typeof(Role));
        foreach (var role in roles) {
            rolesNames.Add(names[(int)role]);
        }
        Roles = String.Join(",", rolesNames);
    }
}
