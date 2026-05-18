using CarSales.Contracts.DTOs.Request;
using CarSales.Contracts.DTOs.Response;
using CarSales.Contracts.DTOs.Response.User;
using CarSales.Contracts.Interfaces;
using CarSales.Data.Entities;
using CarSales.Data.Persistance;
using CarSales.Repository.Implementations;
using CarSales.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
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
                FirstName = u.FirstName,
                LastName = u.LastName,
                IsAdmin = u.IsAdmin,
                CreatedAt = u.CreatedAt,
                LastChanged = u.LastChange
            }).ToList();
        }

        public UserDetailedResponse MapToDetailedResponse(User user)
        {
            return new UserDetailedResponse 
            {
                Id = user.Id,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Age = user.Age,
                IsAdmin = user.IsAdmin,
                CreatedAt = user.CreatedAt,
                LastChanged = user.LastChange,
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

        public async Task<bool> UsernameExists(string username)
        {
            return await _repository.UsernameExists(username);
        }

        public User CreateUser(UserRequest model)
        {
            DateTime creationTime = DateTime.UtcNow;
            return new User 
            { 
                Id = Guid.NewGuid(),
                CreatedAt = creationTime,
                LastChange = creationTime,
                Username = model.Username,
                Password = model.Password,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Age = model.Age,
                IsAdmin = false
            };
        }
        public User UpdateUser(UserRequest model, User user)
        {
            user.Username = model.Username;
            user.Password = model.Password;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;

            if (model.Age is not null)
            {
                user.Age = model.Age;
            }
            if (model.IsAdmin.HasValue)
            {
                user.IsAdmin = model.IsAdmin.Value;
            }

            user.LastChange = DateTime.UtcNow;

            return user;
        }

        public UpdatedUserResponse MapToUpdatedUserResponse(User user)
        {
            return new UpdatedUserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Password = user.Password,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Age = user.Age,
                IsAdmin = user.IsAdmin,
                CreatedAt = user.CreatedAt,
                LastChanged = user.LastChange,
                IsActive = user.IsActive
            };
        }

        public async Task<UpdatedUserResponse> DeactivateUser(User user)
        {
            user.IsActive = false;
            user.LastChange = DateTime.UtcNow;
            await UpdateAsync(user);
            return MapToUpdatedUserResponse(user);
        }

        public async Task<PageResponse<UserListResponse>> GetAllUsersPagedAsync(int page, int pageSize)
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 30);

            var query = _repository.GetAllAsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).Select(u => new UserListResponse
            {
                Id = u.Id,
                Username = u.Username,
                FirstName = u.FirstName,
                LastName = u.LastName,
                IsAdmin = u.IsAdmin,
                CreatedAt = u.CreatedAt,
                LastChanged = u.LastChange
            }).ToListAsync();

            return new PageResponse<UserListResponse>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }
    }
}
