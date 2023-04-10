import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import React, { Component, Suspense } from 'react';
import ReactGA from 'react-ga4';
import { Redirect, Route, Switch } from 'react-router-dom';
import muiTheme from './js/common/components/Style/muiTheme';
import DelayedLoad from './js/common/components/Widgets/DelayedLoad';
import ErrorBoundary from './js/common/components/Widgets/ErrorBoundary';
import WeVoteRouter from './js/common/components/Widgets/WeVoteRouter';
import { renderLog } from './js/common/utils/logging';
import MainHeaderBar from './js/components/Navigation/MainHeaderBar';
import webAppConfig from './js/config';
import AppObservableStore, { messageService } from './js/common/stores/AppObservableStore';
import initializejQuery from './js/common/utils/initializejQuery';

// Lazy loaded component(s) on this page
const FooterMain  = React.lazy(() => import(/* webpackChunkName: 'FooterMain' */ './js/components/Navigation/FooterMain'));

// Root URL pages
const About = React.lazy(() => import(/* webpackChunkName: 'About' */ './js/pages/About'));
const AddContacts = React.lazy(() => import(/* webpackChunkName: 'AddContacts' */ './js/pages/AddContacts'));
const Attributions = React.lazy(() => import(/* webpackChunkName: 'Attributions' */ './js/pages/Attributions'));
const CampaignCommentsPage = React.lazy(() => import(/* webpackChunkName: 'CampaignCommentsPage' */ './js/common/pages/Campaign/CampaignCommentsPage'));
const CampaignDetailsPage = React.lazy(() => import(/* webpackChunkName: 'CampaignDetailsPage' */ './js/common/pages/Campaign/CampaignDetailsPage'));
const CampaignNewsItemDetailsPage = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemDetailsPage' */ './js/common/pages/Campaign/CampaignNewsItemDetailsPage'));
const CampaignNewsItemSend = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemSend' */ './js/pages/CampaignNewsItemPublish/CampaignNewsItemSend'));
const CampaignNewsItemShare = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemShare' */ './js/pages/CampaignNewsItemPublish/CampaignNewsItemShare'));
const CampaignNewsItemText = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemText' */ './js/pages/CampaignNewsItemPublish/CampaignNewsItemText'));
const CampaignRecommendedCampaigns = React.lazy(() => import(/* webpackChunkName: 'CampaignRecommendedCampaigns' */ './js/pages/CampaignSupport/CampaignRecommendedCampaigns'));
const CampaignStartAddDescription = React.lazy(() => import(/* webpackChunkName: 'CampaignStartAddDescription' */ './js/pages/CampaignStart/CampaignStartAddDescription'));
const CampaignStartAddPhoto = React.lazy(() => import(/* webpackChunkName: 'CampaignStartAddPhoto' */ './js/pages/CampaignStart/CampaignStartAddPhoto'));
const CampaignStartAddPolitician = React.lazy(() => import(/* webpackChunkName: 'CampaignStartAddPolitician' */ './js/pages/CampaignStart/CampaignStartAddPolitician'));
const CampaignStartAddTitle = React.lazy(() => import(/* webpackChunkName: 'CampaignStartAddTitle' */ './js/pages/CampaignStart/CampaignStartAddTitle'));
const CampaignStartEditAll = React.lazy(() => import(/* webpackChunkName: 'CampaignStartEditAll' */ './js/pages/CampaignStart/CampaignStartEditAll'));
const CampaignStartIntro = React.lazy(() => import(/* webpackChunkName: 'CampaignStartIntro' */ './js/common/pages/CampaignStart/CampaignStartIntro'));
const CampaignStartPreview = React.lazy(() => import(/* webpackChunkName: 'CampaignStartPreview' */ './js/pages/CampaignStart/CampaignStartPreview'));
const CampaignSupportEndorsement = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportEndorsement' */ './js/pages/CampaignSupport/CampaignSupportEndorsement'));
const CampaignSupportPayToPromote = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportPayToPromote' */ './js/pages/CampaignSupport/CampaignSupportPayToPromote'));
const CampaignSupportPayToPromoteProcess = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportPayToPromoteProcess' */ './js/pages/CampaignSupport/CampaignSupportPayToPromoteProcess'));
const CampaignSupportShare = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportShare' */ './js/pages/CampaignSupport/CampaignSupportShare'));
const CampaignUpdatesPage = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsPage' */ './js/common/pages/Campaign/CampaignNewsPage'));
const CompleteYourProfileMobile = React.lazy(() => import(/* webpackChunkName: 'CompleteYourProfileMobile' */ './js/pages/Settings/CompleteYourProfileMobile'));
const Credits = React.lazy(() => import(/* webpackChunkName: 'Credits' */ './js/pages/Credits'));
const FAQ = React.lazy(() => import(/* webpackChunkName: 'FAQ' */ './js/pages/FAQ'));
const HomePage = React.lazy(() => import(/* webpackChunkName: 'HomePage' */ './js/pages/HomePage'));
const Impact = React.lazy(() => import(/* webpackChunkName: 'Impact' */ './js/pages/Impact'));
const Membership = React.lazy(() => import(/* webpackChunkName: 'Membership' */ './js/pages/Membership'));
const PageNotFound = React.lazy(() => import(/* webpackChunkName: 'PageNotFound' */ './js/pages/PageNotFound'));
const Privacy = React.lazy(() => import(/* webpackChunkName: 'Privacy' */ './js/pages/Privacy'));
const SettingsEditProfile = React.lazy(() => import(/* webpackChunkName: 'SettingsEditProfile' */ './js/pages/Settings/SettingsEditProfile'));
const SettingsYourCampaigns = React.lazy(() => import(/* webpackChunkName: 'SettingsYourCampaigns' */ './js/pages/Settings/SettingsYourCampaigns'));
const StyleGuidePage = React.lazy(() => import(/* webpackChunkName: 'StyleGuidePage' */ './js/pages/StyleGuidePage'));
const SuperSharingAddContacts = React.lazy(() => import(/* webpackChunkName: 'SuperSharingAddContacts' */ './js/pages/SuperSharing/SuperSharingAddContacts'));
const SuperSharingChooseRecipients = React.lazy(() => import(/* webpackChunkName: 'SuperSharingChooseRecipients' */ './js/pages/SuperSharing/SuperSharingChooseRecipients'));
const SuperSharingComposeEmailMessage = React.lazy(() => import(/* webpackChunkName: 'SuperSharingComposeEmailMessage' */ './js/pages/SuperSharing/SuperSharingComposeEmailMessage'));
const SuperSharingSendEmail = React.lazy(() => import(/* webpackChunkName: 'SuperSharingSendEmail' */ './js/pages/SuperSharing/SuperSharingSendEmail'));
const SuperSharingIntro = React.lazy(() => import(/* webpackChunkName: 'SuperSharingIntro' */ './js/pages/SuperSharing/SuperSharingIntro'));
const TermsOfService = React.lazy(() => import(/* webpackChunkName: 'TermsOfService' */ './js/pages/TermsOfService'));
const TwitterSignInProcess = React.lazy(() => import(/* webpackChunkName: 'TwitterSignInProcess' */ './js/pages/Process/TwitterSignInProcess'));


