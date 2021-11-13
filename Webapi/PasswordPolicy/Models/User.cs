using System;
using System.ComponentModel.DataAnnotations;

namespace PasswordPolicy.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string EmailId { get; set; }
        [Required]
        public string Name { get; set; }
        public string Token { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime? TokenExpires { get; set; }
        public DateTime? LastUpdatedPasswordDateTime { get; set; }
        public DateTime? LastTokenSentDateTime { get; set; }
    }
}
