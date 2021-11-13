using PasswordPolicy.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PasswordPolicy.Data
{
    public class SqlPasswordRepo : IPasswordRepo
    {
        private readonly PasswordContext _context;

        public SqlPasswordRepo(PasswordContext context)
        {
            _context = context;
        }
        public void CreatePassword(Password pwd)
        {
            if (pwd == null)
            {
                throw new ArgumentNullException(nameof(pwd));
            }

            _context.Passwords.Add(pwd);
        }

        public void DeletePassword(Password pwd)
        {
            if (pwd == null)
            {
                throw new ArgumentNullException(nameof(pwd));
            }
            _context.Passwords.Remove(pwd);
        }

        public IEnumerable<Password> GetAllPasswords()
        {
            return _context.Passwords.Where(x=> x.IsInactive == false);
        }

        public Password GetPasswordById(int id)
        {
            return _context.Passwords.FirstOrDefault(P => P.Id == id);
        }

        public Password GetAppliedPasswordPolicyId()
        {
            var password = _context.Passwords.FirstOrDefault(P => P.IsApplied == true);

            if (password == null)
            {
                password = _context.Passwords.FirstOrDefault(p => p.PolicyName == "DEFAULT");
            }
            return password;
        }

        public bool SaveChanges()
        {
            return (_context.SaveChanges() > 0);
        }

        public void UpdatePassword(Password pwd)
        {

        }
    }
}
