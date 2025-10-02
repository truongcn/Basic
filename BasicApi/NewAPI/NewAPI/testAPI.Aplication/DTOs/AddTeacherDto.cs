namespace NewAPI.testAPI.Application.DTOs
{
    public class AddTeacherDto
    {
        public string Name { get; set; } = string.Empty;
        public List<int> StudentIds { get; set; } = new();
    }
}
