import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import OpenExternalWebSite from '../components/Widgets/OpenExternalWebSite';
import { organizationalDonors, teamOfVolunteers } from '../constants/people';
import { isWebApp } from '../utils/cordovaUtils';
import { renderLog } from '../utils/logging';

class Credits extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('Credits');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Helmet title="Credits and Thanks - We Vote Campaigns" />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ContentTitle>
                Credits &amp; Thanks
              </ContentTitle>
              <Section>
                <CreditsDescriptionContainer>
                  <span>
                    We are thankful to these organizations which are critical to our work.
                    {' '}
                    The companies on this list give us free or heavily discounted services (since we are a nonprofit), and
                    {' '}
                    the nonprofits overcome so many challenges to provide the data or other services we rely on.
                    {' '}
                    Please also see the
                    {' '}
                    <Link to="/attributions" id="attributions">
                      summary of open source software
                    </Link>
                    {' '}
                    We Vote uses.
                  </span>
                  <CompanyWrapper>
                    { organizationalDonors.map((item) => (
                      <CreditsCompany key={item.alt}>
                        <div>
                          <CreditsCompanyLogoContainer>
                            {
                              item.logo && (
                                <CreditsCompanyLogo
                                  src={item.logo}
                                  alt={`${item.alt} logo`}
                                />
                              )
                            }
                          </CreditsCompanyLogoContainer>
                          <CreditsCompanyInfo>
                            {item.name && <strong>{item.name}</strong>}
                            {item.title && (
                              <CreditsCompanyTitle>
                                {item.title}
                              </CreditsCompanyTitle>
                            )}
                          </CreditsCompanyInfo>
                        </div>
                      </CreditsCompany>
                    )) }
                  </CompanyWrapper>
                </CreditsDescriptionContainer>
                <CreditsDescriptionContainer>
                  <SectionTitle>Volunteers, Interns &amp; Donors</SectionTitle>
                  We couldn&apos;t do what we do without your help.
                  {' '}
                  Please join us by
                  {' '}
                  <OpenExternalWebSite
                    linkIdAttribute="wevoteJoinUs"
                    url="https://www.idealist.org/en/nonprofit/f917ce3db61a46cb8ad2b0d4e335f0af-we-vote-oakland#volops"
                    target="_blank"
                    className="open-web-site open-web-site__no-right-padding"
                    body={(
                      <span>
                        finding a role that excites you on our page at Idealist.org
                        <i className="fas fa-external-link-alt" />
                      </span>
                    )}
                  />
                  {isWebApp() && (
                    <span>
                      , or
                      {' '}
                      <Link to="/more/donate">
                        donating now
                      </Link>
                    </span>
                  )}
                  .
                  <br />
                  <br />
                  <ul>
                    { teamOfVolunteers.map((item) => (
                      <div key={item.name}>
                        <li>
                          <strong>{item.name}</strong>
                          {item.title && (
                            <span>
                              {' '}
                              -
                              {' '}
                              {item.title}
                            </span>
                          )}
                        </li>
                      </div>
                    ))}
                  </ul>
                  <br />
                  <br />
                  This list is in rough order of number of volunteer hours spent (10+ hours) or monetary donation level. Individual monetary donors only listed with express permission.
                  {' '}
                  (Our apologies if you should be on this list and are missing. Please contact Dale McGrew with corrections.)
                </CreditsDescriptionContainer>
              </Section>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
      </div>
    );
  }
}

const styles = (theme) => ({
  buttonContained: {
    borderRadius: 32,
    height: 50,
    [theme.breakpoints.down('md')]: {
      height: 36,
    },
  },
});

const ContentTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 20px;
  }
`;

const CompanyWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  text-align: center;
  margin-top: 25px;
`;

const CreditsCompany = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em 0 1em 0;;
  max-width: 220px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 45%;
    width: 45%;
  }
`;

const CreditsCompanyInfo = styled.div`
`;

const CreditsCompanyLogo = styled.img`
  width: 300px;
  max-height: 120px;
  max-width: 100%;
`;

const CreditsCompanyLogoContainer = styled.div`
  margin-bottom: 10px;
`;

const CreditsCompanyTitle = styled.p`
  color: #555;
`;

const CreditsDescriptionContainer = styled.div`
  margin: 1em auto;
  width: 960px;
  max-width: 90vw;
  text-align: left;
  @media (min-width: 960px) and (max-width: 991px) {
    > * {
      width: 90%;
      margin: 0 auto;
    }
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    margin: 0 auto;
  }
`;

const InnerWrapper = styled.div`
`;

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 15px;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const Section = styled.div`
`;

const SectionTitle = styled.h1`
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
    margin-bottom: 9px;
  }
`;

export default withStyles(styles)(Credits);
