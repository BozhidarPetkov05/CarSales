using CarSales.Data.Entities;
using CarSales.Data.Persistance;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.Implementations
{
    public class CarService : BaseService<Car>
    {
        public CarService(Repository.Interfaces.IRepository<Car> repository, CarSalesDbContext context) : base(repository, context)
        {
        }
    }
}
