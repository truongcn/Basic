namespace NewAPI.testAPI.Application.DTOs
{
    public class AddUserDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } = "User";
        public bool EmailConfirmed { get; set; } = false;

    }
}
