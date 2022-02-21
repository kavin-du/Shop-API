import dayjs from "dayjs";
import {pino} from "pino";
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

const log = pino({
    base: {
        pid: false, // remove pid from logger
    },
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        }
    },
    timestamp: () => `,"time":"${dayjs().format('L LTS')}"`

});

export default log;