﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.Models;
using IdentityServer4.Services.InMemory;
using System.Security.Claims;

namespace LogMe_Server
{
    public class Config
    {
        // scopes define the resources in your system
        public static IEnumerable<Scope> GetScopes()
        {
            return new List<Scope>
            {
                StandardScopes.OpenId,
                StandardScopes.Profile,
                StandardScopes.OfflineAccess,

                new Scope
                {
                    Name = "logme",
                    DisplayName = "LogMe Access",
                    Description = "LogMe API",
                    IncludeAllClaimsForUser = true
                }
            };
        }

        // clients want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients()
        {
            // client credentials client
            return new List<Client>
            {
                /*new Client
                {
                    ClientId = "client",
                    AllowedGrantTypes = GrantTypes.ClientCredentials,

                    ClientSecrets = new List<Secret>
                    {
                        new Secret("secret".Sha256())
                    },
                    AllowedScopes = new List<string>
                    {
                        "api1"
                    }
                },

                // resource owner password grant client
                new Client
                {
                    ClientId = "ro.client",
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,

                    ClientSecrets = new List<Secret>
                    {
                        new Secret("secret".Sha256())
                    },
                    AllowedScopes = new List<string>
                    {
                        "api1"
                    }
                },*/

                // OpenID Connect hybrid flow and client credentials client (MVC)
                new Client
                {
                    ClientId = "logme",
                    ClientName = "LogMe Client",
                    AllowedGrantTypes = GrantTypes.HybridAndClientCredentials,

                    RequireConsent = false,

                    ClientSecrets = new List<Secret>
                    {
                        new Secret("LogMe2016!".Sha256())
                    },

                    RedirectUris = new List<string>
                    {
                        "http://localhost:5002/signin-oidc"
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "http://localhost:5002"
                    },

                    AllowedScopes = new List<string>
                    {
                        StandardScopes.OpenId.Name,
                        StandardScopes.Profile.Name,
                        StandardScopes.OfflineAccess.Name,
                        "logme"
                    }
                },
                
                // OpenID Connect hybrid flow and client credentials client for JetDev
                new Client
                {
                    ClientId = "jetdev",
                    ClientName = "JetDev Lokal",
                    AllowedGrantTypes = GrantTypes.HybridAndClientCredentials,

                    RequireConsent = false,

                    ClientSecrets = new List<Secret>
                    {
                        new Secret("JetDev2016!".Sha256())
                    },

                    RedirectUris = new List<string>
                    {
                        //FB:
                        "http://localhost:4400/oauthcallback.html"
                        //OIDC:
                        //"http://localhost:4400/index.html"
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "http://localhost:4400/logoutcallback.html"
                    },

                    AllowedScopes = new List<string>
                    {
                        StandardScopes.OpenId.Name,
                        StandardScopes.Profile.Name,
                        StandardScopes.OfflineAccess.Name,
                        "logme"
                    }
                }

                //Implicit Flow
				/*new Client
                {
                    ClientId = "jetdev",
                    ClientName = "JetDev Lokal",
                    AllowedGrantTypes = GrantTypes.ImplicitAndClientCredentials,

                    RequireConsent = false,

                    RedirectUris = new List<string>
                    {
                        //FB:
                        "http://localhost:4400/oauthcallback.html"
                        //OIDC:
                        //"http://localhost:4400/index.html"
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "http://localhost:4400/logoutcallback.html"
                    },

                    AllowedScopes = new List<string>
                    {
                        StandardScopes.OpenId.Name,
                        StandardScopes.Profile.Name,
                        //StandardScopes.OfflineAccess.Name,
                        //"logme"
                    }
                }*/
            };
        }

        public static List<InMemoryUser> GetUsers()
        {
            return new List<InMemoryUser>
            {
                new InMemoryUser
                {
                    Subject = "1",
                    Username = "alice",
                    Password = "password",

                    Claims = new List<Claim>
                    {
                        new Claim("name", "Alice"),
                        new Claim("website", "https://alice.com")
                    }
                },
                new InMemoryUser
                {
                    Subject = "2",
                    Username = "bob",
                    Password = "password",

                    Claims = new List<Claim>
                    {
                        new Claim("name", "Bob"),
                        new Claim("website", "https://bob.com")
                    }
                }
            };
        }
    }
}
