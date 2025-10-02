using NewAPI.testAPI.Application.DTOs;
using NewAPI.testAPI.Domain.Entities;
using testAPI.Domain.Entities;
using testAPI.Infrastructure.Interfaces;

namespace testAPI.Application.Services
{
    public class TeacherService
    {
        private readonly ITeacherRepository _teacherRepo;

        public TeacherService(ITeacherRepository teacherRepo)
        {
            _teacherRepo = teacherRepo;
        }

        public async Task<IEnumerable<Teacher>> GetAllTeachersAsync()
        {
            return await _teacherRepo.GetAllAsync();
        }

        public async Task<Teacher> GetTeacherByIdAsync(int id)
        {
            return await _teacherRepo.GetByIdAsync(id);
        }

        public async Task<Teacher> AddTeacherAsync(AddTeacherDto dto)
        {
            var teacher = new Teacher
            {
                Name = dto.Name,
                StudentTeachers = dto.StudentIds?.Select(sid => new StudentTeacher
                {
                    StudentId = sid   // đổi sang Guid nếu Student.Id là Guid
                }).ToList()
            };

            return await _teacherRepo.AddAsync(teacher);
        }

        public async Task<Teacher> UpdateTeacherAsync(int id, UpdateTeacherDto dto)
        {
            var teacher = await _teacherRepo.GetByIdAsync(id);
            if (teacher == null) return null;

            teacher.Name = dto.Name;
            teacher.StudentTeachers = dto.StudentIds?.Select(sid => new StudentTeacher
            {
                StudentId = sid,
                TeacherId = id
            }).ToList();

            return await _teacherRepo.UpdateAsync(teacher);
        }

        public async Task<bool> DeleteTeacherAsync(int id)
        {
            return await _teacherRepo.DeleteAsync(id);
        }
    }
}
