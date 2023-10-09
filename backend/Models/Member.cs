using System.ComponentModel.DataAnnotations;

namespace prid_tuto.Models;

public class Member
{
    [Key]
    public string Pseudo { get; set; } = "";
    public string Password { get; set; } = "";
    public string? FullName { get; set; }

    public DateTimeOffset? BirthDate { get; set; }

    public int? Age {
        get {
            if (!BirthDate.HasValue)
                return null;
            var today = DateTime.Today;
            var age = today.Year - BirthDate.Value.Year;
            if (BirthDate.Value.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}
