using CarSales.Contracts.DTOs.Response;
using CarSales.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.Interfaces
{
    public interface ITokenService
    {
        public string CreateToken(User user);
    }
}
