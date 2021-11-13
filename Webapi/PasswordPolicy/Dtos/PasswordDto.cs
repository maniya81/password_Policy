using System;
using System.ComponentModel.DataAnnotations;

namespace PasswordPolicy.Dtos
{
    public class PasswordDto
    {
        public string PolicyName { get; set; }
        public int Id { get; set; }
        [Required]
        public int Minlength { get; set; }
        [Required]
        public int Maxlength { get; set; }
        [Required]
        public int NoOfUppercaseLetters { get; set; }
        [Required]
        public int NoOfDigits { get; set; }
        [Required]
        public int NoOfSpecialLetters { get; set; }
        [Required]
        public int PasswordAgeInterval { get; set; }
        [Required]
        public int SessionTimeoutInterval { get; set; }
        public bool? IsInactive { get; set; }
        public bool? IsApplied { get; set; }
        public string ModifiedBy { get; set; }
    }

}
