import React, { Component } from 'react';
import { AppBar, Tab, Tabs } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import { renderLog } from '../../utils/logging';
import { campaignTheme } from '../Style/campaignTheme';
import TabPanel from '../Widgets/TabPanel';
import DonationList from './DonationList';


class DonationListForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeKey: 1,
      initialDonationCount: -1,
      value: 0,
    };
  }

  componentDidMount () {
    this.onDonateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
    DonateActions.donationRefreshDonationList();  // kick off an initial refresh
    if (this.props.waitForWebhook) {
      this.pollForWebhookCompletion(60);
    }
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onDonateStoreChange () {
    if (this.state.initialDonationCount < 0) {
      const count = DonateStore.getVoterDonationHistory() ? DonateStore.getVoterDonationHistory().length : -1;
      this.setState({ donationJournalList: DonateStore.getVoterDonationHistory(), initialDonationCount: count });
    } else {
      this.setState({ donationJournalList: DonateStore.getVoterDonationHistory() });
    }
  }

  handleSelect = (selectedKey) => {
    this.setState({
      activeKey: selectedKey,
    });
    if (selectedKey === '2') {
      // It takes a 2 to 30 seconds for the charge to come back from the first charge on a subscription,
      DonateActions.donationRefreshDonationList();
    }
  };

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  pollForWebhookCompletion (pollCount) {
    // console.log(`pollForWebhookCompletion polling -- start: ${this.state.donationJournalList ? this.state.donationJournalList.length : -1}`);
    // console.log(`pollForWebhookCompletion polling -- start pollCount: ${pollCount}`);
    this.timer = setTimeout(() => {
      if (pollCount < 0 || (this.state.donationJournalList && (this.state.initialDonationCount !== this.state.donationJournalList.length))) {
        // console.log(`pollForWebhookCompletion polling -- clearTimeout: ${this.state.donationJournalList.length}`);
        // console.log(`pollForWebhookCompletion polling -- pollCount: ${pollCount}`);
        clearTimeout(this.timer);
        return;
      }
      // console.log(`pollForWebhookCompletion polling ----- ${pollCount}`);
      DonateActions.donationRefreshDonationList();
      this.pollForWebhookCompletion(pollCount - 1);
    }, 500);
  }

  render () {
    renderLog('DonationListForm');  // Set LOG_RENDER_EVENTS to log all renders
    const { value, donationJournalList } = this.state;
    console.log('this.value =========', value);
    // const { classes } = this.props;

    if (donationJournalList === undefined || donationJournalList.length === 0) {
      console.log('donationJournalList had no rows, so returned null');
      return null;
    }


    if (this.state && this.state.donationJournalList && this.state.donationJournalList.length > 0) {
      return (
        <div>
          <h4>Existing memberships and prior payments:</h4>
          <input type="hidden" value={this.state.activeKey} />
          <ThemeProvider theme={campaignTheme(false, 40)}>
            <AppBar position="relative" color="default">
              <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                aria-label="payments or subscription choice bar"
              >
                <Tab label="Memberships"
                     id={`scrollable-auto-tab-${0}`}
                     aria-controls={`scrollable-auto-tabpanel-${0}`}
                />
                <Tab label="Payment history"
                     id={`scrollable-auto-tab-${1}`}
                     aria-controls={`scrollable-auto-tabpanel-${1}`}
                />
              </Tabs>
            </AppBar>
            <div style={{ paddingBottom: 16 }}>
              <TabPanel value={value} index={0}>
                <DonationList displayDonations={false} showOrganizationPlan={false} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <DonationList displayDonations showOrganizationPlan={false} />
              </TabPanel>
            </div>
          </ThemeProvider>
        </div>
      );
    } else {
      return <span />;
    }
  }
}
DonationListForm.propTypes = {
  waitForWebhook: PropTypes.bool.isRequired,
};

export default DonationListForm;
