using CarSales.Data.Entities;
using CarSales.Data.Persistance;
using CarSales.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarSales.Repository.Implementations
{
    public class FavouriteRepository : IFavouriteRepository
    {
        private readonly CarSalesDbContext _context;
        private readonly DbSet<Favourite> _items;

        public FavouriteRepository(CarSalesDbContext context)
        {
            _context = context;
            _items = _context.Set<Favourite>();
        }
        public async Task<IEnumerable<Favourite>> GetAllAsync()
        {
            return await _items.ToListAsync();
        }
        public async Task AddAsync(Favourite entity)
        {
            await _items.AddAsync(entity);
        }
        public void Update(Favourite entity)
        {
            _items.Update(entity);
        }
        public void Delete(Favourite entity)
        {
            _items.Remove(entity);
        }

        public async Task<Favourite> GetByIdsAsync(Guid userId, Guid carId)
        {
            return await _items.FirstOrDefaultAsync(f => f.UserId == userId && f.CarId == carId);
        }
    }
}
