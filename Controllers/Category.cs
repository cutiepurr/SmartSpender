namespace SmartSpender
{
    public static class DefaultCategory
    {
        public static List<string> Needs => new() {
            "Home", "Utilities", "Transport", "Health", "Other needs"
        };

        public static List<string> Wants => new() {
            "Shopping", "Eating out", "Travel", "Entertainment", "Other wants"
        };

        public static List<TransactionCategory> Categories
        {
            get
            {
                var result = new List<TransactionCategory>();
                var categories = Needs.Concat(Wants).ToList();
                for (int i = 0; i < categories.Count; i++)
                {
                    result.Add(new TransactionCategory{
                        ID = i+1,
                        Name = categories[i],
                        CategoryType = i < Needs.Count ? CategoryType.Need : CategoryType.Want
                    });
                }
                return result;
            }
        }

    };
}