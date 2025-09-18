using NewAPI.testAPI.Application.DTOs;
using NewAPI.testAPI.Application.Interfaces;
using testAPI.Infrastructure.Interfaces;

namespace NewAPI.testAPI.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _userRepository.GetByUsernameAsync(username);
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User> AddUserAsync(AddUserDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = dto.PasswordHash,
                Role = dto.Role,
                EmailConfirmed = dto.EmailConfirmed // ✅ bool mapping
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();
            return user;
        }

        public async Task<User?> UpdateUserAsync(UpdateUserDto dto)
        {
            var user = await _userRepository.GetByIdAsync(dto.Id);
            if (user == null) return null;

            if (!string.IsNullOrEmpty(dto.Username)) user.Username = dto.Username;
            if (!string.IsNullOrEmpty(dto.Email)) user.Email = dto.Email;
            if (!string.IsNullOrEmpty(dto.PasswordHash)) user.PasswordHash = dto.PasswordHash;
            if (!string.IsNullOrEmpty(dto.Role)) user.Role = dto.Role;

            if (dto.EmailConfirmed.HasValue)
                user.EmailConfirmed = dto.EmailConfirmed.Value;

            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            await _userRepository.DeleteAsync(user);
            await _userRepository.SaveChangesAsync();
            return true;
        }
    }
}
