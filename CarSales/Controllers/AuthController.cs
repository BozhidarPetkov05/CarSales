using CarSales.Contracts.DTOs.Request;
using CarSales.Contracts.Interfaces;
using CarSales.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarSales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ITokenService _tokenService;

        public AuthController(UserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateToken([FromForm] AuthTokenRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = (await _userService.GetAllAsync()).FirstOrDefault(u => u.Username == model.Username && u.Password == model.Password);
            if (user is null)
            {
                return Unauthorized();
            }

            var token = _tokenService.CreateToken(user);
            return Ok(new {token});
        }   
    }
}
