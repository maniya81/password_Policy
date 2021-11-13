using System;
using System.ComponentModel.DataAnnotations;

namespace PasswordPolicy.Models
{
    public class Password
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(25)]
        public string PolicyName { get; set; }
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
        [Required]
        public bool IsInactive { get; set; }
        public bool IsApplied { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateUpdated { get; set; }
        public string ModifiedBy { get; set; }
    }
}
