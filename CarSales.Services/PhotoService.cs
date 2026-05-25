using CarSales.Contracts.Interfaces;
using CarSales.Data.Entities;
using CarSales.Data.Persistance;
using CarSales.Repository.Interfaces;

namespace CarSales.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly IPhotoRepository _repository;
        private readonly CarSalesDbContext _context;

        public PhotoService(IPhotoRepository repository, CarSalesDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        public async Task AddAsync(Photo item)
        {
            await _repository.AddAsync(item);
            await _context.SaveChangesAsync();
        }
    }
}
