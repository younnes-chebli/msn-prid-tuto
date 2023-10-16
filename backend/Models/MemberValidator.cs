using FluentValidation;
using Microsoft.EntityFrameworkCore;
using prid_tuto.Helpers;

namespace prid_tuto.Models;

public class MemberValidator : AbstractValidator<Member>
{
    private readonly MsnContext _context;

    public MemberValidator(MsnContext context) {
        _context = context;

        RuleFor(m => m.Pseudo)
            .NotEmpty()
            .MinimumLength(3);

        RuleFor(m => m.Password)
            .NotEmpty()
            .MinimumLength(3);

        RuleFor(m => m.FullName)
            .MinimumLength(3);

        RuleFor(m => m.BirthDate)
            .LessThan(DateTime.Today)
            .DependentRules(() => {
                RuleFor(m => m.Age)
                    .GreaterThanOrEqualTo(18);
            });

        RuleFor(m => new { m.Pseudo, m.FullName })
            .MustAsync((m, token) => BeUniqueFullName(m.Pseudo, m.FullName, token))
            .OverridePropertyName(nameof(Member.FullName))
            .WithMessage("'{PropertyName}' must be unique.");

        RuleFor(m => m.Role)
        .IsInEnum();

        // Validations spécifiques pour la création
        RuleSet("create", () => {
            RuleFor(m => m.Pseudo)
                .MustAsync(BeUniquePseudo)
                .WithMessage("'{PropertyName}' must be unique.");
        });

        // Validations spécifiques pour l'authentification
        RuleSet("authenticate", () => {
            RuleFor(m => m.Token)
                .NotNull().OverridePropertyName("Password").WithMessage("Incorrect password.");
        });
    }

    public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(Member member) {
        return await this.ValidateAsync(member, o => o.IncludeRuleSets("default", "create"));
    }

    public async Task<FluentValidation.Results.ValidationResult> ValidateForAuthenticate(Member? member) {
        if (member == null)
            return ValidatorHelper.CustomError("Member not found.", "Pseudo");
        return await this.ValidateAsync(member!, o => o.IncludeRuleSets("authenticate"));
    }

    private async Task<bool> BeUniqueFullName(string pseudo, string? fullName, CancellationToken token) {
        return !await _context.Members.AnyAsync(m => m.Pseudo != pseudo && m.FullName == fullName);
    }

    private async Task<bool> BeUniquePseudo(string pseudo, CancellationToken token) {
        return !await _context.Members.AnyAsync(m => m.Pseudo == pseudo);
    }
}
