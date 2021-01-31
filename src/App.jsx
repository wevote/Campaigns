import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import muiTheme from './js/components/Widgets/mui-theme';
import ErrorBoundary from './js/components/Widgets/ErrorBoundary';
import { renderLog } from './js/utils/logging';
import styledTheme from './js/components/Widgets/styled-theme';
import WeVoteRouter from './js/components/Widgets/WeVoteRouter';

const DetailsPage = React.lazy(() => import('./js/pages/DetailsPage'));
const CommentsPage = React.lazy(() => import('./js/pages/CommentsPage'));
const HomePage = React.lazy(() => import('./js/pages/HomePage'));
const HomeTest = React.lazy(() => import('./js/pages/HomeTest'));
const PageNotFound = React.lazy(() => import('./js/pages/PageNotFound'));
const StyleGuidePage = React.lazy(() => import('./js/pages/StyleGuidePage'));
const UpdatesPage = React.lazy(() => import('./js/pages/UpdatesPage'));


class App extends Component {
  constructor (props) {
    super(props);
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
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
                  <Route exact path="/comments">
                    <CommentsPage />
                  </Route>
                  <Route exact path="/details">
                    <DetailsPage />
                  </Route>
                  <Route exact path="/hometest">
                    <HomeTest />
                  </Route>
                  <Route exact path="/styles">
                    <StyleGuidePage />
                  </Route>
                  <Route exact path="/updates">
                    <UpdatesPage />
                  </Route>
                  <Route exact path="/">
                    <HomePage />
                  </Route>
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
