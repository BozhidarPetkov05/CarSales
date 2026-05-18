using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.DTOs.Response
{
    public class CarListResponse
    {
        public Guid Id { get; set; }
        public required string Brand { get; set; }
        public required string Model { get; set; }
        public int Year { get; set; }
        public double Price { get; set; }
        public required string Fuel { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? MainPhotoUrl { get; set; }

    }
}
