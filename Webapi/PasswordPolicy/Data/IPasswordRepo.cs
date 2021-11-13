using PasswordPolicy.Models;
using System.Collections.Generic;

namespace PasswordPolicy.Data
{
    public interface IPasswordRepo
    {
        bool SaveChanges();
        IEnumerable<Password> GetAllPasswords();
        Password GetPasswordById(int id);
        Password GetAppliedPasswordPolicyId();

        void CreatePassword(Password pwd);

        void UpdatePassword(Password pwd);

        void DeletePassword(Password pwd);
    }
}
