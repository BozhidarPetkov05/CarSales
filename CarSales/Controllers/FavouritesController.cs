using CarSales.Contracts.DTOs.Request.Favourite;
using CarSales.Contracts.DTOs.Response.Favourites;
using CarSales.Contracts.Interfaces;
using CarSales.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CarSales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavouritesController : ControllerBase
    {
        private readonly IFavouriteService _favouriteService;
        public FavouritesController(IFavouriteService favouriteService)
        {
            _favouriteService = favouriteService;
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var favourites = await _favouriteService.GetAllAsync();
            var response = _favouriteService.MapToListResponse(favourites);
            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        [Route("{carId}")]
        public async Task<IActionResult> Post([FromRoute] Guid carId)
        {
            Guid loggedUserId = Guid.Parse(User.FindFirstValue("loggedUserId"));
            if (!_favouriteService.CarExists(carId))
            {
                return BadRequest();
            }

            Favourite favourite = _favouriteService.CreateFavourite(loggedUserId, carId);
            await _favouriteService.AddAsync(favourite);

            return Created();
        }

        [Authorize]
        [HttpDelete]
        [Route("{carId}")]
        public async Task<IActionResult> Delete([FromRoute] Guid carId)
        {
            Guid loggedUserId = Guid.Parse(User.FindFirstValue("loggedUserId"));
            if (!_favouriteService.CarIsInFavourites(carId, loggedUserId))
            {
                return BadRequest();
            }

            Favourite favourite = await  _favouriteService.GetByIdsAsync(loggedUserId, carId);
            await _favouriteService.DeleteAsync(favourite);
            var response = _favouriteService.MapToResponse(favourite);
            return Ok(response);
        }
    }
}
