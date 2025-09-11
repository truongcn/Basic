using testAPI.Application.Interfaces;
using testAPI.testAPI.Aplication.DTOs;
using testAPI.testAPI.Domain.Entities;
using testAPI.testAPI.Infrastructure.Interfaces;

namespace testAPI.Application.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _repository;

        public StudentService(IStudentRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Student> GetAll() => _repository.GetAll();

        public Student? GetById(Guid id) => _repository.GetById(id);

        public Student Add(AddStudentDto dto)
        {
            var student = new Student
            {
                Name = dto.Name,
                Phone = dto.Phone,
                Description = dto.Description
            };
            _repository.Add(student);
            _repository.SaveChanges();
            return student;
        }

        public Student? Update(Guid id, UpdateStudentDto dto)
        {
            var student = _repository.GetById(id);
            if (student == null) return null;

            student.Name = dto.Name;
            student.Phone = dto.Phone;
            student.Description = dto.Description;
            _repository.Update(student);
            _repository.SaveChanges();
            return student;
        }

        public bool Delete(Guid id)
        {
            var student = _repository.GetById(id);
            if (student == null) return false;

            _repository.Delete(student);
            _repository.SaveChanges();
            return true;
        }
    }
}
