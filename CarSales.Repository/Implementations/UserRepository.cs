using CarSales.Data.Entities;
using CarSales.Data.Persistance;
using CarSales.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Repository.Implementations
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(CarSalesDbContext context) : base(context)
        {
        }

        public override async Task<User?> GetByIdAsync(Guid id)
        {
            return await _items.Include(u => u.Cars).ThenInclude(c => c.Photos).FirstOrDefaultAsync(u => u.Id == id);
        }
    }
}
