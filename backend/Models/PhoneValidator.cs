using FluentValidation;

namespace prid_tuto.Models;

public class PhoneValidator : AbstractValidator<Phone>
{
    private readonly MsnContext _context;

    public PhoneValidator(MsnContext context) {
        _context = context;

        RuleFor(p => p.Type).NotEmpty().MinimumLength(3);

        RuleFor(p => p.Number).NotEmpty().MinimumLength(3);
    }
}
