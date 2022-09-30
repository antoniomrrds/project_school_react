import * as types from '../types';
const initialState = {
  clickedButton: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.CLICKED_BUTTON_REQUEST: {
      console.log('Im making the request');
      return state;
    }
    case types.CLICKED_BUTTON_FAILURE: {
      console.log('something went wrong');
      return state;
    }
    case types.CLICKED_BUTTON_SUCCESS: {
      console.log('Success');
      const newState = { ...state };
      newState.clickedButton = !newState.clickedButton;
      return newState;
    }

    default: {
      return state;
    }
  }
}
