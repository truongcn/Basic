namespace NewAPI.testAPI.Application.DTOs
{
    public class UpdateUserDto
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? Role { get; set; }
        public bool? EmailConfirmed { get; set; }
    }
}
