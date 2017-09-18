using IdentityServer4.Models;
using IdentityServer4.Services;
using LogMe_Server.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LogMe_Server.Services
{
    public class LogMeProfileService : IProfileService
    {
        private readonly IUserClaimsPrincipalFactory<ApplicationUser> _claimsFactory;
        private readonly UserManager<ApplicationUser> _userManager;

        public LogMeProfileService(UserManager<ApplicationUser> userManager,
            IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory)
        {
            _userManager = userManager;
            _claimsFactory = claimsFactory;
        }

        // not virtual or abstract, therefore not overridable
        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            //var sub = context.Subject.GetSubjectId();

            var user = await _userManager.GetUserAsync(context.Subject);//_userManager.FindByIdAsync(sub);
            var principal = await _claimsFactory.CreateAsync(user);

            var cs = principal.Claims.ToList();
            if (!context.AllClaimsRequested)
            {
                cs = cs.Where(claim => context.RequestedClaimTypes.Contains(claim.Type)).ToList();
            }

            // Add User Properties
            cs.Add(new System.Security.Claims.Claim(StandardScopes.Email.Name, user.Email));
            cs.Add(new System.Security.Claims.Claim("CPF", user.CPF));

            context.IssuedClaims = cs;
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            //var sub = context.Subject.GetSubjectId();
            var user = await _userManager.GetUserAsync(context.Subject);// _userManager.FindByIdAsync(sub);
            context.IsActive = user != null;
        }
    }
}
