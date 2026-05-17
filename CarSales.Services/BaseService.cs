using CarSales.Contracts.Interfaces;
using CarSales.Data.Entities;
using CarSales.Data.Persistance;
using CarSales.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Services
{
    public class BaseService<T> : IBaseService<T> where T : BaseEntity
    {
        private readonly IRepository<T> _repository;
        private readonly CarSalesDbContext _context;
        public BaseService(IRepository<T> repository, CarSalesDbContext context)
        {
            _repository = repository;
            _context = context;
        }
        public async Task<T?> GetByIdAsync(Guid id)
        { 
            return await _repository.GetByIdAsync(id);
        }
        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }
        public async Task AddAsync(T item)
        {
            await _repository.AddAsync(item);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(T item)
        {
            _repository.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(T item)
        {
            _repository.Delete(item);
            await _context.SaveChangesAsync();
        }
    }
}
