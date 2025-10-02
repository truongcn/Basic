using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using testAPI.Domain.Entities;
using testAPI.Infrastructure.Interfaces;
using testAPI.testAPI.Infrastructure.Data;

namespace testAPI.Infrastructure.Repositories
{
    public class TeacherRepository : ITeacherRepository
    {
        private readonly TestDbContext _context;

        public TeacherRepository(TestDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Teacher>> GetAllAsync()
        {
            return await _context.Teachers
                .Include(t => t.StudentTeachers)
                .ThenInclude(st => st.Student)
                .ToListAsync();
        }

        public async Task<Teacher> GetByIdAsync(int id)
        {
            return await _context.Teachers
                .Include(t => t.StudentTeachers)
                .ThenInclude(st => st.Student)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Teacher> AddAsync(Teacher teacher)
        {
            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();
            return teacher;
        }

        public async Task<Teacher> UpdateAsync(Teacher teacher)
        {
            _context.Teachers.Update(teacher);
            await _context.SaveChangesAsync();
            return teacher;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return false;

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
