using System.ComponentModel.DataAnnotations;

namespace PasswordPolicy.Dtos
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}
