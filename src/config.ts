const missingSetting =
    "Attenzione: Nessun valore per questa environment variable";

const config = {
    PORT: process.env.PORT || missingSetting,
};

export default config;
