using System;

namespace ApexInsurance.Api.Infrastructure
{
    /// <summary>
    /// Parses string query/body values into domain enums with a meaningful validation
    /// error (listing the valid values) instead of a generic model-binding failure.
    /// </summary>
    public static class EnumHelper
    {
        public static TEnum Parse<TEnum>(string value, string fieldName) where TEnum : struct, Enum
        {
            if (!Enum.TryParse<TEnum>(value, true, out var parsed) || !Enum.IsDefined(typeof(TEnum), parsed))
            {
                var validValues = string.Join(", ", Enum.GetNames(typeof(TEnum)));
                throw new ApexValidationException(
                    $"'{value}' is not a valid {fieldName}. Valid values are: {validValues}.");
            }

            return parsed;
        }

        public static TEnum? TryParseOrNull<TEnum>(string value) where TEnum : struct, Enum
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            return Enum.TryParse<TEnum>(value, true, out var parsed) && Enum.IsDefined(typeof(TEnum), parsed)
                ? parsed
                : (TEnum?)null;
        }
    }
}
