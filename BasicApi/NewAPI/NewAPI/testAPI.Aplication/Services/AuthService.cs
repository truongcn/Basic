using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using testAPI.Application.Interfaces;
using testAPI.Infrastructure.Interfaces;
using testAPI.testAPI.Infrastructure.Data;

namespace testAPI.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly TestDbContext _db;              // add
        private readonly IEmailService _emailService;

        public AuthService(
        IUserRepository userRepository,
        IConfiguration configuration,
        TestDbContext db,                // add
        IEmailService emailService)      // add
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _db = db;
            _emailService = emailService;
        }

        public async Task<string?> LoginAsync(string username, string password)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null) return null;

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed) return null;

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.Role)
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> RegisterAsync(string username, string email, string password, string role)
        {
            if (await _db.Users.AnyAsync(u => u.Username == username || u.Email == email))
                return false;

            var hasher = new PasswordHasher<User>();
            var user = new User
            {
                Username = username,
                Email = email,
                Role = role,
                EmailConfirmed = false,
            };
            user.PasswordHash = hasher.HashPassword(user, password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            await CreateAndSendVerificationAsync(user);
            return true;
        }

        public async Task<bool> VerifyEmailAsync(string email, string token)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return false;

            var storedToken = await _db.EmailVerificationTokens
                .FirstOrDefaultAsync(t => t.UserId == user.Id);

            if (storedToken == null)
            {
                throw new Exception("No token found in DB for this user.");
            }

            if (storedToken.Token != token)
            {
                throw new Exception($"Token mismatch. DB: {storedToken.Token}, Request: {token}");
            }

            if (storedToken.ExpiryDate < DateTime.UtcNow)
            {
                throw new Exception($"Token expired at {storedToken.ExpiryDate}");
            }

            user.EmailConfirmed = true;
            _db.EmailVerificationTokens.Remove(storedToken);
            await _db.SaveChangesAsync();
            return true;
        }


        public async Task<bool> ResendVerificationAsync(string email)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == email);
            if (user == null || user.EmailConfirmed) return false;

            // delete old tokens (optional)
            var oldTokens = _db.EmailVerificationTokens.Where(t => t.UserId == user.Id);
            _db.EmailVerificationTokens.RemoveRange(oldTokens);
            await _db.SaveChangesAsync();

            await CreateAndSendVerificationAsync(user);
            return true;
        }

        private async Task CreateAndSendVerificationAsync(User user)
        {
            var token = GenerateToken();
            var entity = new EmailVerificationToken
            {
                UserId = user.Id,
                Token = token,
                ExpiryDate = DateTime.UtcNow.AddHours(24)
            };
            _db.EmailVerificationTokens.Add(entity);
            await _db.SaveChangesAsync();

            // Base URL from config (set App:BaseUrl = "https://localhost:5001")
            var baseUrl = _configuration["App:BaseUrl"];
            var verifyUrl = $"{baseUrl}/api/auth/verify?email={HttpUtility.UrlEncode(user.Email)}&token={HttpUtility.UrlEncode(token)}";

            await _emailService.SendEmailAsync
                (
                 user.Email,                       // <-- use the real email field
                 "Verify your account",
                 $"<p>Click <a href='{verifyUrl}'>here</a> to verify your email.</p>"
                );
        }

        private static string GenerateToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(32);
            return WebEncoders.Base64UrlEncode(bytes); // requires Microsoft.AspNetCore.WebUtilities
        }

    }
}
