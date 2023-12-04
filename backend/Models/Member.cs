using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_tuto.Models;

public enum Role
{
    Admin = 2, Manager = 1, Member = 0
}

public class Member
{
    private readonly MsnContext? _context;

    [Key]
    public string Pseudo { get; set; } = "";
    public string Password { get; set; } = "";
    public string? FullName { get; set; }
    public DateTimeOffset? BirthDate { get; set; }
    public Role Role { get; set; } = Role.Member;

    public Member() { }

    public Member(MsnContext context) {
        this._context = context;
    }

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
    public ICollection<Member> Followers { get; set; } = new HashSet<Member>();
    public ICollection<Member> Followees { get; set; } = new HashSet<Member>();

    public async Task<bool> Follow(Member other) {
        if (_context == null) return false;

        var rel = await _context.Follows.Where(f => f.FollowerPseudo == this.Pseudo && f.FolloweePseudo == other.Pseudo).SingleOrDefaultAsync();
        if (rel == null) {
            _context.Add(new Follow { Follower = this, Followee = other });
            await _context.SaveChangesAsync();
            return true;
        }

        return false;
    }

    public async Task<bool> UnFollow(Member other) {
        if (_context == null) return false;

        var rel = await _context.Follows.Where(f => f.FollowerPseudo == this.Pseudo && f.FolloweePseudo == other.Pseudo).SingleOrDefaultAsync();
        if (rel != null) {
            _context.Remove(rel);
            await _context.SaveChangesAsync();
            return true;
        }

        return false;
    }
}
