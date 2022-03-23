import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import anonymous from '../../../img/global/icons/avatar-generic.png';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import { renderLog } from '../../common/utils/logging';
import CampaignStartStore from '../../stores/CampaignStartStore';
import CampaignStore from '../../stores/CampaignStore';
import DeletePoliticianCheckbox from './DeletePoliticianCheckbox';

class EditPoliticianList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPoliticianList: [],
    };
  }

  componentDidMount () {
    // console.log('EditPoliticianList, componentDidMount');
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.onCampaignStartStoreChange();
  }

  componentDidUpdate (prevProps) {
    // console.log('EditPoliticianList componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStartStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStartStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onCampaignStartStoreChange () {
    const { campaignXWeVoteId, editExistingCampaign } = this.props;
    let campaignPoliticianList = [];
    if (editExistingCampaign) {
      campaignPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    } else {
      campaignPoliticianList = CampaignStartStore.getCampaignPoliticianList();
    }
    this.setState({
      campaignPoliticianList,
    });
  }

  render () {
    renderLog('EditPoliticianList');  // Set LOG_RENDER_EVENTS to log all renders

    const { externalUniqueId } = this.props;
    const {
      campaignPoliticianList,
    } = this.state;
    // console.log('render EditPoliticianList campaignPoliticianList ', campaignPoliticianList);
    if (!campaignPoliticianList || campaignPoliticianList.length === 0) {
      return null;
    }
    let politicianImageUrl = '';
    return (
      <Wrapper>
        <ColumnFullWidth>
          <CampaignPoliticianListWrapper>
            { campaignPoliticianList.map((campaignPolitician) => {
              // console.log('one');
              if (campaignPolitician.we_vote_hosted_profile_image_url_tiny) {
                politicianImageUrl = campaignPolitician.we_vote_hosted_profile_image_url_tiny;
              } else {
                politicianImageUrl = anonymous;
              }
              return (
                <CampaignPoliticianRow key={`campaignPoliticianList-${campaignPolitician.politician_name}-${externalUniqueId}`}>
                  <CampaignPoliticianWrapper>
                    <CampaignPoliticianNameAndImageWrapper>
                      <CampaignPoliticianImage src={politicianImageUrl} width="32px" height="32px" />
                      <CampaignPoliticianName>
                        {campaignPolitician.politician_name}
                      </CampaignPoliticianName>
                    </CampaignPoliticianNameAndImageWrapper>
                    {campaignPolitician.state_code && (
                      <CampaignPoliticianState>
                        {convertStateCodeToStateText(campaignPolitician.state_code)}
                      </CampaignPoliticianState>
                    )}
                  </CampaignPoliticianWrapper>
                  <CampaignPoliticianDelete>
                    <DeletePoliticianCheckbox campaignXPoliticianId={campaignPolitician.campaignx_politician_id} />
                  </CampaignPoliticianDelete>
                </CampaignPoliticianRow>
              );
            })}
          </CampaignPoliticianListWrapper>
        </ColumnFullWidth>
      </Wrapper>
    );
  }
}
EditPoliticianList.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  editExistingCampaign: PropTypes.bool,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
});

const CampaignPoliticianDelete = styled('div')`
  margin-bottom: 8px;
`;

const CampaignPoliticianListWrapper = styled('div')`
  margin-top: 15px;
`;

const CampaignPoliticianImage = styled('img')`
  border-radius: 3px;
  margin-bottom: 8px;
  margin-right: 4px;
`;

const CampaignPoliticianName = styled('div')`
  margin-bottom: 8px;
`;

const CampaignPoliticianRow = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const CampaignPoliticianState = styled('div')`
  color: #999;
  margin-bottom: 8px;
  margin-left: 10px;
`;

const CampaignPoliticianNameAndImageWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`;

const CampaignPoliticianWrapper = styled('div')(({ theme }) => (`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  //@media (max-width: 1005px) {
  ${theme.breakpoints.down('lg')} {
    flex-wrap: wrap;
  }
`));

const ColumnFullWidth = styled('div')`
  padding: 8px 12px;
  width: 100%;
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(EditPoliticianList);
