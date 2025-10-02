namespace NewAPI.testAPI.Application.DTOs
{
    public class UpdateTeacherDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<int> StudentIds { get; set; } = new();
    }
}
