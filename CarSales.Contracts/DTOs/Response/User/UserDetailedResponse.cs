using CarSales.Contracts.DTOs.Response.Car;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.DTOs.Response.User
{
    public class UserDetailedResponse : BaseUserResponse
    {
        public int? Age { get; set; }
        public ICollection<CarListResponse> Cars { get; set; } = new List<CarListResponse>();
    }
}
