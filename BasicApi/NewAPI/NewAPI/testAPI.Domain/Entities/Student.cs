using NewAPI.testAPI.Domain.Entities;

namespace testAPI.testAPI.Domain.Entities
{
    public class Student
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Phone { get; set; }
        public string? Classes { get; set; }
        public string? Description { get; set; }
        public ICollection<StudentTeacher> StudentTeachers { get; set; }

    }
}
