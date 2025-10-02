using NewAPI.testAPI.Application.DTOs;
using testAPI.Domain.Entities;

namespace testAPI.Application.Interfaces
{
    public interface ITeacherService
    {
        Task<Teacher> AddTeacherAsync(AddTeacherDto dto);
        Task<Teacher> GetTeacherByIdAsync(int id);
        Task<IEnumerable<Teacher>> GetAllTeachersAsync();
    }
}
