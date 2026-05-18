using CarSales.Contracts.DTOs.Response;
using CarSales.Contracts.Interfaces;
using CarSales.Data.Entities;
using CarSales.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CarSales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Unauthorized();
            }

            IEnumerable<User> users = await _userService.GetAllAsync();

            List<UserListResponse> response = _userService.MapToListResponse(users);

            return Ok(response);
        }

        //TODO: Show user cars
        [Authorize]
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Get([FromRoute] Guid id)
        {
            var loggedUserId = User.FindFirstValue("loggedUserId");

            if (!Guid.TryParse(loggedUserId, out Guid validId))
            {
                return BadRequest();
            }

            if (!User.HasClaim("isAdmin", "True") && validId != id)
            {
                return Unauthorized();
            }

            User? user = await _userService.GetByIdAsync(validId);
            if (user is null)
            {
                return NotFound();
            }

            UserDetailedResponse response = _userService.MapToDetailedResponse(user);

            return Ok(response);
        }
    }
}
