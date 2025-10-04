const get = (name: string, defaultValue: string | null = null): string | null => {
    const val = process.env[name];
    if (!val) {
        return defaultValue;
    }
    return val;
};

interface Config {
    env: string | null;
    jwtSecret: string | null;
    mongoUri: string | null;
    databaseName: string | null;
    appBaseUrl: string | null;
}

const config: Config = {
    env: get('NODE_ENV'),
    jwtSecret: get('JWT_SECRET'),
    mongoUri: get('MONGO_URI'),
    databaseName: get('MONGO_DATABASE_NAME'),
    appBaseUrl: get('APP_BASE_URL'),
};

export default config;
