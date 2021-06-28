import moment from 'moment';
import { DATE } from 'src/common/constants';

export const formatDate = date => moment(date).format(DATE.FORMAT);
export const formatDateTime = date => moment.utc(date).format(DATE.DATETIME);
