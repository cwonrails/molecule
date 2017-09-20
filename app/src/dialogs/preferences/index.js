import React from 'react';
import PropTypes from 'prop-types';

import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import AppBar from 'material-ui/AppBar';
import blue from 'material-ui/colors/blue';
import BuildIcon from 'material-ui-icons/Build';
import Button from 'material-ui/Button';
import CodeIcon from 'material-ui-icons/Code';
import ColorLensIcon from 'material-ui-icons/ColorLens';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import HistoryIcon from 'material-ui-icons/History';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import MouseIcon from 'material-ui-icons/Mouse';
import Paper from 'material-ui/Paper';
import SecurityIcon from 'material-ui-icons/Security';
import Slide from 'material-ui/transitions/Slide';
import Switch from 'material-ui/Switch';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { MenuItem } from 'material-ui/Menu';
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
} from 'material-ui/List';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialogs/preferences/actions';
import { open as openDialogClearBrowsingData } from '../../state/dialogs/clear-browsing-data/actions';
import { open as openDialogInjectCSS } from '../../state/dialogs/inject-css/actions';
import { open as openDialogInjectJS } from '../../state/dialogs/inject-js/actions';
import { open as openDialogUserAgent } from '../../state/dialogs/user-agent/actions';
import { open as openDialogReset } from '../../state/dialogs/reset/actions';
import { open as openDialogRelaunch } from '../../state/dialogs/relaunch/actions';
import { requestLogOut } from '../../senders/auth';
import { requestOpenInBrowser } from '../../senders/generic';
import { requestSetPreference } from '../../senders/preferences';

import {
  STRING_ACCOUNT,
  STRING_ADVANCED,
  STRING_APPERANCE,
  STRING_CHANGE,
  STRING_CLEAR_BROWSING_DATA_DESC,
  STRING_CLEAR_BROWSING_DATA,
  STRING_CLOSE,
  STRING_CONTINUE,
  STRING_DARK_THEME_DESC,
  STRING_DARK_THEME,
  STRING_DEFAULT,
  STRING_DEVELOPERS,
  STRING_GENERAL,
  STRING_INJECT_CSS,
  STRING_INJECT_JS,
  STRING_LEARN_MORE,
  STRING_LEFT,
  STRING_LOG_OUT,
  STRING_LOGGED_IN_AS,
  STRING_NAVIGATION_BAR_POSITION,
  STRING_NONE,
  STRING_OPEN_WEBCATALOG,
  STRING_PREFERENCES,
  STRING_PRIVACY_AND_SECURITY,
  STRING_PRIVACY_NOTE,
  STRING_RESET_DESC,
  STRING_RESET,
  STRING_RIGHT,
  STRING_SHOW_NAVIGATION_BAR,
  STRING_SHOW_TITLE_BAR,
  STRING_SIGN_IN_INSTRUCTION,
  STRING_SWIPE_TO_NAVIGATE_DESC,
  STRING_SWIPE_TO_NAVIGATE,
  STRING_SYSTEM,
  STRING_TOP,
  STRING_TRACKPAD,
  STRING_USE_HARDWARE_ACCELERATION,
  STRING_USER_AGENT,
} from '../../constants/strings';

import EnhancedMenu from '../../shared/enhanced-menu';
import FakeTitleBar from '../../shared/fake-title-bar';

