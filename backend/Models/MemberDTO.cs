namespace prid_tuto.Models;

public class MemberDTO
{
    public string Pseudo { get; set; } = "";
    public string? FullName { get; set; }
    public DateTimeOffset? BirthDate { get; set; }
    public Role Role { get; set; }
    public string? Token { get; set; }

    public ICollection<PhoneDTO> Phones { get; set; } = new HashSet<PhoneDTO>();
}

public class MemberWithPasswordDTO : MemberDTO
{
    public string Password { get; set; } = "";
}
