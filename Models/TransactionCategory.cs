namespace SmartSpender
{
    public class TransactionCategory
    {
        public long ID { get; set; }
        public string Name { get; set; } = "";

        public TransactionCategory(string name) {
            Name = name;
        }
    }
}