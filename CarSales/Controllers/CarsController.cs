using CarSales.Contracts.DTOs.Request.Car;
using CarSales.Contracts.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
    }
}