class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      doShowHeader: true,
      doShowFooter: true,
    };
    this.setShowHeader = this.setShowHeader.bind(this);
    this.setShowFooter = this.setShowFooter.bind(this);
    this.setShowHeaderFooter = this.setShowHeaderFooter.bind(this);
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());

    let { hostname } = window.location;
    hostname = hostname || '';
    initializejQuery(() => {
      if (hostname !== 'campaigns.wevote.us') {
        console.log('jQuery loaded since host is not campaigns.wevote.us, firing siteConfigurationRetrieve');
        AppObservableStore.siteConfigurationRetrieve(hostname);
      } else {
        // Initialize Google Analytics ID with the default value from config.js
        console.log('jQuery loaded for campaigns.wevote.us, init call to onAppObservableStore');
        this.onAppObservableStoreChange();
      }
    });
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have an "Oh snap" page
    console.log('App caught error ', error);
    return { hasError: true };
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('App caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    if (!AppObservableStore.getGoogleAnalyticsEnabled() && !AppObservableStore.getGoogleAnalyticsPending()) {
      AppObservableStore.setGoogleAnalyticsPending(true);
      setTimeout(() => {
        const storedTrackingID = AppObservableStore.getChosenGoogleAnalyticsTrackingID();
        const configuredTrackingID = webAppConfig.GOOGLE_ANALYTICS_TRACKING_ID;
        const trackingID = storedTrackingID || configuredTrackingID;
        if (trackingID) {
          console.log('Google Analytics ENABLED');
          ReactGA.initialize(trackingID);
          AppObservableStore.setGoogleAnalyticsEnabled(true);
          AppObservableStore.setGoogleAnalyticsPending(false);
        } else {
          console.log('Google Analytics did not receive a trackingID, NOT ENABLED');
        }
      }, 3000);
    }
  }

  setShowHeader (doShowHeader) {
    this.setState({ doShowHeader });
  }

  setShowFooter (doShowFooter) {
    this.setState({ doShowFooter });
  }

  setShowHeaderFooter (doShow) {
    // console.log('setShowHeaderFooter -------------- doShow:', doShow);
    this.setState({
      doShowHeader: doShow,
      doShowFooter: doShow,
    });
  }

  render () {
    renderLog('App');
    const { doShowHeader, doShowFooter } = this.state;
    // console.log(`App doShowHeader: ${doShowHeader}, doShowFooter:${doShowFooter}`);

    /* eslint-disable react/jsx-one-expression-per-line */
    return (
      <ErrorBoundary>
        <Suspense fallback={<span>&nbsp;</span>}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={muiTheme}>
              <WeVoteRouter>
                <MainHeaderBar displayHeader={doShowHeader} />
                <Switch>
                  <Route exact path="/about"><About /></Route>
                  <Route exact path="/addContacts"><AddContacts showFooter={this.setShowFooter} /></Route>
                  <Route exact path="/attributions"><Attributions /></Route>
                  <Route exact path="/more/attributions"><Attributions /></Route> {/* Compatibility with common/CreditsBody */}
                  <Route exact path="/c/:campaignSEOFriendlyPath" render={(props) => <CampaignDetailsPage match={props.match} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/add-update" render={(props) => <CampaignNewsItemText match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/add-update/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemText match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/comments" render={(props) => <CampaignCommentsPage match={props.match} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/edit" render={(props) => <CampaignStartEditAll match={props.match} editExistingCampaign setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/u/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemDetailsPage match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/u-preview/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemDetailsPage inPreviewMode match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/updates" render={(props) => <CampaignUpdatesPage match={props.match} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/complete-your-profile-for-news-item" render={(props) => <CompleteYourProfileMobile match={props.match} createNewsItem setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/complete-your-support-for-this-campaign" render={(props) => <CompleteYourProfileMobile match={props.match} supportCampaign setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/pay-to-promote" render={(props) => <CampaignSupportPayToPromote match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/pay-to-promote-process" render={(props) => <CampaignSupportPayToPromoteProcess match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/recommended-campaigns" render={(props) => <CampaignRecommendedCampaigns match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/send/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemSend match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/share-campaign" render={(props) => <CampaignSupportShare match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/share-campaign-with-one-friend" render={(props) => <CampaignSupportShare match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} showShareCampaignWithOneFriend />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/share/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemShare match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/share-with-one-friend/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemShare match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} showShareCampaignWithOneFriend />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/share-it/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemShare match={props.match} noNavigation setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/share-it-with-one-friend/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemShare match={props.match} noNavigation setShowHeaderFooter={this.setShowHeaderFooter} showShareCampaignWithOneFriend />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/i-will-share-campaign" render={(props) => <CampaignSupportShare match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} iWillShare />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/super-sharing-add-email-contacts" render={(props) => <SuperSharingAddContacts email match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/super-sharing-add-sms-contacts" render={(props) => <SuperSharingAddContacts sms match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/super-sharing-campaign-email" render={(props) => <SuperSharingIntro email match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/super-sharing-campaign-sms" render={(props) => <SuperSharingIntro match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} sms />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/super-sharing-choose-email-recipients" render={(props) => <SuperSharingChooseRecipients match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/super-sharing-compose-email" render={(props) => <SuperSharingComposeEmailMessage match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/super-sharing-send-email" render={(props) => <SuperSharingSendEmail match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/why-do-you-support" render={(props) => <CampaignSupportEndorsement match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/credits"><Credits /></Route>
                  <Route exact path="/edit-profile"><SettingsEditProfile /></Route>
                  <Route exact path="/faq"><FAQ /></Route>
                  <Route exact path="/id/:campaignXWeVoteId" render={(props) => <CampaignDetailsPage match={props.match} />} />
                  <Route exact path="/id/:campaignXWeVoteId/add-update" render={(props) => <CampaignNewsItemText match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/add-update/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemText match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/comments" render={(props) => <CampaignCommentsPage match={props.match} />} />
                  <Route exact path="/id/:campaignXWeVoteId/edit" render={(props) => <CampaignStartEditAll match={props.match} editExistingCampaign setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/u/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemDetailsPage match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/u-preview/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemDetailsPage inPreviewMode match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/updates" render={(props) => <CampaignUpdatesPage match={props.match} />} />
                  <Route exact path="/id/:campaignXWeVoteId/complete-your-profile-for-news-item" render={(props) => <CompleteYourProfileMobile match={props.match} createNewsItem setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/complete-your-support-for-this-campaign" render={(props) => <CompleteYourProfileMobile match={props.match} supportCampaign setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/pay-to-promote" render={(props) => <CampaignSupportPayToPromote match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/pay-to-promote-process" render={(props) => <CampaignSupportPayToPromoteProcess match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/recommended-campaigns" render={(props) => <CampaignRecommendedCampaigns match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/send/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemSend match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/share-campaign" render={(props) => <CampaignSupportShare match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/share-campaign-with-one-friend" render={(props) => <CampaignSupportShare match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} showShareCampaignWithOneFriend />} />
                  <Route exact path="/id/:campaignXWeVoteId/share/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemShare match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/share-with-one-friend/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemShare match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} showShareCampaignWithOneFriend />} />
                  <Route exact path="/id/:campaignXWeVoteId/share-it/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemShare match={props.match} noNavigation setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/id/:campaignXWeVoteId/share-it-with-one-friend/:campaignXNewsItemWeVoteId" render={(props) => <CampaignNewsItemShare match={props.match} noNavigation setShowHeaderFooter={this.setShowHeaderFooter} showShareCampaignWithOneFriend />} />
                  <Route exact path="/id/:campaignXWeVoteId/i-will-share-campaign" render={(props) => <CampaignSupportShare match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} iWillShare />} />
                  <Route exact path="/id/:campaignXWeVoteId/why-do-you-support" render={(props) => <CampaignSupportEndorsement match={props.match} setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/impact"><Impact /></Route>
                  <Route exact path="/membership"><Membership showFooter={this.setShowFooter} /></Route>
                  <Route exact path="/more/donate"><Membership showFooter={this.setShowFooter} /></Route>  {/* Compatibility with common/CreditsBody */}
                  <Route exact path="/more/about"><About /></Route>
                  <Route exact path="/more/credits"><Credits /></Route>
                  <Route exact path="/more/faq"><FAQ /></Route>
                  <Route exact path="/privacy"><Privacy /></Route>
                  <Route exact path="/terms"><TermsOfService /></Route>
                  <Route exact path="/privacy"><Privacy /></Route>
                  <Route exact path="/profile/started"><SettingsYourCampaigns /></Route>
                  <Route exact path="/profile/supported"><SettingsYourCampaigns /></Route>
                  <Route exact path="/ready"><Redirect to="/" /></Route>
                  <Route exact path="/start-a-campaign"><CampaignStartIntro /></Route>
                  <Route exact path="/who-do-you-want-to-see-elected"><CampaignStartAddPolitician /></Route>
                  <Route exact path="/start-a-campaign-why-winning-matters"><CampaignStartAddDescription /></Route>
                  <Route exact path="/start-a-campaign-add-photo"><CampaignStartAddPhoto /></Route>
                  <Route exact path="/start-a-campaign-add-title"><CampaignStartAddTitle /></Route>
                  <Route exact path="/start-a-campaign-complete-your-profile" render={(props) => <CompleteYourProfileMobile match={props.match} startCampaign setShowHeaderFooter={this.setShowHeaderFooter} />} />
                  <Route exact path="/start-a-campaign-edit-all"><CampaignStartEditAll setShowHeaderFooter={this.setShowHeaderFooter} /></Route>
                  <Route exact path="/start-a-campaign-preview"><CampaignStartPreview /></Route>
                  <Route exact path="/styles"><StyleGuidePage /></Route>
                  <Route exact path="/terms"><TermsOfService /></Route>
                  <Route path="/twitter_sign_in"><TwitterSignInProcess setShowHeaderFooter={this.setShowHeaderFooter} /></Route>
                  <Route exact path="/"><HomePage /></Route>
                  <Route path="*" component={PageNotFound} />
                </Switch>
                <DelayedLoad waitBeforeShow={4000}>
                  {/* March 29, 2022: This forces a full rerender of the footer on every tab change, could be optimized */}
                  <Suspense fallback={<span>&nbsp;</span>}>
                    <FooterMain displayFooter={doShowFooter} />
                  </Suspense>
                </DelayedLoad>
              </WeVoteRouter>
            </ThemeProvider>
          </StyledEngineProvider>
        </Suspense>
        <span />
      </ErrorBoundary>
    );
  }
}

export default App;
