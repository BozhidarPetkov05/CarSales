using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.DTOs.Response
{
    public class UserListResponse
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public bool IsAdmin { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
