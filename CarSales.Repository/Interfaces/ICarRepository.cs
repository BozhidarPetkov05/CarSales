using CarSales.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Repository.Interfaces
{
    public interface ICarRepository : IRepository<Car>
    {
        IQueryable<Car> GetAllAsQueryable();
    }
}
