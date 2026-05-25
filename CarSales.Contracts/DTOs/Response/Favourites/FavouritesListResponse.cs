namespace CarSales.Contracts.DTOs.Response.Favourites
{
    public class FavouritesListResponse
    {
        public required string Brand { get; set; }
        public required string Model { get; set; }
        public int Year { get; set; }
        public double Price { get; set; }
        public required string Fuel { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? MainPhotoUrl { get; set; }
        public DateTime AddedAt { get; set; }
        public double LastPrice { get; set; }
        public bool IsPriceChanged { get; set; }
        public bool IsHigherPrice { get; set; }
    }
}
