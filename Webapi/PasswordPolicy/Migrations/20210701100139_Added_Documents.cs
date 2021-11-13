using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PasswordPolicy.Migrations
{
    public partial class Added_Documents : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Documents",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(nullable: false),
                    FileExtension = table.Column<string>(nullable: false),
                    FilePath = table.Column<string>(nullable: true),
                    FileSize = table.Column<long>(nullable: false),
                    LastModifiedDate = table.Column<DateTime>(nullable: true),
                    UploadDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Documents");
        }
    }
}
