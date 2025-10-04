const get = (name: any, defaultValue = null) => {
    const val = process.env[name];
    if (!val) {
        return defaultValue;
    }
    return val;
};

const config = {
    env: get('NODE_ENV'),
    jwtSecret: get('JWT_SECRET'),
    mongoUri: get('MONGO_URI'),
    databaseName: get('MONGO_DATABASE_NAME'),
    appBaseUrl: get('APP_BASE_URL'),
};

export default config;
