using testAPI.testAPI.Domain.Entities;
using testAPI.testAPI.Infrastructure.Data;
using testAPI.testAPI.Infrastructure.Interfaces;

namespace testAPI.Infrastructure.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly TestDbContext _context;

        public StudentRepository(TestDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Student> GetAll() => _context.Students.ToList();

        public Student? GetById(Guid id) => _context.Students.Find(id);

        public void Add(Student student) => _context.Students.Add(student);

        public void Update(Student student) => _context.Students.Update(student);

        public void Delete(Student student) => _context.Students.Remove(student);

        public void SaveChanges() => _context.SaveChanges();
    }
}
