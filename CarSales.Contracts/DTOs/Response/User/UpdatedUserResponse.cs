using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.DTOs.Response.User
{
    public class UpdatedUserResponse : BaseUserResponse
    {
        public required string Password { get; set; }
        public int? Age { get; set; }
        public bool IsActive { get; set; }
    }
}
