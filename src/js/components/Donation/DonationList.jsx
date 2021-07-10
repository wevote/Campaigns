import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';
import DonationCancelOrRefund from './DonationCancelOrRefund';

/* global $ */

class DonationList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      enablePolling: false,
    };
    this.isMobile = this.isMobile.bind(this);
    this.refreshRequired = this.refreshRequired.bind(this);
  }

  componentDidMount () {
    this.onDonateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setState({
      refreshCount: 0,
      activeSubscriptionCount: DonateStore.getNumberOfActiveSubscriptions(),
    });
    DonateActions.donationRefreshDonationList();
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onDonateStoreChange = () => {
    const { refreshCount, activeSubscriptionCount, enablePolling } = this.state;
    const stripeSuccess = DonateStore.donationError().length === 0;
    if (enablePolling && stripeSuccess &&
        activeSubscriptionCount === DonateStore.getNumberOfActiveSubscriptions()) {
      this.pollForWebhookCompletionAtList(60);
    }
    this.setState({
      refreshCount: refreshCount + 1,
    });
  };

  onVoterStoreChange = () => {
    // In case you sign-in while viewing the Membership page
    DonateActions.donationRefreshDonationList();
  };

  refreshRequired = () => {
    DonateActions.donationRefreshDonationList();
    this.setState({ enablePolling: true });
  }

  isMobile = () => $(window).width() < 1280;

  paymentRows = () => {
    const donationPaymentHistory = DonateStore.getVoterPaymentHistory();
    const rows = [];
    let id = 0;
    donationPaymentHistory.forEach((item) => {
      // console.log('paymentRows item:', item);
      const { record_enum: recordEnum, refund_days_limit: refundDaysLimit,
        created, amount, brand, last4, funding, last_charged: lastCharged,
        exp_month: expMonth, exp_year: expYear, stripe_status: stripeStatus,
        stripe_subscription_id: subscriptionId, is_chip_in: isChip,
        campaign_title: campaignTitle } = item;
      const refundDays = parseInt(refundDaysLimit, 10);
      const isActive = moment.utc(created).local().isAfter(moment(new Date()).subtract(refundDays, 'days')) &&
          !stripeStatus.includes('refund');
      const active = isActive ? 'Active' : 'No';
      const waiting = amount === '0.00';
      const cancelText = '';
      const stripeStatusCap = stripeStatus.charAt(0).toUpperCase() + stripeStatus.slice(1);
      const status = stripeStatusCap === 'Succeeded' ? 'Paid' : stripeStatusCap;
      let paymentText;
      if (isChip) {
        paymentText = 'Chip In';
      } else {
        paymentText = recordEnum === 'PAYMENT_FROM_UI' ? 'One time' : 'Subscription';
      }
      rows.push({
        id: id++,
        date: moment.utc(created).format('MMM D, YYYY'),
        amount,
        monthly: !waiting ? amount : 'waiting',
        isChip,
        payment: paymentText,
        card: brand,
        ends: last4,
        expires: `${expMonth}/${expYear}`,
        status,
        funding,
        lastCharged,
        active,
        isActive,
        cancelText,
        subscriptionId,
        campaignTitle,
      });
    });
    return rows;
  }

  subscriptionRows = () => {
    const { membershipTabShown, showPremiumPlan } = this.props;
    const subscriptions = DonateStore.getVoterSubscriptionHistory();
    const rows = [];
    let id = 0;
    subscriptions.forEach((item) => {
      // console.log('donationPaymentHistory item:', item);
      const { record_enum: recordEnum,
        subscription_canceled_at: subscriptionCanceledAt, subscription_ended_at: subscriptionEndedAt,
        subscription_created_at: created, amount, brand, last4, last_charged: lastCharged,
        exp_month: expMonth, exp_year: expYear, stripe_status: stripeStatus,
        stripe_subscription_id: subscriptionId } = item;
      // const refundDays = parseInt(refundDaysLimit, 10); No refunds in campaigns
      const isActive = subscriptionCanceledAt === 'None' && subscriptionEndedAt === 'None';
      const active = isActive ? 'Active' : 'No';
      const waiting = amount === '0.00';
      const cancelText = '';
      const stripeStatusCap = stripeStatus.charAt(0).toUpperCase() + stripeStatus.slice(1);
      const status = stripeStatusCap === 'Succeeded' ? 'Paid' : stripeStatusCap;
      rows.push({
        id: id++,
        date: created.length > 5 ? moment.utc(created).format('MMM D, YYYY') : 'waiting',
        amount,
        monthly: !waiting ? amount : 'waiting',
        isChip: false,
        payment: recordEnum === 'PAYMENT_FROM_UI' ? 'One time' : 'Subscription',
        brand: brand.length ? brand : 'waiting',
        last4: last4.length ? last4 : 'waiting',
        expires: expMonth > 0 ? `${expMonth}/${expYear}` : '/',
        status,
        lastCharged: lastCharged.length ? moment.utc(lastCharged).format('MMM D, YYYY') : 'waiting',
        membershipTabShown,
        active,
        isActive,
        cancelText,
        showPremiumPlan,
        subscriptionId,
      });
    });
    return rows;
  }

  pollForWebhookCompletionAtList (pollCount) {
    const { enablePolling } = this.state;
    const { activeSubscriptionCount } = this.state;
    const latestCount = DonateStore.getNumberOfActiveSubscriptions();
    console.log(`pollForWebhookCompletionAtList polling -- start: ${activeSubscriptionCount} ? ${latestCount}`);
    this.timer = setTimeout(() => {
      if (pollCount === 0 || (activeSubscriptionCount > latestCount)) {
        // console.log(`pollForWebhookCompletionAtList polling -- pollCount: ${pollCount}`);
        clearTimeout(this.timer);
        this.setState({ activeSubscriptionCount, enablePolling: false });
        return;
      }
      // console.log(`pollForWebhookCompletion polling ----- ${pollCount}`);
      DonateActions.donationRefreshDonationList();

      if (enablePolling) {
        this.pollForWebhookCompletionAtList(pollCount - 1);  // recursive call
      }
    }, 500);
  }


  render () {
    renderLog('DonationList');  // Set LOG_RENDER_EVENTS to log all renders
    const { membershipTabShown, showPremiumPlan } = this.props;

    if (membershipTabShown) {
      const subscriptionRows = this.subscriptionRows();
      return (
        <TableContainer component={Paper}>
          <Table aria-label="Subscription table">
            <TableHead>
              <TableRow>
                <StyledTableHeaderCellTablet align="center">Active</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellAll align="center">Started</StyledTableHeaderCellAll>
                <StyledTableHeaderCellAll align="right">Monthly</StyledTableHeaderCellAll>
                <StyledTableHeaderCellTablet align="center">Last Charged</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellTablet align="center">Card</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellDesktop align="center">Ends With</StyledTableHeaderCellDesktop>
                <StyledTableHeaderCellDesktop align="center">Expires</StyledTableHeaderCellDesktop>
                <StyledTableHeaderCellAll align="center">Info</StyledTableHeaderCellAll>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionRows.map((row) => (
                <TableRow key={row.id}>
                  <StyledTableCellTablet align="center">{row.active}</StyledTableCellTablet>
                  <StyledTableCellAll align="center">{row.date}</StyledTableCellAll>
                  <StyledTableCellAll align="right">{`$${row.amount}`}</StyledTableCellAll>
                  <StyledTableCellTablet align="center">{row.lastCharged}</StyledTableCellTablet>
                  <StyledTableCellTablet align="center">
                    <Tooltip title={row.subscriptionId || 'Toolman Taylor'} placement="right"><span>{row.brand}</span></Tooltip>
                  </StyledTableCellTablet>
                  <StyledTableCellDesktop align="center">{row.last4}</StyledTableCellDesktop>
                  <StyledTableCellDesktop align="center">{row.expires}</StyledTableCellDesktop>
                  <StyledTableCellAll align="center">
                    <DonationCancelOrRefund item={row}
                                            refundDonation={!membershipTabShown}
                                            active={row.isActive}
                                            cancelText=""
                                            showPremiumPlan={showPremiumPlan}
                                            refreshRequired={this.refreshRequired}
                    />
                  </StyledTableCellAll>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      const paymentRows = this.paymentRows();
      return (
        <TableContainer component={Paper}>
          <Table aria-label="Donation table">
            <TableHead>
              <TableRow>
                <StyledTableHeaderCellAll align="left">Date Paid</StyledTableHeaderCellAll>
                <StyledTableHeaderCellDesktop align="center">Donation Type</StyledTableHeaderCellDesktop>
                <StyledTableHeaderCellAll align="right">Amount</StyledTableHeaderCellAll>
                <StyledTableHeaderCellAll align="center">Campaign</StyledTableHeaderCellAll>
                <StyledTableHeaderCellTablet align="center">Card</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellTablet align="center">Ends</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellTablet align="center">Exp</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellTablet align="center">Status</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellDesktop align="center">Funding</StyledTableHeaderCellDesktop>
                {/* <StyledTableHeaderCell align="center">Info</StyledTableHeaderCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentRows.map((row) => (
                <TableRow key={row.id}>
                  <StyledTableCellAll align="left">{row.date}</StyledTableCellAll>
                  <StyledTableCellDesktop align="center">{row.isChip ? 'Chip In' : 'Membership Payment'}</StyledTableCellDesktop>
                  <StyledTableCellAll align="right">{`$${row.amount}`}</StyledTableCellAll>
                  <StyledTableCellAll align="center">{row.campaignTitle}</StyledTableCellAll>
                  <StyledTableCellTablet align="center">{row.card}</StyledTableCellTablet>
                  <StyledTableCellTablet align="center">{row.ends}</StyledTableCellTablet>
                  <StyledTableCellTablet align="center">{row.expires}</StyledTableCellTablet>
                  <StyledTableCellTablet align="center">{row.status}</StyledTableCellTablet>
                  <StyledTableCellDesktop align="center">{row.funding}</StyledTableCellDesktop>
                  {/* <StyledTableCellTablet align="center"> */}
                  {/*  <DonationCancelOrRefund item={row} */}
                  {/*                          refundDonation={membershipTabShown} */}
                  {/*                          active={row.isActive} */}
                  {/*                          cancelText="" */}
                  {/*                          showPremiumPlan={showPremiumPlan} */}
                  {/*  /> */}
                  {/* </StyledTableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }
}
DonationList.propTypes = {
  membershipTabShown: PropTypes.bool,
  showPremiumPlan: PropTypes.bool,
};

const StyledTableCellAll = styled(TableCell)`
  padding: 8px;
`;

const StyledTableCellTablet = styled(TableCell)`
  padding: 8px;
  @media (max-width: 700px) {
    display: none;
  }
`;

const StyledTableCellDesktop = styled(TableCell)`
  padding: 8px;
  @media (max-width: 1200px) {
    display: none;
  }
`;

const StyledTableHeaderCellAll = styled(TableCell)`
  padding: 8px;
  color: black;
`;

const StyledTableHeaderCellTablet = styled(TableCell)`
  padding: 8px;
  color: black;
  @media (max-width: 700px) {
    display: none;
  }
`;

const StyledTableHeaderCellDesktop = styled(TableCell)`
  padding: 8px;
  color: black;
  @media (max-width: 1200px) {
    display: none;
  }
`;

export default DonationList;
