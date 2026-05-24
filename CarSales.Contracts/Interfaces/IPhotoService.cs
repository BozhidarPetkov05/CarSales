using CarSales.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.Interfaces
{
    public interface IPhotoService
    {
        Task AddAsync(Photo item);
    }
}
