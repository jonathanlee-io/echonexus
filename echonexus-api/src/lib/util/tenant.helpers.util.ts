import {NodeEnvironment} from '../config/environment';

export const getUrlFromNodeEnv = (
  nodeEnv: NodeEnvironment,
  subdomain: string,
) => {
  if (nodeEnv === 'production') {
    return `https://${subdomain}.echonexus.io`;
  } else if (nodeEnv === 'staging') {
    return `https://${subdomain}.staging.echonexus.io`;
  } else if (nodeEnv === 'development') {
    return `http://${subdomain}.local.echonexus.io`;
  }
  // Otherwise assume test
  return `https://${subdomain}.test.echonexus.io`;
};
