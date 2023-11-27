using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_tuto.Models;

public class Phone
{
    public int PhoneId { get; set; }
    public string Type { get; set; } = null!;
    public string Number { get; set; } = null!;
    [ForeignKey(nameof(Member))]
    public string MemberPseudo { get; set; } = null!;
    public Member Member { get; set; } = null!;
}
