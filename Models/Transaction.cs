namespace SmartSpender
{
    public class Transaction
    {
        public long ID { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public string Description { get; set; } = "";
        public double Amount { get; set; }
    }
}