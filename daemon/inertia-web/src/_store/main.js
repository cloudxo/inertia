// @ts-nocheck
import {
  TEST_MAIN_ACTION,
} from '../_actions/_constants';

const initialState = {
  testState: 'tree',
};

const Main = (state = initialState, action) => {
  switch (action.type) {
    case TEST_MAIN_ACTION: {
      return { ...state, testState: action.payload };
    }

    default: {
      return state;
    }
  }
};

export default Main;
