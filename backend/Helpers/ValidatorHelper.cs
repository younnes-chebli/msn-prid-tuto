using FluentValidation.Results;

namespace prid_tuto.Helpers;

public static class ValidatorHelper
{
    public static ValidationResult CustomError(string error, string propertyName, object attemptedValue) {
        return new ValidationResult(new[] { new ValidationFailure(propertyName, error, attemptedValue) });
    }

    public static ValidationResult CustomError(string error, string propertyName) {
        return new ValidationResult(new[] { new ValidationFailure(propertyName, error) });
    }
}
