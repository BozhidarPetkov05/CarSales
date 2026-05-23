using CarSales.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Repository.Interfaces
{
    public interface IFavouriteRepository
    {
        Task<IEnumerable<Favourite>> GetAllAsync();
        Task<Favourite> GetByIdsAsync(Guid userId, Guid carId);
        Task AddAsync(Favourite entity);
        void Update(Favourite entity);
        void Delete(Favourite entity);
    }
}
