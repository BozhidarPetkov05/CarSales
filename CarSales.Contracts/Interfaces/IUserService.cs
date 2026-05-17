using CarSales.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(Guid id);
        Task<IEnumerable<User>> GetAllUsers();
        Task AddUserAsync(User user);
        Task UpdateUser(User user);
        Task DeleteUser(User user);
    }
}
