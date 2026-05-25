namespace CarSales.Data.Entities
{
    public class Favourite
    {
        public virtual Car Car { get; set; }
        public Guid CarId { get; set; }
        public virtual User User { get; set; }
        public Guid UserId { get; set; }
        public required DateTime AddedAt { get; set; }
        public double LastPrice { get; set; }
        public bool IsPriceChanged { get; set; }
        public bool IsHigherPrice { get; set; }
    }
}
