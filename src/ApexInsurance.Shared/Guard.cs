using System;

namespace ApexInsurance.Shared
{
    public static class Guard
    {
        public static T NotNull<T>(T value, string name) where T : class
        {
            if (value == null) throw new ArgumentNullException(name);
            return value;
        }

        public static string NotBlank(string value, string name)
        {
            if (string.IsNullOrWhiteSpace(value)) throw new ArgumentException("Value is required.", name);
            return value;
        }
    }
}
