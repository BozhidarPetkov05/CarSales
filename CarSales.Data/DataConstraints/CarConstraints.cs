using System;

namespace CarSales.Data.DataConstraints
{
    public static class CarConstraints
    {
        //Model
        public const int MinModelLength = 1;
        public const int MaxModelLength = 30;

        //Year
        public const int MinYearValue = 1800;
        public const int MaxYearValue = 2026;

        //Price
        public const decimal MinPriceValue = 1.0m;
        public const decimal MaxPriceValue = 50_000_000m;

        //Power
        public const int PowerMinValue = 1;
        public const int PowerMaxValue = 10000;

        //Engine Volume
        public const int EngineVolumeMinValue = 1;
        public const int EngineVolumeMaxValue = 50000;

        //Description
        public const int DescriptionMaxLength = 2000;
    }
}