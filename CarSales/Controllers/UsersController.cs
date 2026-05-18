using CarSales.Contracts.DTOs.Request;
using CarSales.Contracts.DTOs.Response.User;
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
        public async Task<IActionResult> Get([FromQuery] PageRequest request)
        {
            if (!User.HasClaim("isAdmin", "True"))
            {
                return Forbid();
            }

            //IEnumerable<User> users = await _userService.GetAllAsync();

            //List<UserListResponse> response = _userService.MapToListResponse(users);

            var response = await _userService.GetAllUsersPagedAsync(request.Page, request.PageSize);

            return Ok(response);
        }

        [Authorize]
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Get([FromRoute] Guid id)
        {
            var loggedUserId = User.FindFirstValue("loggedUserId");

            if (!User.HasClaim("isAdmin", "True") && Guid.Parse(loggedUserId) != id)
            {
                return Forbid();
            }

            User? user = await _userService.GetByIdAsync(id);
            if (user is null)
            {
                return NotFound();
            }

            UserDetailedResponse response = _userService.MapToDetailedResponse(user);

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserRequest model)
        {
            if (await _userService.UsernameExists(model.Username))
            {
                return BadRequest();
            }

            User user = _userService.CreateUser(model);
            await _userService.AddAsync(user);
            return Created();
        }

        [Authorize]
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Put([FromBody] UserRequest model, [FromRoute] Guid id)
        {
            var loggedUserId = User.FindFirstValue("loggedUserId");

            if (!User.HasClaim("isAdmin", "True") && Guid.Parse(loggedUserId) != id)
            {
                return Forbid();
            }

            User? user = await _userService.GetByIdAsync(id);
            if (user is null)
            {
                return NotFound();
            }

            if (user.Username != model.Username && await _userService.UsernameExists(model.Username))
            {
                return BadRequest();
            }

            if (!User.HasClaim("isAdmin", "True"))
            {
                model.IsAdmin = false;
            }

            User updatedUser = _userService.UpdateUser(model, user);
            await _userService.UpdateAsync(updatedUser);

            UpdatedUserResponse response = _userService.MapToUpdatedUserResponse(updatedUser);

            return Ok(response);
        }

        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var loggedUserId = User.FindFirstValue("loggedUserId");

            if (!User.HasClaim("isAdmin", "True") && Guid.Parse(loggedUserId) != id)
            {
                return Forbid();
            }

            User? user = await _userService.GetByIdAsync(id);
            if (user is null)
            {
                return NotFound();
            }

            UpdatedUserResponse deactivated = await _userService.DeactivateUser(user);

            return Ok(deactivated);
        }
    }
}
