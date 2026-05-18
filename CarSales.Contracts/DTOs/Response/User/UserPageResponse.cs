using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.DTOs.Response.User
{
    public class UserPageResponse : PageResponse<UserListResponse>
    {
        public string? Username { get; set; }
        public bool? IsActive { get; set; }
    }
}
