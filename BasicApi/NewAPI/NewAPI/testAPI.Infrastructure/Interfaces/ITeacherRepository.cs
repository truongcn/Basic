using System.Collections.Generic;
using System.Threading.Tasks;
using testAPI.Domain.Entities;

namespace testAPI.Infrastructure.Interfaces
{
    public interface ITeacherRepository
    {
        Task<IEnumerable<Teacher>> GetAllAsync();
        Task<Teacher> GetByIdAsync(int id);
        Task<Teacher> AddAsync(Teacher teacher);
        Task<Teacher> UpdateAsync(Teacher teacher);
        Task<bool> DeleteAsync(int id);
    }
}
