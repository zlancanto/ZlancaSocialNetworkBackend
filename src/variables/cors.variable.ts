export const CORS_OPTIONS = {
    origin: function (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ): void {
        const allowedOrigins = [
            process.env.CLIENT_URL,
            process.env.CLIENT_URL_DEV
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['sessionId', 'Content-Type'],
    exposeHeaders: ['sessionId'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
    preflightContinue: false,
};