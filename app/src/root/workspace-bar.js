import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import semver from 'semver';

import AddIcon from 'material-ui-icons/Add';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import SettingsIcon from 'material-ui-icons/Settings';
import SystemUpdateAltIcon from 'material-ui-icons/SystemUpdateAlt';
import Tooltip from 'material-ui/Tooltip';

import connectComponent from '../helpers/connect-component';

import { open as openDialogPreferences } from '../state/dialogs/preferences/actions';
import {
  addWorkspace,
  setActiveWorkspace,
} from '../state/root/workspaces/actions';

import {
  STRING_ADD_WORKSPACE,
  STRING_PREFERENCES,
  STRING_UPDATE_AVAILABLE,
} from '../constants/strings';

const styles = theme => ({
  container: {
    zIndex: 3,
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: 68,
    padding: theme.spacing.unit,
    paddingTop: 18,
    boxSizing: 'border-box',
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  containerWithoutTitlebar: {
    paddingTop: 28,
  },
  innerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  innerContainerEnd: {
    flex: '0 0 auto',
  },
  innerContainerEndVert: {
    flex: '0 0 auto',
    alignItems: 'flex-end',
  },
  iconButtonRoot: {
    height: 24,
    width: 24,
    margin: '20px auto 0 auto',
  },
  iconButtonIcon: {
    height: 32,
    width: 32,
  },
  hiddenMenuItem: {
    display: 'none',
  },
  menuItem: {
    cursor: 'pointer',
  },
  badge: {
    marginLeft: 12,
  },
  avatar: {
    marginBottom: 12,
    cursor: 'pointer',
  },
  avatarActive: {
    backgroundColor: theme.palette.primary[500],
  },
});


const renderCombinator = combinator =>
  combinator
    .replace(/\+/g, ' + ')
    .replace('alt', process.platform === 'win32' ? 'alt' : '⌥')
    .replace('shift', process.platform === 'win32' ? 'shift' : '⇧')
    .replace('mod', process.platform === 'win32' ? 'ctrl' : '⌘')
    .replace('meta', '⌘')
    .toUpperCase();

const WorkspaceBar = (props) => {
  const {
    latestMoleculeVersion,
    classes,
    workspaceBarPosition,
    onAddWorkspace,
    onSetActiveWorkspace,
    onOpenDialogPreferences,
    showTitleBar,
    workspaceList,
    activeId,
  } = props;

  let tooltipPlacement;
  switch (workspaceBarPosition) {
    case 'left':
      tooltipPlacement = 'right';
      break;
    case 'right':
      tooltipPlacement = 'left';
      break;
    default:
      tooltipPlacement = 'right';
  }

  // check for update
  const currentVersion = window.packageJson.version;
  const isLatestVersion = semver.gte(currentVersion, latestMoleculeVersion);

  return (
    <Paper
      elevation={2}
      className={classnames(
        classes.container,
        window.platform === 'darwin' && !showTitleBar && classes.containerWithoutTitlebar,
      )}
    >
      <div className={classes.innerContainer}>
        {workspaceList.map((workspace, i) => (
          <Tooltip
            key={workspace.identifier}
            title={renderCombinator(`ctrl+${i + 1}`)}
            placement={tooltipPlacement}
          >
            <Avatar
              className={classnames(
                classes.avatar, workspace.identifier === activeId && classes.avatarActive)}
              onClick={() => onSetActiveWorkspace(workspace.identifier)}
            >
              {workspace.name[0]}
            </Avatar>
          </Tooltip>
        ))}
        <Tooltip
          title={`${STRING_ADD_WORKSPACE} (${renderCombinator('ctrl+n')})`}
          placement={tooltipPlacement}
        >
          <Avatar
            className={classes.avatar}
            onClick={onAddWorkspace}
          >
            <AddIcon />
          </Avatar>
        </Tooltip>
      </div>

      <div className={classnames(classes.innerContainerEnd, classes.innerContainerEndVert)}>
        {!isLatestVersion ? (
          <Tooltip
            title={STRING_UPDATE_AVAILABLE}
            placement={tooltipPlacement}
          >
            <IconButton
              aria-label={STRING_UPDATE_AVAILABLE}
              color="accent"
            >
              <SystemUpdateAltIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        <Tooltip
          title={STRING_PREFERENCES}
          placement={tooltipPlacement}
        >
          <IconButton
            aria-label={STRING_PREFERENCES}
            onClick={() => onOpenDialogPreferences()}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Paper>
  );
};

WorkspaceBar.defaultProps = {
  latestMoleculeVersion: '1.0.0',
  showTitleBar: false,
};

WorkspaceBar.propTypes = {
  activeId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  latestMoleculeVersion: PropTypes.string,
  workspaceBarPosition: PropTypes.string.isRequired,
  onAddWorkspace: PropTypes.func.isRequired,
  onSetActiveWorkspace: PropTypes.func.isRequired,
  onOpenDialogPreferences: PropTypes.func.isRequired,
  showTitleBar: PropTypes.bool,
  workspaceList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
  activeId: state.workspaces.activeId,
  canGoBack: state.nav.canGoBack,
  canGoForward: state.nav.canGoForward,
  latestMoleculeVersion: state.version.apiData.moleculeVersion,
  showTitleBar: !state.preferences.showNavigationBar || state.preferences.showTitleBar,
  workspaceBarPosition: state.preferences.navigationBarPosition,
  workspaceList: state.workspaces.list,
});

const actionCreators = {
  addWorkspace,
  openDialogPreferences,
  setActiveWorkspace,
};

export default connectComponent(
  WorkspaceBar,
  mapStateToProps,
  actionCreators,
  styles,
);
