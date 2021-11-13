using System;
using System.ComponentModel.DataAnnotations;

namespace PasswordPolicy.Models
{
    public class Document
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FileName { get; set; }
        [Required]
        public string FileExtension { get; set; }
        public string FilePath { get; set; }
        [Required]
        public long FileSize { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public DateTime UploadDate { get; set; }
    }
}
