using CarSales.Contracts.DTOs.Response;
using CarSales.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<IEnumerable<User>> GetAllAsync();
        Task AddAsync(User item);
        Task UpdateAsync(User item);
        Task DeleteAsync(User item);
        List<UserListResponse> MapToListResponse(IEnumerable<User> users);
        UserDetailedResponse MapToDetailedResponse(User user);
    }
}
