using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LogMe_Server.Models.AccountViewModels
{
    public enum GenderEnum
    {
        [Display(Name = "Feminino")]
        F,
        [Display(Name = "Masculino")]
        M
    }
    public class RegisterViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email*")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "{0} deve possuir no mínimo {2} e no máximo {1} caracteres.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Senha*")]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Confirmar senha*")]
        [Compare("Password", ErrorMessage = "A senha e a confirmação são diferentes.")]
        public string ConfirmPassword { get; set; }
        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Nome*")]
        public String Name { get; set; }
        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Sobrenome*")]
        public String Surname { get; set; }
        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "CPF*")]
        public String CPF { get; set; }
        [Required]
        [Display(Name = "Sexo*")]
        public GenderEnum Gender { get; set; }
        /*
        [Display(Name = "Masculino")]
        public Boolean Male { get; set; }
        
        [Display(Name = "Feminino")]
        public Boolean Female { get; set; }*/

        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "Nascimento*")]
        public DateTime BirthDate { get; set; }
        [Required]
        [DataType(DataType.PhoneNumber)]
        [Display(Name = "Celular*")]
        public String CellPhone { get; set; }

        //OPTIONAL:
        [DataType(DataType.Text)]
        [Display(Name = "Rua/Avenida")]
        public String Street { get; set; }
        [DataType(DataType.Text)]
        [Display(Name = "Número")]
        public int? Number { get; set; }
        [DataType(DataType.Text)]
        [Display(Name = "Complemento")]
        public String Complement { get; set; }
        [DataType(DataType.Text)]
        [Display(Name = "Bairro")]
        public String Neighbourhood { get; set; }
        [DataType(DataType.Text)]
        [Display(Name = "Cidade")]
        public String City { get; set; }
        [DataType(DataType.Text)]
        [Display(Name = "Estado")]
        public String State { get; set; }
        [DataType(DataType.Text)]
        [Display(Name = "País")]
        public String Country { get; set; }
        [DataType(DataType.Text)]
        [Display(Name = "CEP")]
        public int? CEP { get; set; }
    }
}
