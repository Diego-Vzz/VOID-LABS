export * from './server/users.interface';

import * as Dashboard from './actions/dashboard.actions';
import * as Create from './actions/createsystemuser.actions';
import * as Get from './actions/userdata.actions';
export const Action = {
    Dashboard,
    Create,
    Get
}