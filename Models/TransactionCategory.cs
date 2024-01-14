namespace SmartSpender
{
    public enum CategoryType {
        Want,
        Need
    };

    public class TransactionCategory
    {
        public int ID { get; set; }
        public string Name { get; set; } = "";

        public CategoryType CategoryType {get; set;} = CategoryType.Need;
    }
}