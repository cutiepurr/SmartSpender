using System.ComponentModel.DataAnnotations;

namespace SmartSpender
{
    public class Transaction
    {
        public long ID { get; set; }
        
        [MaxLength(50)]
        public required string Email { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.Now;

        [MaxLength(255)]
        public string Description { get; set; } = "";

        public double Amount { get; set; }

        public int CategoryID { get; set; } = DefaultCategory.Needs.IndexOf("Other needs");
    }
}