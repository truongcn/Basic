
using Microsoft.EntityFrameworkCore;
using testAPI.testAPI.Domain.Entities;

namespace testAPI.testAPI.Infrastructure.Data
{
    public class TestDbContext : DbContext
    {
        public TestDbContext(DbContextOptions options) : base (options)
        {
            
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<EmailVerificationToken> EmailVerificationTokens { get; set; }

    }
}
