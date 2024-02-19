using System.ComponentModel.DataAnnotations;

namespace SmartSpender
{
    public enum CategoryType {
        Want,
        Need
    };

    public class Category
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = "";

        public CategoryType CategoryType {get; set;} = CategoryType.Need;
        
    }
}