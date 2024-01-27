const configuration = {
    SERVER_URL: String(import.meta.env.VITE_SERVER_URL),
    APP_ID: String(import.meta.env.VITE_APP_ID),
    TOKEN: String(import.meta.env.VITE_TOKEN),
    CHANNEL: String(import.meta.env.VITE_CHANNEL),
}

export default configuration;