using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CarSales.Data.Entities
{
    public class Photo : BaseEntity
    {
        public required string ImagePath { get; set; }
        public bool IsMain { get; set; }
        public int ImageOrder {  get; set; }
        public Car Car { get; set; }
        
        [ForeignKey(nameof(Car))]
        public Guid CarId { get; set; }
    }
}
