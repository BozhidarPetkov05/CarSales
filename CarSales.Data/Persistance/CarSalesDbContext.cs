using CarSales.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CarSales.Data.Persistance
{
    public class CarSalesDbContext : DbContext
    {
        public DbSet<Car> Cars { get; set; }
        public DbSet<Favourite> Favourites { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<User> Users { get; set; }

        public CarSalesDbContext(DbContextOptions<CarSalesDbContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region User
            modelBuilder.Entity<User>()
                .HasData(new User
                {
                    Id = Guid.Parse("d0b4e918-06b0-4e53-b10d-31331a02c1e5"),
                    CreatedAt = new DateTime(2026, 5, 13),
                    LastChange = new DateTime(2026, 5, 13),
                    Username = "admin",
                    Password = "admin",
                    FirstName = "Admin",
                    LastName = "Admin",
                    Age = 1,
                    IsAdmin = true,
                });
            #endregion

            #region Favourite
            modelBuilder.Entity<Favourite>()
                .HasKey(f => new { f.UserId, f.CarId });

            modelBuilder.Entity<Favourite>()
                .HasOne(f => f.User)
                .WithMany(f => f.Favourites)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Favourite>()
                .HasOne(f => f.Car)
                .WithMany(f => f.Favourites)
                .HasForeignKey(f => f.CarId)
                .OnDelete(DeleteBehavior.Restrict);
            #endregion
        }
    }
}
