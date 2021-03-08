import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import { renderLog } from '../../utils/logging';
import LoadingWheel from '../LoadingWheel';
import DonationCancelOrRefund from './DonationCancelOrRefund';

/* global $ */

class DonationList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      donationJournalList: null,
    };
    this.isMobile = this.isMobile.bind(this);
  }

  componentDidMount () {
    this.onDonateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
    this.setState({ donationJournalList: DonateStore.getVoterDonationHistory() });
    if (this.props.showOrganizationPlan) {
      DonateActions.donationRefreshDonationList();
    }
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
  }

  onDonateStoreChange = () => {
    this.setState({ donationJournalList: DonateStore.getVoterDonationHistory() });
  };

  isMobile = () => $(window).width() < 1280;

  journalRows = () => {
    const { displayDonations, showOrganizationPlan } = this.props;
    const { donationJournalList } = this.state;
    const rows = [];
    let id = 0;
    donationJournalList.forEach((item) => {
      // console.log('donationJournalList item:', item);
      const { record_enum: recordEnum, refund_days_limit: refundDaysLimit,
        subscription_canceled_at: subscriptionCanceledAt, subscription_ended_at: subscriptionEndedAt,
        created, amount, brand, last4, last_charged: lastCharged,
        exp_month: expMonth, exp_year: expYear, stripe_status: stripeStatus, is_organization_plan: isOrgPlan } = item;
      if (displayDonations) {
        if ((recordEnum === 'PAYMENT_FROM_UI' || recordEnum === 'PAYMENT_AUTO_SUBSCRIPTION') &&
          ((!showOrganizationPlan && !isOrgPlan) || (showOrganizationPlan && isOrgPlan))) {
          const refundDays = parseInt(refundDaysLimit, 10);
          const isActive = moment.utc(created).local().isAfter(moment(new Date()).subtract(refundDays, 'days')) &&
            !stripeStatus.includes('refund');
          const active = isActive ? 'Active' : 'No';
          const waiting = amount === '0.00';
          const cancelText = '';
          rows.push({
            id: id++,
            date: moment.utc(created).format('MMM D, YYYY'),
            amount,
            monthly: !waiting ? amount : 'waiting',
            isChip: false,
            campaign: '',
            payment: recordEnum === 'PAYMENT_FROM_UI' ? 'One time' : 'Subscription',
            card: brand,
            ends: `... ${last4}`,
            expires: `${expMonth}/${expYear}`,
            status: stripeStatus === 'succeeded' ? 'Paid' : stripeStatus,
            item,
            displayDonations,
            active,
            isActive,
            cancelText,
            showOrganizationPlan,
          });
        }
      } else if (recordEnum === 'SUBSCRIPTION_SETUP_AND_INITIAL' &&
        ((!showOrganizationPlan && !isOrgPlan) || (showOrganizationPlan && isOrgPlan))) {
        const isActive = subscriptionCanceledAt === 'None' && subscriptionEndedAt === 'None';
        const active = isActive ? 'Yes' : 'No';
        const cancel = subscriptionCanceledAt !== 'None' ?
          moment.utc(subscriptionCanceledAt).format('MMM D, YYYY') : '';
        const lastcharged = lastCharged === 'None' ? '' :
          moment.utc(lastCharged).format('MMM D, YYYY');
        const waiting = amount === '0.00';
        rows.push({
          id: id++,
          active,
          isActive,
          started: moment.utc(created)
            .format('MMM D, YYYY'),
          amount: !waiting ? amount : 'waiting',
          lastCharged: !waiting ? lastcharged : 'waiting',
          card: !waiting ? brand : 'waiting',
          ends: !waiting ? `... ${last4}` : 'waiting',
          expires: !waiting ? `${expMonth}/${expYear}` : 'waiting',
          canceled: cancel,
        });
      }
    });

    // March 6, 2021 TODO: Remove the following block of test code, once the "Chip In" submission code is working.
    if (displayDonations) {
      rows.push({
        id: id++,
        date: 'Mar 3, 2021',
        amount: '$9.99',
        monthly: '',
        isChip: true,
        campaign: 'Joe for School Board',
        payment: 'One time',
        card: 'Visa',
        ends: '... 9999',
        expires: '09/99',
        status: 'Paid',
        item: {},
        displayDonations: true,
        active: 'True',
        isActive: true,
        cancelText: 'nope',
        showOrganizationPlan: false,
      });
    }
    return rows;
  }

  render () {
    renderLog('DonationList');  // Set LOG_RENDER_EVENTS to log all renders
    const { displayDonations, showOrganizationPlan } = this.props;
    const isDeskTop = !this.isMobile();

    if (!this.state.donationJournalList) {
      console.log('donationJournalList not yet received in DonationList render');
      return LoadingWheel;
    }

    const rows = this.journalRows();

    if (!displayDonations) {
      return (
        <TableContainer component={Paper}>
          <Table aria-label="Subscription table">
            <TableHead>
              <TableRow>
                {isDeskTop && <StyledTableHeaderCell align="center">Active</StyledTableHeaderCell>}
                <StyledTableHeaderCell align="center">Started</StyledTableHeaderCell>
                <StyledTableHeaderCell align="right">Monthly</StyledTableHeaderCell>
                <StyledTableHeaderCell align="right">Last Charged</StyledTableHeaderCell>
                {isDeskTop && (
                  <>
                    <StyledTableHeaderCell align="right">Card</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="right">Ends With</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="right">Exp</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="right">Canceled</StyledTableHeaderCell>
                  </>
                )}
                <StyledTableHeaderCell align="center">Info</StyledTableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {isDeskTop && (
                    <StyledTableCell align="center">{row.active}</StyledTableCell>
                  )}
                  <StyledTableCell align="center">{row.started}</StyledTableCell>
                  <StyledTableCell align="right">{row.amount}</StyledTableCell>
                  <StyledTableCell align="right">{row.lastCharged}</StyledTableCell>
                  {isDeskTop && (
                    <>
                      <StyledTableCell align="right">{row.card}</StyledTableCell>
                      <StyledTableCell align="right">{row.last4}</StyledTableCell>
                      <StyledTableCell align="right">{row.expires}</StyledTableCell>
                      <StyledTableCell align="right">{row.canceled}</StyledTableCell>
                    </>
                  )}
                  <StyledTableCell align="center">
                    <DonationCancelOrRefund item={row}
                                            refundDonation={displayDonations}
                                            active={row.isActive}
                                            cancelText=""
                                            showOrganizationPlan={showOrganizationPlan}
                    />
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      return (
        <TableContainer component={Paper}>
          <Table aria-label="Donation table">
            <TableHead>
              <TableRow>
                <StyledTableHeaderCell align="left">Date</StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">Donation Type</StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">Campaign</StyledTableHeaderCell>
                <StyledTableHeaderCell align="right">Amount</StyledTableHeaderCell>
                {isDeskTop && (
                  <>
                    <StyledTableHeaderCell align="right">Monthly</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="right">Payment</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="right">Card</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="right">Ends</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="right">Exp</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="right">Status</StyledTableHeaderCell>
                  </>
                )}
                {/* <StyledTableHeaderCell align="center">Info</StyledTableHeaderCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <StyledTableCell align="left">{row.date}</StyledTableCell>
                  <StyledTableCell align="center">{row.isChip ? 'Chip In' : 'Membership Payment'}</StyledTableCell>
                  <StyledTableCell align="right">{row.campaign}</StyledTableCell>
                  <StyledTableCell align="right">{row.amount}</StyledTableCell>
                  {isDeskTop && (
                    <>
                      <StyledTableCell align="right">{row.monthly}</StyledTableCell>
                      <StyledTableCell align="right">{row.payment}</StyledTableCell>
                      <StyledTableCell align="right">{row.card}</StyledTableCell>
                      <StyledTableCell align="right">{row.ends}</StyledTableCell>
                      <StyledTableCell align="right">{row.expires}</StyledTableCell>
                      <StyledTableCell align="right">{row.status}</StyledTableCell>
                    </>
                  )}
                  {/* <StyledTableCell align="center"> */}
                  {/*  <DonationCancelOrRefund item={row} */}
                  {/*                          refundDonation={displayDonations} */}
                  {/*                          active={row.isActive} */}
                  {/*                          cancelText="" */}
                  {/*                          showOrganizationPlan={showOrganizationPlan} */}
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
  displayDonations: PropTypes.bool,
  showOrganizationPlan: PropTypes.bool,
};

const StyledTableCell = styled(TableCell)`
  padding: 8px;
`;
const StyledTableHeaderCell = styled(TableCell)`
  padding: 8px;
  color: black;
`;

export default DonationList;
