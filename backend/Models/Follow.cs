using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace prid_tuto.Models;

public class Follow
{
    public string FollowerPseudo { get; set; } = null!;
    public Member Follower { get; set; } = null!;
    public string FolloweePseudo { get; set; } = null!;
    public Member Followee { get; set; } = null!;
}

public class FollowValidator : AbstractValidator<Follow>
{
    private MsnContext _context;

    public FollowValidator(MsnContext context) {
        this._context = context;

        RuleFor(f => f.FollowerPseudo)
            .NotEmpty();

        RuleFor(f => f.FolloweePseudo)
            .NotEmpty();
    }
}
