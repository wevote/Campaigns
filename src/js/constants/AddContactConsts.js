import keyMirror from 'keymirror';

const AddContactConsts = {
  uninitialized: null,
  initializedSignedOut: null,
  initializedSignedIn: null,
  requestingSignIn: null,
  requestingContacts: null,
  sendingContacts: null,
  savedContacts: null,
  defaultVal: null,
};

export default keyMirror(AddContactConsts);
