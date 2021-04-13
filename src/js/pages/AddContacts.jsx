import { Button, Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { loadGapiInsideDOM } from 'gapi-script';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import VoterActions from '../actions/VoterActions';
import AddContactConsts from '../constants/AddContactConsts';
import VoterStore from '../stores/VoterStore';
import { renderLog } from '../utils/logging';

class AddContacts extends Component {
  constructor (props) {
    super(props);

    this.state = {
      addContactsState: AddContactConsts.uninitialized,
      setOfContacts: new Set(),
    };
    this.onGoogleSignIn = this.onGoogleSignIn.bind(this);
    this.getOtherConnections = this.getOtherConnections.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onVoterStoreChange = this.onVoterStoreChange.bind(this);
    this.changedContactSelection = this.changedContactSelection.bind(this);
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidMount () {
    const { showFooter } = this.props;
    showFooter(false);

    loadGapiInsideDOM().then(() => {
      console.log('loadGapiInsideDOM onload');
      window.gapi.load('client:auth2', this.initClient.bind(this));
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.googleSignInListener.remove();
  }

  onGoogleSignIn (signedIn) {
    // const { gapi } = window;
    const { addContactsState } = this.state;
    // const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    // console.log('onGoogleSignIn 1 >>>>>>>> ', addContactsState);
    if (addContactsState === AddContactConsts.requestingSignIn && signedIn) {
      this.setState({ addContactsState: AddContactConsts.requestingContacts });
      // console.log('Getting contacts from Google after signIn');
      this.getOtherConnections();
    } else if (addContactsState === AddContactConsts.requestingSignIn && !signedIn) {
      // console.log('Google signIn failed');
      this.setState({ addContactsState: AddContactConsts.initializedSignedOut });
    } else if (addContactsState === AddContactConsts.uninitialized) {
      this.setState({ addContactsState: signedIn ? AddContactConsts.initializedSignedIn : AddContactConsts.initializedSignedOut });
    }
  }

  onVoterStoreChange () {
    const { googleContactsStored } = VoterStore.getState();
    const { addContactsState } = this.state;
    if (addContactsState === AddContactConsts.sendingContacts) {
      if (googleContactsStored && googleContactsStored > 0) {
        this.setState({ addContactsState: AddContactConsts.savedContacts });
      } else {
        console.log('voterSendGoogleContacts failed');
        this.setState({ addContactsState: AddContactConsts.initializedSignedIn });
      }
    }
  }

  onButtonClick () {
    const { addContactsState, setOfContacts } = this.state;
    if (addContactsState === AddContactConsts.receivedContacts) {
      // console.log('Sending contacts from Google to the API Server on button click');
      const arrayOfSelectedContacts = [];
      setOfContacts.forEach((contact) => {
        if (contact.selected) {
          arrayOfSelectedContacts.push(contact);
        }
      });

      VoterActions.voterSendGoogleContacts(arrayOfSelectedContacts);
      this.setState({
        addContactsState: AddContactConsts.sendingContacts,
        arrayOfSelectedContacts,
      });
    } else {
      const { gapi } = window;
      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      if (isSignedIn) {
        // console.log('Getting contacts from Google on button click, since we were logged into Google');
        this.getOtherConnections();
        this.setState({ addContactsState: AddContactConsts.requestingContacts });
      } else {
        // console.log('Getting Auth from Google on button click, since we were not logged into Google');
        gapi.auth2.getAuthInstance().signIn();
        this.setState({ addContactsState: AddContactConsts.requestingSignIn });
      }
    }
  }

  getOtherConnections () {
    const { gapi } = window;
    const setEmail = new Set();
    const contacts = new Set();
    gapi.client.people.otherContacts.list({
      pageSize: 1000,
      readMask: 'metadata,names,emailAddresses',
    }).then((response) => {
      const others = response.result.otherContacts;
      for (let i = 0; i < others.length; i++) {
        const other = others[i];
        const person = {
          display_name: '',
          family_name: '',
          given_name: '',
          email: '',
          update_time: '',
          type: '',
        };
        if (other.emailAddresses && other.emailAddresses.length > 0) {

          const possible = other.emailAddresses[0].value.replace('<', '').replace('>', '');
          if (possible && !possible.includes(' ') && !possible.includes(',') && possible.includes('@')) {
            if (!setEmail.has(possible)) {
              setEmail.add(possible);
              person.email = possible;
              person.id = possible.replace('@', '-').replace('.', '-');
              person.selected = false;
            }
          }
        }
        if (other.names && other.names.length > 0) {
          person.display_name = other.names[0].displayName;
          person.family_name = other.names[0].familyName;
          person.given_name = other.names[0].givenName;
        }
        if (other.metadata && other.metadata.sources && other.metadata.sources.length) {
          person.type = other.metadata.sources[0].type;
          person.update_time = other.metadata.sources[0].updateTime;
        }

        if (person.email.length && person.display_name.length) {
          contacts.add(person);
        }
      }
      this.setState({ setOfContacts: contacts });
      this.setState({ addContactsState: AddContactConsts.receivedContacts  });
    });
  }

  initClient () {
    const { gapi } = window;
    const CLIENT_ID = '901895533456-gnua3m53l8e8t5tv9k1tk3tecui6uqbj.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyDZAd4b8CjDv_uRt9GVZAuOwD_X-vfCMTs';
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'];
    const SCOPES = 'https://www.googleapis.com/auth/contacts.other.readonly';

    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    }).then(() => {
      // Listen for sign-in state changes.
      this.googleSignInListener = gapi.auth2.getAuthInstance().isSignedIn.listen(this.onGoogleSignIn);
      const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      this.setState({ addContactsState: signedIn ? AddContactConsts.initializedSignedIn : AddContactConsts.initializedSignedOut });
    }, (error) => {
      console.error(JSON.stringify(error, null, 2));
    });
  }

  changedContactSelection (event) {
    const { checked: isChecked, id: idRaw } = event.target;
    const id = idRaw.replace('checkbox-', '');
    const { setOfContacts } = this.state;
    setOfContacts.forEach((contact) => {
      if (contact.id === id) {
        // eslint-disable-next-line no-param-reassign
        contact.selected = isChecked;
      }
    });
  }

  render () {
    renderLog('AddContacts');  // Set LOG_RENDER_EVENTS to log all renders

    const { addContactsState, setOfContacts, arrayOfSelectedContacts } = this.state;
    // console.log('render in AddContacts, addContactsState: ', addContactsState);

    let displayResults = false;
    let buttonDisabled = false;
    let buttonLabel = 'Get my Contacts from Google';
    if (addContactsState === AddContactConsts.receivedContacts) {
      buttonLabel = 'Save Selected Contacts to My Account';
      displayResults = true;
    } else if (addContactsState === AddContactConsts.savedContacts) {
      displayResults = false;
      buttonDisabled = true;
      buttonLabel = `${arrayOfSelectedContacts.length} Contacts Have Been Added to Your Account`;
    } else if (addContactsState === AddContactConsts.requestingContacts) {
      buttonDisabled = true;
      buttonLabel = 'Requesting Google Contacts';
    } else if (addContactsState === AddContactConsts.sendingContacts) {
      buttonDisabled = true;
      buttonLabel = 'Processing Google contacts';
    }

    let sortedContacts = [];
    if (setOfContacts.size) {
      const cons = Array.from(setOfContacts);
      sortedContacts = cons.sort((a, b) => {
        if (a.family_name < b.family_name) return -1;
        if (a.family_name > b.family_name) return 1;
        return 0;
      });
    }

    return (
      <div>
        <Helmet title="AddContacts - We Vote Campaigns" />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ContentTitle>
                Add Contacts
              </ContentTitle>
              <BigQuestion>
                How does WeVote.US keep my friends&apos; emails secure and confidential?
              </BigQuestion>
              <br />
              <ol>
                <ListItem>
                  When you import your contacts into WeVote.US they are kept private and
                  never are shared or sold to anyone.
                </ListItem>
                <ListItem>
                  You are the only one who will be able to initiate messages to your contacts
                  unless they opt-in.
                </ListItem>
                <ListItem>
                  You will be able to chose which of your contacts are saved in our cloud.
                </ListItem>
                <ListItem>
                  You can delete your contacts at any time.
                </ListItem>
              </ol>
              <br />
              <ContactsOuterContainer displayResults={displayResults}>
                Google provided&nbsp;
                <b>
                  {sortedContacts.length}
                </b>
                &nbsp;contacts.&nbsp;
                Select the friends you might want to invite at some point.
                <ContactsContainer>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '5%', padding: '0 10px', textAlign: 'left' }}>Send</th>
                        <th style={{ width: '35%', textAlign: 'left' }}>Name</th>
                        <th style={{ width: '30%', textAlign: 'left' }}>email</th>
                        <th style={{ width: '20%', textAlign: 'left' }}>Date saved to Google</th>
                      </tr>
                    </thead>
                    <tbody>
                      { sortedContacts.map((contact) => (
                        <tr key={`checkbox-${contact.id}`}>
                          <td>
                            <Checkbox
                               color="primary"
                              id={`checkbox-${contact.id}`}
                              onChange={this.changedContactSelection}
                            />
                          </td>
                          <td>{contact.display_name}</td>
                          <td>{contact.email}</td>
                          <td>{moment.utc(contact.update_time).local().format('MMM D, YYYY')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ContactsContainer>
              </ContactsOuterContainer>
              <div style={{ display: 'block' }}>
                {/* <Button
                  style={{ textTransform: 'none', fontSize: '18px', marginTop: '16px', display: 'block', width: '300px'}}
                  color="primary"
                  id="addFromContactsFromPhone"
                  variant="outlined"
                >
                  If this were Cordova we could Add Contacts from phone
                </Button> */}
                <Button
                  style={{ textTransform: 'none', fontSize: '18px', marginTop: '16px', display: 'block', width: '500px' }}
                  color="primary"
                  id="addFromGoogleContacts"
                  variant="outlined"
                  disabled={buttonDisabled}
                  onClick={this.onButtonClick}
                >
                  { buttonLabel }
                </Button>
                {/* <Button
                  style={{ textTransform: 'none', fontSize: '18px', marginTop: '16px', display: 'block', width: '300px'}}
                  color="primary"
                  id="addFromFile"
                  variant="outlined"
                >
                  Add Contacts from file (Is this just for testing?  Who has contacts in a file?)
                </Button> */}
              </div>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
      </div>
    );
  }
}
AddContacts.propTypes = {
  // classes: PropTypes.object,
  showFooter: PropTypes.func,
};

const ContentTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 20px;
  }
`;

const InnerWrapper = styled.div`
`;

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

const ListItem = styled.li`
  font-size: 18px;
  margin: 15px 0;
`;

const BigQuestion = styled.div`
  font-size: 20px;
  font-weight: 700;
  padding-top: 16px;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const ContactsOuterContainer = styled.div`
  display: ${({ displayResults }) => (displayResults ? 'block' : 'none')};
  font-size: 18px;
  font-weight: 400;
  padding-top: 10px;
`;

const ContactsContainer = styled.div`
  overflow-y: auto;
  background-color: rgb(254, 254, 228, 0.01);
  border: 1px solid darkgrey;
  margin: 16px auto 11px;
  height: 300px;
  width: 100%;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`;

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});


export default withStyles(styles)(AddContacts);
