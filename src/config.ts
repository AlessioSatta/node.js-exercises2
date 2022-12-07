const missingSetting =
    "Attenzione: Nessun valore per questa environment variable";

const config = {
    PORT: process.env.PORT || missingSetting,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || missingSetting,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || missingSetting,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || missingSetting,
    SESSION_SECRET: process.env.SESSION_SECRET || missingSetting,
};

export default config;
