using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Username { get; set; }

    public string Email { get; set; }


    [Required]
    public string PasswordHash { get; set; }

    [MaxLength(50)]
    public string Role { get; set; } = "User";

    public bool EmailConfirmed { get; set; }
}