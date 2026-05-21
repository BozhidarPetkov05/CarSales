using CarSales.Contracts.DTOs.Request.Car;
using CarSales.Contracts.DTOs.Response.Car;
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
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;
        public CarsController(ICarService carService)
        {
            _carService = carService;
        }
        
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] CarPageRequest request)
        {
            var response = await _carService.GetAllCarsPagedAsync(request);
            return Ok(response);
        }

        [Authorize]
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Get([FromRoute] Guid id)
        {
            Car? car = await _carService.GetByIdAsync(id);
            if (car is null)
            {
                return NotFound();
            }

            CarDetailedResponse response = _carService.MapToDetailedResponse(car);

            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CarRequest request)
        {
            Guid loggedUserId = Guid.Parse(User.FindFirstValue("loggedUserId"));
            Car car = _carService.CreateCar(request, loggedUserId);
            await _carService.AddAsync(car);
            return Created();
        }

        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Put([FromBody] CarRequest request, [FromRoute] Guid id)
        {
            Car? car = await _carService.GetByIdAsync(id);
            return Ok();
        }
    }
}
