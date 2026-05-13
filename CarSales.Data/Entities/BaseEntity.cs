using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CarSales.Data.Entities
{
    public abstract class BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required DateTime LastChange { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
