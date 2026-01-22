import { Configuration, PopupRequest, LogLevel } from "@azure/msal-browser";

export const msalConfig: Configuration = {
    auth: {
        clientId: "0e7056a1-3aaa-431a-84a3-03d89e6378b6",
        authority: "https://revereapp.ciamlogin.com/fdfe356d-4405-426f-9668-3c2d1835a12e/v2.0",
        knownAuthorities: ["revereapp.ciamlogin.com"],
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: "localStorage", // Changed from sessionStorage to localStorage for session persistence
        storeAuthStateInCookie: true, // Enable cookie storage for better session persistence
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error('[MSAL]', message);
                        return;
                    case LogLevel.Warning:
                        // Only log warnings in development
                        if (process.env.NODE_ENV === 'development') {
                            console.warn('[MSAL]', message);
                        }
                        return;
                    case LogLevel.Info:
                        // Only log info in development
                        if (process.env.NODE_ENV === 'development') {
                            console.info('[MSAL]', message);
                        }
                        return;
                    case LogLevel.Verbose:
                        // Suppress verbose logs
                        return;
                    default:
                        return;
                }
            },
            logLevel: LogLevel.Warning, // Set minimum log level to Warning (suppress Info and Verbose)
            piiLoggingEnabled: false, // Disable PII logging for security
        },
        allowNativeBroker: false, // Disable native broker to avoid unnecessary warnings
    },
};

export const loginRequest: PopupRequest = {
    scopes: ["User.Read", "openid", "profile", "email"],
};