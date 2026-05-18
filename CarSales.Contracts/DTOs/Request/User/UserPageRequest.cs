using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.DTOs.Request.User
{
    public class UserPageRequest : PageRequest
    {
        public string? Username { get; set; }
        public bool? IsActive { get; set; }
    }
}
