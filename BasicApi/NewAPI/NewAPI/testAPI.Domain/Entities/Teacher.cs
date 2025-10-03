using NewAPI.testAPI.Domain.Entities;
using System.Collections.Generic;
using testAPI.testAPI.Domain.Entities;

namespace testAPI.Domain.Entities
{
    public class Teacher
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; } 

        // Quan hệ N-N với Student
        public ICollection<StudentTeacher> StudentTeachers { get; set; }
    }

}
