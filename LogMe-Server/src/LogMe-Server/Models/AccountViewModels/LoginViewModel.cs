using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LogMe_Server.Models.AccountViewModels
{
    public class LoginViewModel
    {
        [Required]
        [DataType(DataType.Text)]
        public string CPF { get; set; }

        [Required]
        [Display(Name = "Senha")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Display(Name = "Lembrar de mim?")]
        public bool RememberMe { get; set; }
    }
}
