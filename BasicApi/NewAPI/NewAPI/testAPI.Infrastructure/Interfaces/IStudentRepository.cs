using testAPI.testAPI.Domain.Entities;

namespace testAPI.testAPI.Infrastructure.Interfaces
{
    public interface IStudentRepository
    {
        IEnumerable<Student> GetAll();
        Student? GetById(Guid id);
        void Add(Student student);
        void Update(Student student);
        void Delete(Student student);
        void SaveChanges();
    }
}
