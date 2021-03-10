import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { AccountCircle } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import anonymous from '../../../img/global/icons/avatar-generic.png';
import LazyImage from '../../utils/LazyImage';
import { renderLog } from '../../utils/logging';
import { timeFromDate } from '../../utils/dateFormat';

class MostRecentCampaignSupport extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      comments: [
        {
          id: 1,
          name: 'Annie Brown',
          time: new Date(new Date().getTime() - 27 * 60000),
          comment: 'I vote because I care.',
        },
        {
          id: 2,
          name: 'Tony Shapiro',
          time: new Date(new Date().getTime() - 30 * 60000),
          comment: "I'm a voter because this is OUR country.",
        },
        {
          id: 4,
          name: 'Ben White',
          time: new Date(new Date().getTime() - 40 * 60000),
          comment: 'I vote because the country needs to change. All this stuff is awesome. A great voter always votes.',
        },
      ],
    };
  }

  componentDidMount () {
    const { comments } = this.state;

    this.setState({ commentsToDisplay: [
      comments[0] ? comments[0] : null,
      comments[1] ? comments[1] : null,
    ]});

    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
    this.timeInterval = setInterval(() => this.setCommentsToDisplay(), 3000);
  }

  componentWillUnmount () {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }

  setCommentsToDisplay () {
    const commentsWrapper = document.getElementById('comments-wrapper');

    let lastScroll;

    if (this.state.commentsToDisplay.length < this.state.comments.length - 2) {
      const newArray = [...this.state.commentsToDisplay];

      if (this.state.comments[this.state.commentsToDisplay.length]) {
        newArray.push(this.state.comments[this.state.commentsToDisplay.length]);

        // commentsWrapper.scrollTop = commentsWrapper.scrollHeight - commentsWrapper.clientHeight + 64;
      }

      if (this.state.comments[this.state.commentsToDisplay.length + 1]) {
        newArray.push(this.state.comments[this.state.commentsToDisplay.length + 1]);

        // commentsWrapper.scrollTop = commentsWrapper.scrollHeight - commentsWrapper.clientHeight + 32;
      } else {
        lastScroll = true;
      }

      this.setState({ commentsToDisplay: [...newArray]});

      // let height = 0;
      // commentsWrapper.childNodes.forEach((node) => {
      //   height += node.clientHeight;
      // });
      // console.log('pledge height: ', height);

      if (lastScroll) {
        commentsWrapper.scrollTop = commentsWrapper.scrollHeight - commentsWrapper.clientHeight + 64;
      } else {
        commentsWrapper.scrollTop = commentsWrapper.scrollHeight - commentsWrapper.clientHeight + 64;
      }

      // commentsWrapper.scrollTop = commentsWrapper.scrollHeight - commentsWrapper.clientHeight;
    }

    commentsWrapper.style.maxHeight = `${commentsWrapper.lastElementChild.clientHeight + commentsWrapper.lastElementChild.previousElementSibling.clientHeight + 16}px`;

    commentsWrapper.style.height = `${commentsWrapper.lastElementChild.clientHeight + commentsWrapper.lastElementChild.previousElementSibling.clientHeight + 16}px`;
  }

  render () {
    renderLog('MostRecentCampaignSupport');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { commentsToDisplay } = this.state;

    const voterPhotoUrlMedium = null;
    return (
      <Wrapper>
        {commentsToDisplay && commentsToDisplay.length > 0 ? (
          <CommentsWrapper id="comments-wrapper">
            {commentsToDisplay.map((comment) => (
              <CommentWrapper className="comment" key={comment.id}>
                <CommentVoterPhotoWrapper>
                  {voterPhotoUrlMedium ? (
                    <LazyImage
                      src={voterPhotoUrlMedium}
                      placeholder={anonymous}
                      className="profile-photo"
                      height={24}
                      width={24}
                      alt="Your Settings"
                    />
                  ) : (
                    <AccountCircle classes={{ root: classes.accountCircleRoot }} />
                  )}
                </CommentVoterPhotoWrapper>
                <CommentTextWrapper>
                  <Comment>{comment.comment}</Comment>
                  <CommentNameWrapper>
                    <CommentName>
                      {comment.name}
                    </CommentName>
                    {' '}
                    supported
                    {' '}
                    {timeFromDate(comment.time)}
                  </CommentNameWrapper>
                </CommentTextWrapper>
              </CommentWrapper>
            ))}
          </CommentsWrapper>
        ) : null }
      </Wrapper>
    );
  }
}
MostRecentCampaignSupport.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  accountCircleRoot: {
    color: '#999',
    marginRight: 8,
  },
});

const Wrapper = styled.div`
`;

const CommentsWrapper = styled.div`
  max-height: 140px;
  overflow-y: scroll;
  transition-duration: .3s;
  // scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  .comment {
    // scroll-snap-align: start;
  }

  ::-webkit-scrollbar {
    width: 0;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: transparent;
    z-index: 9999;
    border-radius: 50px;
  }
`;

const CommentTextWrapper = styled.div`
`;

const CommentVoterPhotoWrapper = styled.div`
`;

const CommentWrapper = styled.div`
  border-radius: 10px;
  border-top-left-radius: 0;
  display: flex;
  justify-content: flex-start;
  margin: 8px 0;
  width: 100%;
  // background: #2e3c5d30;
  // padding: 6px;
`;

const Comment = styled.p`
  color: #999;
  font-size: 14px;
  // font-weight: 400 !important;
  margin: 0;
`;

const CommentName = styled.span`
  color: #808080;
  font-weight: 500 !important;
`;

const CommentNameWrapper = styled.div`
  color: #999;
  font-size: 12px;
`;

export default withStyles(styles)(MostRecentCampaignSupport);
