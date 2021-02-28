import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import muiTheme from './js/components/Widgets/mui-theme';
import ErrorBoundary from './js/components/Widgets/ErrorBoundary';
import { renderLog } from './js/utils/logging';
import styledTheme from './js/components/Widgets/styled-theme';
import WeVoteRouter from './js/components/Widgets/WeVoteRouter';

// Root URL pages
const About = React.lazy(() => import('./js/pages/About'));
const Attributions = React.lazy(() => import('./js/pages/Attributions'));
const CampaignDetailsPage = React.lazy(() => import('./js/pages/CampaignDetailsPage'));
const CampaignStartAddPolitician = React.lazy(() => import('./js/pages/CampaignStart/CampaignStartAddPolitician'));
const CampaignStartAddDescription = React.lazy(() => import('./js/pages/CampaignStart/CampaignStartAddDescription'));
const CampaignStartAddPhoto = React.lazy(() => import('./js/pages/CampaignStart/CampaignStartAddPhoto'));
const CampaignStartAddTitle = React.lazy(() => import('./js/pages/CampaignStart/CampaignStartAddTitle'));
const CampaignStartCompleteYourProfileMobile = React.lazy(() => import('./js/pages/CampaignStart/CampaignStartCompleteYourProfileMobile'));
const CampaignStartEditAll = React.lazy(() => import('./js/pages/CampaignStart/CampaignStartEditAll'));
const CampaignStartIntro = React.lazy(() => import('./js/pages/CampaignStart/CampaignStartIntro'));
const CampaignStartPreview = React.lazy(() => import('./js/pages/CampaignStart/CampaignStartPreview'));
const Credits = React.lazy(() => import('./js/pages/Credits'));
const FAQ = React.lazy(() => import('./js/pages/FAQ'));
const HomePage = React.lazy(() => import('./js/pages/HomePage'));
const Impact = React.lazy(() => import('./js/pages/Impact'));
const Membership = React.lazy(() => import('./js/pages/Membership'));
const PageNotFound = React.lazy(() => import('./js/pages/PageNotFound'));
const Privacy = React.lazy(() => import('./js/pages/Privacy'));
const SettingsEditProfile = React.lazy(() => import('./js/pages/Settings/SettingsEditProfile'));
const SettingsYourCampaigns = React.lazy(() => import('./js/pages/Settings/SettingsYourCampaigns'));
const StyleGuidePage = React.lazy(() => import('./js/pages/StyleGuidePage'));
const TermsOfService = React.lazy(() => import('./js/pages/TermsOfService'));
const TwitterSignInProcess = React.lazy(() => import('./js/pages/TwitterSignInProcess'));

// ////////////
// Test Pages
const CommentsTestPage = React.lazy(() => import('./js/pages/test/CommentsPage'));
const DetailsTestPage = React.lazy(() => import('./js/pages/test/DetailsPage'));
const HomeTestPage = React.lazy(() => import('./js/pages/test/HomeTest'));
const UpdatesTestPage = React.lazy(() => import('./js/pages/test/UpdatesPage'));


class App extends Component {
  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('App caught error ', error);
    return { hasError: true };
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('App caught error: ', `${error} with info: `, info);
  }

  render () {
    renderLog('App');  // Set LOG_RENDER_EVENTS to log all renders
    // const { location: { pathname } } = window;
    // const { params } = this.props;
    // console.log('App render, pathname:', pathname);
    return (
      <ErrorBoundary>
        <Suspense fallback={<span>Loading...</span>}>
          <MuiThemeProvider theme={muiTheme}>
            <ThemeProvider theme={styledTheme}>
              <WeVoteRouter>
                <Switch>
                  <Route exact path="/about"><About /></Route>
                  <Route exact path="/attributions"><Attributions /></Route>
                  <Route exact path="/c/:campaignSEOFriendlyPath" render={(props) => <CampaignDetailsPage match={props.match} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/comments" render={(props) => <CampaignDetailsPage match={props.match} />} />
                  <Route exact path="/c/:campaignSEOFriendlyPath/updates" render={(props) => <CampaignDetailsPage match={props.match} />} />
                  <Route exact path="/credits"><Credits /></Route>
                  <Route exact path="/edit-profile"><SettingsEditProfile /></Route>
                  <Route exact path="/faq"><FAQ /></Route>
                  <Route exact path="/id/:campaignXWeVoteId" render={(props) => <CampaignDetailsPage match={props.match} />} />
                  <Route exact path="/id/:campaignXWeVoteId/comments" render={(props) => <CampaignDetailsPage match={props.match} />} />
                  <Route exact path="/id/:campaignXWeVoteId/updates" render={(props) => <CampaignDetailsPage match={props.match} />} />
                  <Route exact path="/impact"><Impact /></Route>
                  <Route exact path="/membership"><Membership /></Route>
                  <Route exact path="/privacy"><Privacy /></Route>
                  <Route exact path="/profile/started"><SettingsYourCampaigns /></Route>
                  <Route exact path="/profile/supported"><SettingsYourCampaigns /></Route>
                  <Route exact path="/ready"><Redirect to="/" /></Route>
                  <Route exact path="/start-a-campaign"><CampaignStartIntro /></Route>
                  <Route exact path="/who-do-you-want-to-see-elected"><CampaignStartAddPolitician /></Route>
                  <Route exact path="/start-a-campaign-why-winning-matters"><CampaignStartAddDescription /></Route>
                  <Route exact path="/start-a-campaign-add-photo"><CampaignStartAddPhoto /></Route>
                  <Route exact path="/start-a-campaign-add-title"><CampaignStartAddTitle /></Route>
                  <Route exact path="/start-a-campaign-complete-your-profile"><CampaignStartCompleteYourProfileMobile /></Route>
                  <Route exact path="/start-a-campaign-edit-all"><CampaignStartEditAll /></Route>
                  <Route exact path="/start-a-campaign-preview"><CampaignStartPreview /></Route>
                  <Route exact path="/styles"><StyleGuidePage /></Route>
                  <Route exact path="/terms"><TermsOfService /></Route>
                  <Route exact path="/test/comments"><CommentsTestPage /></Route>
                  <Route exact path="/test/details"><DetailsTestPage /></Route>
                  <Route exact path="/test/home"><HomeTestPage /></Route>
                  <Route exact path="/test/updates"><UpdatesTestPage /></Route>
                  <Route path="/twitter_sign_in"><TwitterSignInProcess /></Route>
                  <Route exact path="/"><HomePage /></Route>
                  <Route path="*" component={PageNotFound} />
                </Switch>
              </WeVoteRouter>
            </ThemeProvider>
          </MuiThemeProvider>
        </Suspense>
      </ErrorBoundary>
    );
  }
}

export default App;
