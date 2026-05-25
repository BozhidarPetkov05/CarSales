namespace CarSales.Contracts.DTOs.Response.User
{
    public class UpdatedUserResponse : BaseUserResponse
    {
        public required string Password { get; set; }
        public int? Age { get; set; }
    }
}
