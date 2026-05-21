using CarSales.Contracts.DTOs.Request.Car;
using CarSales.Contracts.DTOs.Response.Car;
using CarSales.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.Interfaces
{
    public interface ICarService
    {
        Task<Car?> GetByIdAsync(Guid id);
        Task<IEnumerable<Car>> GetAllAsync();
        Task AddAsync(Car item);
        Task UpdateAsync(Car item);
        Task DeleteAsync(Car item);
        Car CreateCar(CarRequest request, Guid id);
        List<CarListResponse> MapToListResponse(IEnumerable<Car> cars);
        CarDetailedResponse MapToDetailedResponse(Car car);
        Task<CarPageResponse> GetAllCarsPagedAsync(CarPageRequest request);
    }
}
