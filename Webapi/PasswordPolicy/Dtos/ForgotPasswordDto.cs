using System.ComponentModel.DataAnnotations;

namespace PasswordPolicy.Dtos
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string EmailId { get; set; }

        [Required]
        public string ClientURI { get; set; }
    }
}
