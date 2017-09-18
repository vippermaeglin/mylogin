using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace LogMe_Server.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
		/*public override ICollection<IdentityUserClaim<string>> Claims
        {
            get
            {
                GetUserProperties(this.Id);
                List<IdentityUserClaim<string>> claims = new List<IdentityUserClaim<string>>
                {
                    new IdentityUserClaim<string>() {ClaimType = "CPF", ClaimValue = "teste" }
                };
                return claims;
                //return base.Claims;
            }
        }*/

        public void GetUserProperties(string id)
        {
            /*ApplicationDbContext applicationDbContext = new ApplicationDbContext(new DbContextOptions < ApplicationDbContext >());
            UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(applicationDbContext));
            var user = userManager.FindByIdAsync(id);*/
            //ApplicationUser user = System.Web.HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>().FindById(System.Web.HttpContext.Current.User.Identity.GetUserId());
        }
        
        /*public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            //var userIdentity = await manager.GetUserAsync(AccountController.HttpContext.User);
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            userIdentity.AddClaim(new Claim("FirstName", this.FirstName));

            return userIdentity;
        }*/

        //REQUIRED:
        public String Name { get; set; }
        public String Surname { get; set; }
        public String CPF { get; set; }
        public String Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public String CellPhone { get; set; }

        //OPTIONAL:
        public String Street { get; set; }
        public int? Number { get; set; }
        public String Complement { get; set; }
        public String Neighbourhood { get; set; }
        public String City { get; set; }
        public String State { get; set; }
        public String Country { get; set; }
        public int? CEP { get; set; }

        //TODO: Just not the moment yet...

        /*public long DriverNumber { get; set; }
        public int DriverMonth { get; set; }
        public int DriverYear { get; set; }
        public DateTime DriverFirstDate { get; set; }
        public char DriverCategory { get; set; }


        //TODO: Create List<CreditCardModel>!!!
        public String CreditCardName { get; set; }
        public Double CreditCardNumber { get; set; }
        public int CreditCardMonth { get; set; }
        public int CreditCardYear{ get; set; }
        public int CreditCardCompany { get; set; }*/
        //public Boolean TrustedCreditCard { get; set; }
        //public DriverLicenseModel DriverLicense { get; set; }
        //TODO: Create PassportModel
        /*public Double PassportNumber { get; set; }
        public int PassportMonth { get; set; }
        public int PassportYear { get; set; }
        //TODO: Create List<PassModel>!!!
        public String PassNumber { get; set; }
        public String PassType { get; set; }
        public int PassMonth { get; set; }
        public int PassYear { get; set; }*/
        //public Boolean TrustedPassport { get; set; }
    }
}

