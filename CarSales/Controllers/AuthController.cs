using CarSales.Contracts.DTOs.Request;
using CarSales.Contracts.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarSales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public AuthController(IUserService userService, ITokenService tokenService)
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
                return BadRequest();
            }

            var token = _tokenService.CreateToken(user);
            return Ok(new {token});
        }   
    }
}
