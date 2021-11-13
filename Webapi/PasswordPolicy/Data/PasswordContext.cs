using Microsoft.EntityFrameworkCore;
using PasswordPolicy.Models;
namespace PasswordPolicy.Data
{
    public class PasswordContext : DbContext
    {
        public PasswordContext(DbContextOptions<PasswordContext> options) : base(options)
        {

        }
        public DbSet<Password> Passwords { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Employee> Employees { get; set; }
    }
}
