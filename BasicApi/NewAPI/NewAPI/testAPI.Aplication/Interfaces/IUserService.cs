using NewAPI.testAPI.Application.DTOs;

namespace NewAPI.testAPI.Application.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByIdAsync(int id);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> AddUserAsync(AddUserDto dto);
        Task<User?> UpdateUserAsync(UpdateUserDto dto);
        Task<bool> DeleteUserAsync(int id);
    }
}
