using System;
using System.ComponentModel.DataAnnotations;

namespace PasswordPolicy.Models
{
    public class Employee
    {
        [Key]
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Prefix { get; set; }
        public string Position { get; set; }
        public int? StateID { get; set; }
        public int? CityID { get; set; }
    }

}
