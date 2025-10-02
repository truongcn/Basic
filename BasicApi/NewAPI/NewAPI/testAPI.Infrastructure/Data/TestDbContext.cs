
using Microsoft.EntityFrameworkCore;
using NewAPI.testAPI.Domain.Entities;
using testAPI.Domain.Entities;
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

        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<StudentTeacher> StudentTeachers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình quan hệ N-N
            modelBuilder.Entity<StudentTeacher>()
                .HasKey(st => new { st.StudentId, st.TeacherId });

            modelBuilder.Entity<StudentTeacher>()
                .HasOne(st => st.Student)
                .WithMany(s => s.StudentTeachers)
                .HasForeignKey(st => st.StudentId);

            modelBuilder.Entity<StudentTeacher>()
                .HasOne(st => st.Teacher)
                .WithMany(t => t.StudentTeachers)
                .HasForeignKey(st => st.TeacherId);
        }

    }
}
