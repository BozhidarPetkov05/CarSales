using CarSales.Contracts.Interfaces;
using CarSales.Data.Entities;
using CarSales.Data.Persistance;
using CarSales.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.Implementations
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _repository;
        private readonly CarSalesDbContext _context;
        public UserService(IRepository<User> repository, CarSalesDbContext context)
        {
            _repository = repository;
            _context = context;
        }
        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _repository.GetAllAsync();
        }

        public async Task AddUserAsync(User user)
        {
            await _repository.AddAsync(user);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateUser(User user)
        {
            _repository.Update(user);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteUser(User user)
        {
            _repository.Delete(user);
            await _context.SaveChangesAsync();
        }
    }
}
