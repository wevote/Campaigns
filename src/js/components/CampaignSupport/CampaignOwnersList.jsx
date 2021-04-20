import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignStore from '../../stores/CampaignStore';
import { renderLog } from '../../utils/logging';

class CampaignOwnersList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignXOwnerList: [],
    };
  }

  componentDidMount () {
    const { campaignXWeVoteId } = this.props;
    // console.log('CampaignOwnersList, componentDidMount campaignXWeVoteId:', campaignXWeVoteId);
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const campaignXLeadOwnerProfilePhoto = CampaignStore.getCampaignXLeadOwnerProfilePhoto(campaignXWeVoteId);
    const campaignXOwnerList = CampaignStore.getCampaignXOwnerList(campaignXWeVoteId);
    const campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    this.setState({
      campaignXLeadOwnerProfilePhoto,
      campaignXOwnerList,
      campaignXPoliticianList,
    });
  }

  componentDidUpdate (prevProps) {
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    // console.log('CampaignOwnersList, componentDidMount campaignXWeVoteId:', campaignXWeVoteId);
    const campaignXLeadOwnerProfilePhoto = CampaignStore.getCampaignXLeadOwnerProfilePhoto(campaignXWeVoteId);
    const campaignXOwnerList = CampaignStore.getCampaignXOwnerList(campaignXWeVoteId);
    const campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    // console.log('onCampaignStoreChange campaignXOwnerList: ', campaignXOwnerList);
    this.setState({
      campaignXLeadOwnerProfilePhoto,
      campaignXOwnerList,
      campaignXPoliticianList,
    });
  }

  render () {
    renderLog('CampaignOwnersList');  // Set LOG_RENDER_EVENTS to log all renders

    const { campaignXOwnerList, campaignXLeadOwnerProfilePhoto, campaignXPoliticianList } = this.state;
    // console.log('render CampaignOwnersList campaignXOwnerList ', campaignXOwnerList);
    if (!campaignXOwnerList || campaignXOwnerList.length === 0) {
      return null;
    }
    let campaignXOwnerNumber = 0;
    let campaignXPoliticianNumber = 0;
    let commaOrNot;
    return (
      <Wrapper>
        <ColumnFullWidth>
          <CampaignXOwnerListWrapper>
            <CampaignXOwnerLeadPhoto src={campaignXLeadOwnerProfilePhoto} />
            <CampaignXOwnerWrapper>
              {campaignXOwnerList.length === 1 ? (
                <>
                  {campaignXOwnerList[0].organization_name}
                </>
              ) : (
                <>
                  { campaignXOwnerList.map((campaignXOwner) => {
                    campaignXOwnerNumber += 1;
                    if (campaignXOwnerNumber >= campaignXOwnerList.length) {
                      return (
                        <span key={campaignXOwnerNumber}>
                          {' '}
                          and
                          {' '}
                          {campaignXOwner.organization_name}
                        </span>
                      );
                    } else {
                      commaOrNot = (campaignXOwnerNumber === campaignXOwnerList.length - 1) ? '' : ',';
                      return (
                        <span key={campaignXOwnerNumber}>
                          {' '}
                          {campaignXOwner.organization_name}
                          {commaOrNot}
                        </span>
                      );
                    }
                  })}
                </>
              )}
              {' '}
              started this campaign to support
              {' '}
              {campaignXPoliticianList.length === 1 ? (
                <>
                  {campaignXPoliticianList[0].politician_name}
                </>
              ) : (
                <>
                  { campaignXPoliticianList.map((campaignXPolitician) => {
                    campaignXPoliticianNumber += 1;
                    if (campaignXPoliticianNumber >= campaignXPoliticianList.length) {
                      return (
                        <span key={campaignXPoliticianNumber}>
                          {' '}
                          and
                          {' '}
                          {campaignXPolitician.politician_name}
                        </span>
                      );
                    } else {
                      commaOrNot = (campaignXPoliticianNumber === campaignXPoliticianList.length - 1) ? '' : ',';
                      return (
                        <span key={campaignXPoliticianNumber}>
                          {' '}
                          {campaignXPolitician.politician_name}
                          {commaOrNot}
                        </span>
                      );
                    }
                  })}
                </>
              )}
            </CampaignXOwnerWrapper>
          </CampaignXOwnerListWrapper>
        </ColumnFullWidth>
      </Wrapper>
    );
  }
}
CampaignOwnersList.propTypes = {
  campaignXWeVoteId: PropTypes.string,
};

const styles = () => ({
});

const CampaignXOwnerListWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: start;
`;

const CampaignXOwnerLeadPhoto = styled.img`
  border-radius: 3px;
  margin-right: 8px;
  width: 32px;
`;

const CampaignXOwnerWrapper = styled.span`
`;

const ColumnFullWidth = styled.div`
  padding: 8px 12px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(CampaignOwnersList);
