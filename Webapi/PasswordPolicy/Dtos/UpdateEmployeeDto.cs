namespace PasswordPolicy.Dtos
{
    public class UpdateEmployeeDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Position { get; set; }
        public int? cityID { get; set; }
        public int? StateID { get; set; }
    }
}
