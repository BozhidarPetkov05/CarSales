using CarSales.Contracts.DTOs.Response.Favourites;
using CarSales.Contracts.Interfaces;
using CarSales.Data.Entities;
using CarSales.Data.Persistance;
using CarSales.Repository.Interfaces;

namespace CarSales.Services
{
    public class FavouriteService : IFavouriteService
    {
        private readonly IFavouriteRepository _repository;
        private readonly CarSalesDbContext _context;

        public FavouriteService(IFavouriteRepository repository, CarSalesDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        public Task<IEnumerable<Favourite>> GetAllAsync()
        {
            return _repository.GetAllAsync();
        }
        public async Task AddAsync(Favourite item)
        {
            await _repository.AddAsync(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Favourite item)
        {
            _repository.Delete(item);
            await _context.SaveChangesAsync();
        }

        public List<FavouritesListResponse> MapToListResponse(IEnumerable<Favourite> favourites)
        {
            return favourites.Select(f => new FavouritesListResponse
            {
                Brand = f.Car.Brand.ToString(),
                Model = f.Car.Model,
                Year = f.Car.Year,
                Price = f.Car.Price,
                Fuel = f.Car.Fuel.ToString(),
                CreatedAt = f.Car.CreatedAt,
                UpdatedAt = f.Car.LastChange,
                MainPhotoUrl = f.Car.Photos.FirstOrDefault(p => p.IsMain)?.ImagePath,
                AddedAt = f.Car.CreatedAt,
                LastPrice = f.LastPrice,
                IsPriceChanged = f.IsPriceChanged,
                IsHigherPrice = f.IsHigherPrice
            }).ToList();
        }

        public Favourite CreateFavourite(Guid userId, Guid carId)
        {
            Car car = _context.Set<Car>().FirstOrDefault(c => c.Id == carId);
            User user = _context.Set<User>().FirstOrDefault(u => u.Id == userId);
            Favourite favourite = new Favourite
            {
                Car = car,
                CarId = carId,
                User = user,
                UserId = userId,
                AddedAt = DateTime.UtcNow,
                LastPrice = car.Price,
                IsPriceChanged = false,
                IsHigherPrice = false
            };

            return favourite;
        }

        public bool CarExists(Guid carId)
        {
            Car? car = _context.Set<Car>().FirstOrDefault(c => c.Id == carId);
            if (car is null)
            {
                return false;
            }
            return true;
        }

        public bool CarIsInFavourites(Guid carId, Guid userId)
        {
            Favourite? favourite = _context.Set<Favourite>().FirstOrDefault(f => f.CarId == carId && f.UserId == userId);
            if (favourite is null)
            {
                return false;
            }
            return true;
        }

        public async Task<Favourite> GetByIdsAsync(Guid userId, Guid carId)
        {
            var favourite = await _repository.GetByIdsAsync(userId, carId);
            return favourite;
        }

        public FavouritesListResponse MapToResponse(Favourite favourite)
        {
            return new FavouritesListResponse
            {
                Brand = favourite.Car.Brand.ToString(),
                Model = favourite.Car.Model,
                Year = favourite.Car.Year,
                Price = favourite.Car.Price,
                Fuel = favourite.Car.Fuel.ToString(),
                CreatedAt = favourite.Car.CreatedAt,
                UpdatedAt = favourite.Car.LastChange,
                MainPhotoUrl = favourite.Car.Photos.FirstOrDefault(p => p.IsMain).ImagePath,
                AddedAt = favourite.Car.CreatedAt,
                LastPrice = favourite.LastPrice,
                IsPriceChanged = favourite.IsPriceChanged,
                IsHigherPrice = favourite.IsHigherPrice
            };
        }
    }
}
