using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.DTOs.Request
{
    public class FileUpload
    {
        public IFormFile File { get; set; }
        public Guid CarId { get; set; }
    }
}
