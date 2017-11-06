import {
  WORKSPACES_ADD,
  WORKSPACES_SET_ACTIVE,
} from '../../../constants/actions';

export const workspacesAdd = () => ({
  type: WORKSPACES_ADD,
});

export const workspacesSetActive = activeId => ({
  type: WORKSPACES_SET_ACTIVE,
  activeId,
});
