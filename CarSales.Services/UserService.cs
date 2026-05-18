using CarSales.Contracts.DTOs.Response;
using CarSales.Contracts.Interfaces;
using CarSales.Data.Entities;
using CarSales.Data.Persistance;
using CarSales.Repository.Implementations;
using CarSales.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Services
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _repository;
        private readonly CarSalesDbContext _context;
        public UserService(IUserRepository repository, CarSalesDbContext context)
        {
            _repository = repository;
            _context = context;
        }
        public async Task<User?> GetByIdAsync(Guid id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user is null)
            {
                return null;
            }

            return user;
        }
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            var users = await _repository.GetAllAsync();
            return users;
        }
        public async Task AddAsync(User item)
        {
            await _repository.AddAsync(item);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(User item)
        {
            _repository.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(User item)
        {
            _repository.Delete(item);
            await _context.SaveChangesAsync();
        }

        public List<UserListResponse> MapToListResponse(IEnumerable<User> users)
        {
            return users.Select(u => new UserListResponse
            {
                Id = u.Id,
                Username = u.Username,
                Password = u.Password,
                FirstName = u.FirstName,
                LastName = u.LastName,
                IsAdmin = u.IsAdmin,
                CreatedAt = u.CreatedAt,

            }).ToList();
        }

        public UserDetailedResponse MapToDetailedResponse(User user)
        {
            return new UserDetailedResponse 
            {
                Id = user.Id,
                Username = user.Username,
                Password = user.Password,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Age = user.Age,
                IsAdmin = user.IsAdmin,
                CreatedAt = user.CreatedAt,
                Cars = user.Cars.Select(c => new CarListResponse
                {
                    Id = c.Id,
                    Brand = c.Brand.ToString(),
                    Model = c.Model,
                    Year = c.Year,
                    Price = c.Price,
                    Fuel = c.Fuel.ToString(),
                    CreatedAt = c.CreatedAt,
                    MainPhotoUrl = c.Photos
                        .FirstOrDefault(p => p.IsMain)?.ImagePath
                }).ToList()
            };
        }
    }
}
