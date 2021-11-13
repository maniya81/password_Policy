using System;

namespace PasswordPolicy.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public string EmailId { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Token { get; set; }
        public DateTime TokenExpiresTime { get; set; }

    }
}
