using System.ComponentModel.DataAnnotations;

namespace PasswordPolicy.Dtos
{
    public class ChangePasswordDto
    {
        [Required]
        public string EmailId { get; set; }
        [Required]
        public string OldPassword { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}
