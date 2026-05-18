using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.DTOs.Response.User
{
    public class UserListResponse : BaseUserResponse
    {
        public bool IsActive { get; set; }
    }
}
