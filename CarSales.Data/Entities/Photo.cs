using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Data.Entities
{
    public class Photo : BaseEntity
    {
        public required string ImagePath { get; set; }
        public bool IsMain { get; set; }
        public int ImageOrder {  get; set; }
        public virtual Car Car { get; set; }
        public Guid CarId { get; set; }
    }
}
