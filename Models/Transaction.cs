namespace SmartSpender
{
    public class Transaction
    {
        public long ID { get; set; }
        public DateTime Timestamp { get; set; }
        public string Description { get; set; } = "";
        public double Amount { get; set; }
    }
}