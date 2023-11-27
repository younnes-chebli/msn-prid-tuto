using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_tuto.Models;

public enum Role
{
    Admin = 2, Manager = 1, Member = 0
}

public class Member
{
    [Key]
    public string Pseudo { get; set; } = "";
    public string Password { get; set; } = "";
    public string? FullName { get; set; }
    public DateTimeOffset? BirthDate { get; set; }
    public Role Role { get; set; } = Role.Member;

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

    [NotMapped]
    public string? Token { get; set; }

    public ICollection<Phone> Phones { get; set; } = new HashSet<Phone>();

}
