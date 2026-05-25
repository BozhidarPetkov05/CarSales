using CarSales.Contracts.DTOs.Response.Favourites;
using CarSales.Data.Entities;

namespace CarSales.Contracts.Interfaces
{
    public interface IFavouriteService
    {
        Task<IEnumerable<Favourite>> GetAllAsync();
        Task<Favourite> GetByIdsAsync(Guid userId, Guid carId);
        Task AddAsync(Favourite item);
        Task DeleteAsync(Favourite item);
        List<FavouritesListResponse> MapToListResponse(IEnumerable<Favourite> favourites);
        FavouritesListResponse MapToResponse(Favourite favourite);
        Favourite CreateFavourite(Guid userId, Guid carId);
        bool CarExists(Guid carId);
        bool CarIsInFavourites(Guid carId, Guid userId);

        //FavouritesPageResponse GetPageResponse(Guid carId, Guid userId);
    }
}
