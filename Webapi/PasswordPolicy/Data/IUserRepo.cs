using PasswordPolicy.Dtos;
using PasswordPolicy.Models;
using System.Collections.Generic;

namespace PasswordPolicy.Data
{
    public interface IUserRepo
    {
        User Authenticate(string username, string password);
        IEnumerable<User> GetAll();
        User GetById(int id);
        User Create(User user, string password);
        void Update(UserDto userParam);
        bool IsEmailIdExist(string email);
        void ForgotPassword(ForgotPasswordDto model);
        bool ValidateResetToken(ValidateResetTokenDto model);
        void ResetPassword(ResetPasswordDto model);
        void ChangePassword(ChangePasswordDto model);
        bool IsPasswordExpired(string emailId);
        void Delete(int id);
    }
}
