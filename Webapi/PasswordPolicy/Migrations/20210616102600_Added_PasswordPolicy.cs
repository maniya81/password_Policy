using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PasswordPolicy.Migrations
{
    public partial class Added_PasswordPolicy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Passwords",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PolicyName = table.Column<string>(maxLength: 25, nullable: false),
                    Minlength = table.Column<int>(nullable: false),
                    Maxlength = table.Column<int>(nullable: false),
                    NoOfUppercaseLetters = table.Column<int>(nullable: false),
                    NoOfDigits = table.Column<int>(nullable: false),
                    NoOfSpecialLetters = table.Column<int>(nullable: false),
                    PasswordAgeInterval = table.Column<int>(nullable: false),
                    SessionTimeoutInterval = table.Column<int>(nullable: false),
                    IsInactive = table.Column<bool>(nullable: false),
                    IsApplied = table.Column<bool>(nullable: false),
                    DateAdded = table.Column<DateTime>(nullable: false),
                    DateUpdated = table.Column<DateTime>(nullable: false),
                    ModifiedBy = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Passwords", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Passwords");
        }
    }
}
