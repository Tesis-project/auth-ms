
import { parse } from 'url';

interface DbConfig_I {
  dbName: string;
  user: string;
  password: string;
  host: string;
  port: number;
}

function parseDbUrl(dbUrl: string): DbConfig_I {
  const parsedUrl = parse(dbUrl);
  const [user, password] = (parsedUrl.auth || '').split(':');
  const [host, port] = (parsedUrl.host || '').split(':');
  const dbName = (parsedUrl.path || '').split('/')[1];

  return {
    dbName,
    user,
    password,
    host,
    port: Number(port),
  };
}

export default parseDbUrl;