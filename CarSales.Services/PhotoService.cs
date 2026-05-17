using CarSales.Data.Entities;
using CarSales.Data.Persistance;
using CarSales.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Services
{
    public class PhotoService : BaseService<Photo>
    {
        public PhotoService(IRepository<Photo> repository, CarSalesDbContext context) : base(repository, context)
        {
        }
    }
}
