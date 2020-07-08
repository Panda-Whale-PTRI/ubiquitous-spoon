export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('ubiquitous');
    // console.log('Loaded State :: ', serializedState);
    if (serializedState === null) {
      return undefined;
    }
    const stateObj = JSON.parse(serializedState);
    return stateObj;
  } catch (err) {
    console.log('loading State Error ::', err);
  }
};

export const persistState = (key, value) => {
  try {
    const serializedState = localStorage.getItem('ubiquitous');
    let stateObj;
    if (serializedState === null) {
      stateObj = {
        user: {
          username: '',
          foodPreference: {},
          fullName: '',
          token: '',
          intervalId: '',
        },
      };
      // console.log('Freshly created state :: ', stateObj);
    } else {
      stateObj = JSON.parse(serializedState);
      // console.log('Exisitng state :: ', stateObj);
    }
    stateObj.user[key] = value;
    // console.log('Now new State after the UPDATE :: ', JSON.stringify(stateObj));
    localStorage.setItem('ubiquitous', JSON.stringify(stateObj));
  } catch (err) {
    console.log('persisting State Error ::', err);
  }
};

export const getPersistence = (key) => {
  try {
    const serializedState = localStorage.getItem('ubiquitous');
    if (serializedState === null) {
      return undefined;
    }
    const stateObj = JSON.parse(serializedState);
    return stateObj[key];
  } catch (err) {
    console.log('getting State Error ::', err);
  }
};

export const clearPersistence = () => {
  try {
    localStorage.removeItem('ubiquitous');
  } catch (err) {
    console.log('clearing State Error ::', err);
  }
};
