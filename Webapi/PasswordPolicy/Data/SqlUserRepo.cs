using Microsoft.AspNetCore.WebUtilities;
using PasswordPolicy.Dtos;
using PasswordPolicy.EmailService;
using PasswordPolicy.Helpers;
using PasswordPolicy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
namespace PasswordPolicy.Data
{
    public class SqlUserRepo : IUserRepo
    {
        private PasswordContext _context;
        private readonly IEmailSender _emailsender;
        private readonly IPasswordRepo _password;

        public SqlUserRepo(PasswordContext context, IEmailSender emailSender, IPasswordRepo sqlPasswordRepo)
        {
            _emailsender = emailSender;
            _context = context;
            _password = sqlPasswordRepo;
        }

        public User Authenticate(string emailId, string password)
        {
           

            if (string.IsNullOrEmpty(emailId) || string.IsNullOrEmpty(password))
                return null;

            var user = _context.Users.SingleOrDefault(x => x.EmailId == emailId);

            // check if username exists
            if (user == null)
                return null;

            // check if password is correct
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            // authentication successful
            user.LastTokenSentDateTime = DateTime.Now;

            _context.Users.Update(user);
            _context.SaveChanges();

          

            return user;
        }

        public void ForgotPassword(ForgotPasswordDto model)
        {
            var user = _context.Users.SingleOrDefault(x => x.EmailId == model.EmailId);
            var tokenExpireTime = DateTime.Now.AddMinutes(15);
            // always return ok response to prevent email enumeration
            if (user == null) return;

            var ResetToken = randomTokenString();
            user.Token = ResetToken;
            user.TokenExpires = tokenExpireTime;

            _context.Users.Update(user);
            _context.SaveChanges();

            var param = new Dictionary<string, string>
            {
                {"token", ResetToken },
                {"email", model.EmailId }
            };

            var callback = QueryHelpers.AddQueryString(model.ClientURI, param);

            var message = new Message(new string[] { user.EmailId }, "Reset password token", callback);
            // send email
            _emailsender.SendEmail(message);
        }
        public bool IsPasswordExpired(string emailId)
        {
            var appliedPasswordPoliocy = _password.GetAppliedPasswordPolicyId();
            var user = _context.Users.SingleOrDefault(x => x.EmailId == emailId);
            var IsPasswordExpired = user.LastUpdatedPasswordDateTime >= user.LastUpdatedPasswordDateTime.Value.AddMonths(appliedPasswordPoliocy.PasswordAgeInterval);


            return IsPasswordExpired;
        }
        public bool ValidateResetToken(ValidateResetTokenDto model)
        {
            var user = _context.Users.SingleOrDefault(x =>
                x.Token == model.Token &&
                x.TokenExpires > DateTime.Now);

            return user == null ? false : true;
        }

        public void ResetPassword(ResetPasswordDto model)
        {
            var user = _context.Users.SingleOrDefault(x =>
                x.Token == model.Token &&
                x.TokenExpires > DateTime.Now);

            if (user == null)
                throw new AppException("Token Expired Please Request New one");

            // update password and remove reset token
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(model.Password, out passwordHash, out passwordSalt);
            user.Token = null;
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.LastUpdatedPasswordDateTime = DateTime.Now;
            _context.Users.Update(user);
            //return;
            _context.SaveChanges();
        }

        public void ChangePassword(ChangePasswordDto model)
        {
            var user = _context.Users.SingleOrDefault(x =>
                x.EmailId == model.EmailId);

            if (user == null)
                throw new AppException("Invalid userName or Password");

            // update password and remove reset token
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(model.Password, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.LastUpdatedPasswordDateTime = DateTime.Now;
            _context.Users.Update(user);
            _context.SaveChanges();
        }





        public IEnumerable<User> GetAll()
        {
            return _context.Users.ToList();
        }

        public User GetById(int id)
        {
            return _context.Users.Find(id);
        }

        public User Create(User user, string password)
        {
            // validation
            if (string.IsNullOrWhiteSpace(password))
                throw new AppException("Password is required");

            if (_context.Users.Any(x => x.EmailId == user.EmailId))
                throw new AppException("EmailId \"" + user.EmailId + "\" is already Exist");


            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            user.TokenExpires = null;
            user.LastUpdatedPasswordDateTime = DateTime.Now;
            _context.Users.Add(user);
            _context.SaveChanges();

            return user;
        }

        public void Update(UserDto userParam)
        {
            var user = _context.Users.Find(userParam.Id);

            if (user == null)
                throw new AppException("User not found");

            // update EmailId if it has changed
            if (!string.IsNullOrWhiteSpace(userParam.EmailId) && userParam.EmailId != user.EmailId)
            {
                // throw error if the new username is already taken
                if (_context.Users.Any(x => x.EmailId == userParam.EmailId))
                    throw new AppException("EmailId " + userParam.EmailId + " is already Exists");

                user.EmailId = userParam.EmailId;
            }

            // update user properties if provided
            if (!string.IsNullOrWhiteSpace(userParam.Name))
                user.Name = userParam.Name;


            // update password if provided
            if (!string.IsNullOrWhiteSpace(userParam.Password))
            {

                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(userParam.Password, out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.LastUpdatedPasswordDateTime = DateTime.Now;
            }

            _context.Users.Update(user);
            _context.SaveChanges();

        }

        public bool IsEmailIdExist(string email)
        {
            if (_context.Users.Any(x => x.EmailId == email))
                return false;
            else
                return true;
        }

        public void Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }

        // private helper methods
        private string randomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[40];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            // convert random bytes to hex string
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }
    }

}
