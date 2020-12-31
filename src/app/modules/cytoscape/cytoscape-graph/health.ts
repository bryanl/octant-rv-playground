import { Alert } from './clarity-colors';

export interface Status {
  name: string;
  color: string;
  iconShape: string;
  class: string;
}

export const Healthy: Status = {
  name: 'Healthy',
  color: Alert.Light.Success,
  iconShape: 'success-standard',
  class: 'healthy',
};

export const Degraded: Status = {
  name: 'Degraded',
  color: Alert.Light.Warning,
  iconShape: 'warning-standard',
  class: 'degraded',
};

export const Failure: Status = {
  name: 'Failure',
  color: Alert.Light.Danger,
  iconShape: 'error-standard',
  class: 'failure',
};
