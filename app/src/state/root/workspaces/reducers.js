import uuidv1 from 'uuid/v1';
import { combineReducers } from 'redux';

import {
  WORKSPACES_ADD,
  WORKSPACES_SET_ACTIVE,
} from '../../../constants/actions';

const generateNewWorkspace = (order) => {
  let name;
  if (order > 8) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    name = alphabet[order - 9];
  } else {
    name = String(order + 1);
  }

  return {
    identifier: uuidv1(),
    name,
  };
};

const localStorageId = 'workspaceList_v2';
const storedList = window.localStorage.getItem(localStorageId);

const initialList = storedList ? JSON.parse(storedList) : [generateNewWorkspace(0)];
if (!storedList) {
  window.localStorage.setItem('workspaceList', JSON.stringify(initialList));
}

const list = (state = initialList, action) => {
  switch (action.type) {
    case WORKSPACES_ADD: {
      if (state.length === 20) return state;
      const newWorkspace = generateNewWorkspace(state.length);

      const newList = [...state, newWorkspace];
      window.localStorage.setItem(localStorageId, JSON.stringify(newList));

      return newList;
    }
    default:
      return state;
  }
};

const activeId = (state = initialList[0].identifier, action) => {
  switch (action.type) {
    case WORKSPACES_SET_ACTIVE: {
      return action.activeId;
    }
    default:
      return state;
  }
};

export default combineReducers({
  activeId,
  list,
});
