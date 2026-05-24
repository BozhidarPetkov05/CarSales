using CarSales.Data.Entities;
using CarSales.Data.Persistance;
using CarSales.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Repository.Implementations
{
    public class PhotoRepository : Repository<Photo>, IPhotoRepository
    {
        public PhotoRepository(CarSalesDbContext context) : base(context)
        {
        }
    }
}
