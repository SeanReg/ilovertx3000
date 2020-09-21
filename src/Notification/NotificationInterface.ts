import {Logger} from '../Logger';
import {RegionSpec} from '../Model/RegionSpec'

export interface NotificationInterface extends RegionSpec {
  notify(message: string, logger: Logger): void;
}
