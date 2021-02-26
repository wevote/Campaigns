import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import CampaignStartCompleteYourProfileModal from './CampaignStartCompleteYourProfileModal';
import { renderLog } from '../../utils/logging';

class CampaignStartCompleteYourProfileController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignStartCompleteYourProfileController, componentDidMount');
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    const showCampaignStartCompleteYourProfileModal = AppStore.showCampaignStartCompleteYourProfileModal();
    this.setState({
      showCampaignStartCompleteYourProfileModal,
    });
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    const showCampaignStartCompleteYourProfileModal = AppStore.showCampaignStartCompleteYourProfileModal();
    this.setState({
      showCampaignStartCompleteYourProfileModal,
    });
  }

  closeModal () {
    AppActions.setShowCampaignStartCompleteYourProfileModal(false);
  }

  render () {
    renderLog('CampaignStartCompleteYourProfileController');  // Set LOG_RENDER_EVENTS to log all renders

    const { showCampaignStartCompleteYourProfileModal } = this.state;
    return (
      <div>
        {showCampaignStartCompleteYourProfileModal && (
          <CampaignStartCompleteYourProfileModal
            show={showCampaignStartCompleteYourProfileModal}
            closeFunction={this.closeModal}
          />
        )}
      </div>
    );
  }
}
CampaignStartCompleteYourProfileController.propTypes = {
};

export default CampaignStartCompleteYourProfileController;
