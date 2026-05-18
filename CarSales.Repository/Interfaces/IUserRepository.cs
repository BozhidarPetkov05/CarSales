using CarSales.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Repository.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<bool> UsernameExists(string username);
        IQueryable<User> GetAllAsQueryable();
    }
}
