using testAPI.testAPI.Aplication.DTOs;
using testAPI.testAPI.Domain.Entities;

namespace testAPI.Application.Interfaces
{
    public interface IStudentService
    {
        IEnumerable<Student> GetAll();
        Student? GetById(Guid id);
        Student Add(AddStudentDto dto);
        Student? Update(Guid id, UpdateStudentDto dto);
        bool Delete(Guid id);
    }
}

