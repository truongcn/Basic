using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NewAPI.testAPI.Application.Interfaces;
using NewAPI.testAPI.Application.Services;
using System.Text;
using testAPI.Application.Interfaces;
using testAPI.Application.Services;
using testAPI.Infrastructure.Interfaces;
using testAPI.Infrastructure.Repositories;
using testAPI.testAPI.Infrastructure.Data;
using testAPI.testAPI.Infrastructure.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<TestDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// DI
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();


//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://127.0.0.1:5500", "http://localhost:5500") // your frontend origin(s)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


// JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();
var app = builder.Build();

app.UseStaticFiles();


app.UseCors("AllowFrontend"); // Dùng đúng tên policy bạn đã đặt ở trên
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Swagger mở sẵn
app.UseSwagger();
app.UseSwaggerUI();

app.Run();
