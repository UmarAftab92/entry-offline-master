import { createLogger, format, transports } from 'winston';
import { app } from 'electron';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, printf } = format;

const _logPath = path.join(app.getPath('appData'), 'Entry', 'logs');

const logger = createLogger({
    level: 'verbose',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, label, timestamp }) => `[${label}][${level}][${timestamp}]: ${message}`),
    ),
    transports: [
        new transports.Console(),
    ],
    exitOnError: false,
});

if (process.env.NODE_ENV === 'production') {
    logger.add(new DailyRotateFile({
        level: 'info',
        filename: 'entry-offline-%DATE%.log',
        dirname: _logPath,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '14d',
        json: false, //Setting JSON as false
        formatter: ({ level, message, label, timestamp }: any) =>
            `[${label}][${level}][${timestamp}]: ${message}`,
    }));
}

export const logPath = _logPath;
export default (labelName: string) => logger.child({ label: labelName });