const styles = theme => ({
  dialogContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  dialogContentRight: {
    flex: 1,
    padding: 24,
    background: theme.palette.background.default,
    overflow: 'auto',
  },
  paperTitleContainer: {
    border: 'none',
    outline: 'none',
    '&:not(:first-child)': {
      marginTop: 36,
    },
  },
  paperTitle: {
    width: '100%',
    maxWidth: 720,
    margin: '0 auto',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: 4,
    paddingLeft: 16,
    fontSize: 13,
  },
  paper: {
    maxWidth: 720,
    margin: '0 auto',
  },
  appBar: {
    position: 'relative',
    zIndex: 1,
  },
  listContainer: {
    flex: '0 0 252px',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  flex: {
    flex: 1,
  },
  accountSection: {
    padding: 16,
    textAlign: 'center',
  },
  accountSectionButton: {
    marginTop: 12,
  },
  link: {
    color: blue[500],
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const getNavigationBarPositionString = (navigationBarPosition) => {
  switch (navigationBarPosition) {
    case 'top':
      return STRING_TOP;
    case 'right':
      return STRING_RIGHT;
    case 'left':
    default:
      return STRING_LEFT;
  }
};

const getSecondaryText = (text) => {
  if (text && text.length > 40) {
    return `${text.substring(0, 40).trim()}...`;
  }

  return text;
};

class PreferencesDialog extends React.Component {
  constructor(props) {
    super(props);
    this.scrollIntoView = this.scrollIntoView.bind(this);
  }

  scrollIntoView(refName) {
    // Explicitly scrollIntoView the text input using the raw DOM API
    const divFirst = this[refName];
    divFirst.scrollIntoView();
  }

  render() {
    const {
      classes,
      darkTheme,
      email,
      injectCSS,
      injectJS,
      isLoggedIn,
      navigationBarPosition,
      onClose,
      onOpenDialogClearBrowsingData,
      onOpenDialogInjectCSS,
      onOpenDialogInjectJS,
      onOpenDialogRelaunch,
      onOpenDialogReset,
      onOpenDialogUserAgent,
      open,
      showNavigationBar,
      showTitleBar,
      swipeToNavigate,
      useHardwareAcceleration,
      userAgent,
    } = this.props;

    const { scrollIntoView } = this;

    return (
      <Dialog
        fullScreen
        onRequestClose={onClose}
        open={open}
        transition={<Slide direction="up" />}
      >
        <FakeTitleBar />
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography type="title" color="inherit" className={classes.flex}>
              {STRING_PREFERENCES}
            </Typography>
            <Button color="contrast" onClick={onClose}>
              {STRING_CLOSE}
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.dialogContent}>
          <div className={classes.listContainer}>
            <List subheader={<ListSubheader>{STRING_GENERAL}</ListSubheader>} dense>
              <ListItem
                button
              >
                <ListItemIcon>
                  <ColorLensIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_APPERANCE}
                  onClick={() => scrollIntoView('apperanceTitle')}
                />
              </ListItem>
              {window.platform === 'darwin' && <ListItem
                button
              >
                <ListItemIcon>
                  <MouseIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_TRACKPAD}
                  onClick={() => scrollIntoView('trackpadTitle')}
                />
              </ListItem>}
              <ListItem
                button
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_ACCOUNT}
                  onClick={() => scrollIntoView('accountTitle')}
                />
              </ListItem>
            </List>
            <List subheader={<ListSubheader>{STRING_ADVANCED}</ListSubheader>} dense>
              <ListItem
                button
              >
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_PRIVACY_AND_SECURITY}
                  onClick={() => scrollIntoView('privacyAndSecurityTitle')}
                />
              </ListItem>
              <ListItem
                button
              >
                <ListItemIcon>
                  <BuildIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_SYSTEM}
                  onClick={() => scrollIntoView('systemTitle')}
                />
              </ListItem>
              <ListItem
                button
              >
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_DEVELOPERS}
                  onClick={() => scrollIntoView('developersTitle')}
                />
              </ListItem>
              <ListItem
                button
              >
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_RESET}
                  onClick={() => scrollIntoView('resetTitle')}
                />
              </ListItem>
            </List>
          </div>
          <div className={classes.dialogContentRight}>
            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.apperanceTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                {STRING_APPERANCE}
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem
                  button
                  onClick={() => {
                    requestSetPreference('darkTheme', !darkTheme);
                    onOpenDialogRelaunch();
                  }}
                >
                  <ListItemText
                    primary={STRING_DARK_THEME}
                    secondary={STRING_DARK_THEME_DESC}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={darkTheme}
                      onChange={(e, checked) => {
                        requestSetPreference('darkTheme', checked);
                        onOpenDialogRelaunch();
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem
                  button
                  onClick={() => {
                    requestSetPreference('showNavigationBar', !showNavigationBar);
                  }}
                >
                  <ListItemText
                    primary={STRING_SHOW_NAVIGATION_BAR}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={showNavigationBar}
                      onChange={(e, checked) => {
                        requestSetPreference('showNavigationBar', checked);
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                {showNavigationBar && <Divider />}
                {showNavigationBar && <ListItem button>
                  <ListItemText
                    primary={STRING_NAVIGATION_BAR_POSITION}
                    secondary={getNavigationBarPositionString(navigationBarPosition)}
                  />
                  <ListItemSecondaryAction>
                    <EnhancedMenu
                      id="navigationBarPosition"
                      buttonElement={(
                        <IconButton aria-label={STRING_CHANGE}>
                          <KeyboardArrowRightIcon />
                        </IconButton>
                      )}
                    >
                      {['left', 'right', 'top'].map(option => (
                        <MenuItem
                          key={option}
                          onClick={() => requestSetPreference('navigationBarPosition', option)}
                        >
                          {getNavigationBarPositionString(option)}
                        </MenuItem>
                      ))}
                    </EnhancedMenu>
                  </ListItemSecondaryAction>
                </ListItem>}
                <Divider />
                <ListItem
                  button
                  onClick={() => {
                    if (window.platform !== 'darwin' || !showNavigationBar) return;
                    requestSetPreference('showTitleBar', !showTitleBar);
                  }}
                >
                  <ListItemText
                    primary={STRING_SHOW_TITLE_BAR}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={window.platform === 'darwin' && showNavigationBar ? showTitleBar : true}
                      disabled={window.platform !== 'darwin' || !showNavigationBar}
                      onChange={(e, checked) => {
                        requestSetPreference('showTitleBar', checked);
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            {window.platform === 'darwin' && <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.trackpadTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                {STRING_TRACKPAD}
              </Typography>
            </div>}
            {window.platform === 'darwin' && <Paper className={classes.paper}>
              <List dense>
                <ListItem
                  button
                  onClick={() => {
                    requestSetPreference('swipeToNavigate', !swipeToNavigate);
                    onOpenDialogRelaunch();
                  }}
                >
                  <ListItemText
                    primary={STRING_SWIPE_TO_NAVIGATE}
                    secondary={(
                      <span
                        dangerouslySetInnerHTML={{ __html: STRING_SWIPE_TO_NAVIGATE_DESC }}
                      />
                    )}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={swipeToNavigate}
                      onChange={(e, checked) => {
                        requestSetPreference('swipeToNavigate', checked);
                        onOpenDialogRelaunch();
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>}

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.accountTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                {STRING_ACCOUNT}
              </Typography>
            </div>
            <Paper className={classes.paper}>
              {isLoggedIn ? (
                <div className={classes.accountSection}>
                  <Typography type="body1">
                    <span
                      dangerouslySetInnerHTML={{ __html: STRING_LOGGED_IN_AS.replace('{email}', email) }}
                    />
                  </Typography>
                  <Button
                    raised
                    className={classes.accountSectionButton}
                    onClick={requestLogOut}
                  >
                    {STRING_LOG_OUT}
                  </Button>
                </div>
              ) : (
                <div className={classes.accountSection}>
                  <Typography type="body1">
                    {STRING_SIGN_IN_INSTRUCTION}
                  </Typography>
                  <Button raised className={classes.accountSectionButton}>
                    {STRING_OPEN_WEBCATALOG}
                  </Button>
                </div>
              )}
            </Paper>

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.privacyAndSecurityTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                {STRING_PRIVACY_AND_SECURITY}
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem button>
                  <ListItemText
                    primary={(
                      <span>
                        <span>{STRING_PRIVACY_NOTE} </span>
                        <a
                          className={classes.link}
                          role="link"
                          tabIndex="0"
                          onClick={() => requestOpenInBrowser('https://www.intercom.com/in-app-messaging')}
                        >
                          {STRING_LEARN_MORE}
                        </a>
                      </span>
                    )}
                  />
                </ListItem>
                <ListItem button onClick={onOpenDialogClearBrowsingData}>
                  <ListItemText
                    primary={STRING_CLEAR_BROWSING_DATA}
                    secondary={STRING_CLEAR_BROWSING_DATA_DESC}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={STRING_CONTINUE}
                      onClick={onOpenDialogClearBrowsingData}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.systemTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                {STRING_SYSTEM}
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem
                  button
                  onClick={() => {
                    requestSetPreference('useHardwareAcceleration', !useHardwareAcceleration);
                    onOpenDialogRelaunch();
                  }}
                >
                  <ListItemText
                    primary={STRING_USE_HARDWARE_ACCELERATION}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={useHardwareAcceleration}
                      onChange={(e, checked) => {
                        requestSetPreference('useHardwareAcceleration', checked);
                        onOpenDialogRelaunch();
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.developersTitle = el; }}
            >
              <Typography
                type="body2"
                className={classes.paperTitle}
              >
                {STRING_DEVELOPERS}
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem button onClick={onOpenDialogUserAgent}>
                  <ListItemText
                    primary={STRING_USER_AGENT}
                    secondary={
                      userAgent && userAgent.length > 0 ?
                        getSecondaryText(userAgent)
                        : STRING_DEFAULT
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton aria-label={STRING_CHANGE} onClick={onOpenDialogUserAgent}>
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem button onClick={onOpenDialogInjectCSS}>
                  <ListItemText
                    primary={STRING_INJECT_CSS}
                    secondary={
                      injectCSS && injectCSS.length > 0 ?
                        getSecondaryText(injectCSS)
                        : STRING_NONE
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={STRING_CHANGE}
                      onClick={onOpenDialogInjectCSS}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem button onClick={onOpenDialogInjectJS}>
                  <ListItemText
                    primary={STRING_INJECT_JS}
                    secondary={
                      injectJS && injectJS.length > 0 ?
                        getSecondaryText(injectJS)
                        : STRING_NONE
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton aria-label={STRING_CHANGE} onClick={onOpenDialogInjectJS}>
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.resetTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                {STRING_RESET}
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem button onClick={onOpenDialogReset}>
                  <ListItemText
                    primary={STRING_RESET}
                    secondary={STRING_RESET_DESC}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={STRING_CONTINUE}
                      onClick={onOpenDialogReset}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </div>
        </div>
      </Dialog>
    );
  }
}

PreferencesDialog.defaultProps = {
  open: false,
  email: null,
  darkTheme: false,
  showNavigationBar: true,
  showTitleBar: false,
  navigationBarPosition: 'left',
  swipeToNavigate: true,
  useHardwareAcceleration: true,
  userAgent: null,
  injectCSS: '',
  injectJS: '',
};

PreferencesDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  darkTheme: PropTypes.bool,
  email: PropTypes.string,
  injectCSS: PropTypes.string,
  injectJS: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  navigationBarPosition: PropTypes.oneOf(['top', 'left', 'right']),
  onClose: PropTypes.func.isRequired,
  onOpenDialogClearBrowsingData: PropTypes.func.isRequired,
  onOpenDialogInjectCSS: PropTypes.func.isRequired,
  onOpenDialogInjectJS: PropTypes.func.isRequired,
  onOpenDialogRelaunch: PropTypes.func.isRequired,
  onOpenDialogReset: PropTypes.func.isRequired,
  onOpenDialogUserAgent: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  showNavigationBar: PropTypes.bool,
  showTitleBar: PropTypes.bool,
  swipeToNavigate: PropTypes.bool,
  useHardwareAcceleration: PropTypes.bool,
  userAgent: PropTypes.string,
};

const mapStateToProps = (state) => {
  const {
    darkTheme,
    injectCSS,
    injectJS,
    navigationBarPosition,
    showNavigationBar,
    showTitleBar,
    swipeToNavigate,
    useHardwareAcceleration,
    userAgent,
  } = state.preferences;

  return {
    darkTheme,
    email: state.user.apiData.email,
    injectCSS,
    injectJS,
    isLoggedIn: Boolean(state.auth.token && state.auth.token !== 'anonymous'),
    navigationBarPosition,
    open: state.dialogs.preferences.open,
    showNavigationBar,
    showTitleBar,
    swipeToNavigate,
    useHardwareAcceleration,
    userAgent,
  };
};

const actionCreators = {
  close,
  openDialogClearBrowsingData,
  openDialogInjectCSS,
  openDialogInjectJS,
  openDialogRelaunch,
  openDialogReset,
  openDialogUserAgent,
};

export default connectComponent(
  PreferencesDialog,
  mapStateToProps,
  actionCreators,
  styles,
);
