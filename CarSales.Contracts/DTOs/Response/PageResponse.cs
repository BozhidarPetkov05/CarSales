using System;
using System.Collections.Generic;
using System.Text;

namespace CarSales.Contracts.DTOs.Response
{
    public class PageResponse<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
