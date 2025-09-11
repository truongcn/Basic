﻿

namespace testAPI.Infrastructure.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task AddAsync(User user);
        Task SaveChangesAsync();
    }
}
