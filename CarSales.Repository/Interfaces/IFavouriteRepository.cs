using CarSales.Data.Entities;

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
