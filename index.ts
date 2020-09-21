import {Bot} from './src/Bot';
import {Logger, LogLevel} from './src/Logger';
import {TwitterNotification} from './src/Notification/TwitterNotification';
import {Caseking} from './src/Crawler/Caseking';
import {AlternateDe} from './src/Crawler/AlternateDe';
import {Evga} from './src/Crawler/Evga';
import {NvidiaDe} from './src/Crawler/NvidiaDe';
import {OfficeDepotUS} from './src/Crawler/OfficeDepotUS';
require('dotenv').config();

const bot = new Bot(process.env.DELAY as unknown as number, [
  new Caseking(),
  new AlternateDe(),
  new Evga(),
  new NvidiaDe(),
  new OfficeDepotUS()
], [
  new TwitterNotification(
    process.env.TWITTER_CONSUMER_KEY as string,
    process.env.TWITTER_CONSUMER_SECRET as string,
    process.env.TWITTER_ACCESS_TOKEN_KEY as string,
    process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
  )
], new Logger(parseInt(process.env.DEBUG as unknown as string) === 1 ? LogLevel.Debug : LogLevel.Info));

bot.start();
