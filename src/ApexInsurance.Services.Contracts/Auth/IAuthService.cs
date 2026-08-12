using System.Collections.Generic;
using ApexInsurance.Services.Dto;

namespace ApexInsurance.Services.Auth
{
    public interface IAuthService
    {
        LoginResult ValidateLogin(string username, string password, string ipAddress = null);
        UserDto GetUserById(int userId);
        IEnumerable<UserDto> GetUsers(bool activeOnly = true);
    }
}
