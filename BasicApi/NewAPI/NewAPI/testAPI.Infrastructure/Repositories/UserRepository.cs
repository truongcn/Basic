using Microsoft.EntityFrameworkCore;
using testAPI.Infrastructure.Interfaces;
using testAPI.testAPI.Infrastructure.Data;

namespace testAPI.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly TestDbContext _context;

        public UserRepository(TestDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
