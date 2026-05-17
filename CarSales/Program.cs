using CarSales.Contracts.Interfaces;
using CarSales.Contracts.Settings;
using CarSales.Data.Persistance;
using CarSales.Repository;
using CarSales.Repository.Interfaces;
using CarSales.Services;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace CarSales
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //Database
            builder.Services.AddDbContext<CarSalesDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            //Repository
            builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            //Services
            builder.Services.AddScoped<CarService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<PhotoService>();

            //Jwt
            builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
            builder.Services.AddSingleton<ITokenService, TokenService>();


            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();


        }
    }
}
