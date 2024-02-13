using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSpender
{
    public class Transaction
    {
        [Key] public Guid ID { get; set; } = Guid.NewGuid();
        
        [MaxLength(50)]
        public required string Email { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.Now;

        [MaxLength(255)]
        public string Description { get; set; } = "";

        public double Amount { get; set; }

        [ForeignKey(nameof(TransactionCategory))]
        public int CategoryID { get; set; } = DefaultCategory.Needs.IndexOf("Other needs");

        public TransactionCategory Category { get; set; } =
            DefaultCategory.Categories[DefaultCategory.Needs.IndexOf("Other needs")];
    }
}