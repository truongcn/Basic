using Microsoft.AspNetCore.Mvc;
using testAPI.Application.DTOs;
using testAPI.Application.Interfaces;

namespace testAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.LoginAsync(request.Username, request.Password);
            if (token == null) return Unauthorized(new { message = "Invalid username or password" });
            return Ok(new { token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (request.Password != request.ConfirmPassword)
                return BadRequest(new { message = "Passwords do not match" });

            // Force default role
            string role = "User";

            var result = await _authService.RegisterAsync(request.Username, request.Email, request.Password, request.Role);
            if (!result) return BadRequest(new { message = "User or email already exists" });

            return Ok(new { message = "Registered successfully. Please check your email to verify." });
        }


        [HttpGet("verify")]
        public async Task<IActionResult> Verify([FromQuery] string email, [FromQuery] string token)
        {
            var ok = await _authService.VerifyEmailAsync(email, token);
            if (!ok) return BadRequest(new { message = "Invalid or expired token" });
            return Ok(new { message = "Email verified successfully" });
        }

        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerification([FromBody] string email)
        {
            var ok = await _authService.ResendVerificationAsync(email);
            if (!ok) return BadRequest(new { message = "User not found or already verified" });
            return Ok(new { message = "Verification email sent" });
        }

    }

    public class LoginRequest
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
