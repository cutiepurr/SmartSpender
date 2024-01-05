namespace SmartSpender
{
    public enum CategoryType {
        Want,
        Need
    };

    public class TransactionCategory
    {
        public long ID { get; set; }
        public string Name { get; set; } = "";

        public CategoryType CategoryType { get; set; } = CategoryType.Want;

        public TransactionCategory(string name) {
            Name = name;
        }
    }
}