using Microsoft.EntityFrameworkCore.Migrations;

namespace PasswordPolicy.Migrations
{
    public partial class Added_DefaultPasswordPolicy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
               table: "Passwords",
               columns: new[] { "PolicyName", "Minlength", "Maxlength", "NoOfUppercaseLetters", "NoOfDigits", "NoOfSpecialLetters", "PasswordAgeInterval", "SessionTimeoutInterval","IsInactive", "IsApplied", "DateAdded", "DateUpdated" },
               values: new object[,]
               {
                    { "DEFAULT", 5, 8, 1, 1, 1, 6, 60, true, false, "2021-06-24", "2021-06-24"  },
               });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
