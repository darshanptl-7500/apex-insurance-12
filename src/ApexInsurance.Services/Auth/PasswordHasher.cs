using System;
using System.Security.Cryptography;

namespace ApexInsurance.Services.Auth
{
    /// <summary>Salted PBKDF2 password hashing for locally-managed accounts.</summary>
    public static class PasswordHasher
    {
        private const int SaltSize = 16;
        private const int HashSize = 32;
        private const int Iterations = 10000;

        public static void CreateHash(string password, out string hash, out string salt)
        {
            using (var rng = new RNGCryptoServiceProvider())
            {
                var saltBytes = new byte[SaltSize];
                rng.GetBytes(saltBytes);
                salt = Convert.ToBase64String(saltBytes);
                hash = ComputeHash(password, saltBytes);
            }
        }

        public static bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            if (string.IsNullOrEmpty(storedHash) || string.IsNullOrEmpty(storedSalt))
                return false;

            var saltBytes = Convert.FromBase64String(storedSalt);
            var computedHash = ComputeHash(password, saltBytes);
            return string.Equals(computedHash, storedHash, StringComparison.Ordinal);
        }

        private static string ComputeHash(string password, byte[] saltBytes)
        {
            using (var pbkdf2 = new Rfc2898DeriveBytes(password ?? string.Empty, saltBytes, Iterations))
            {
                var hashBytes = pbkdf2.GetBytes(HashSize);
                return Convert.ToBase64String(hashBytes);
            }
        }
    }
}
