import React, { Component } from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  height: 100%;
  background: ${props => props.theme.primaryColorDark};
  background-image: linear-gradient(
    ${props => props.theme.primaryColorDark},
    ${props => props.theme.primaryColor}
  );
`

const Content = styled.div`
  margin: 20px;
`

const Header = styled.div`
  height: 50px;
  color: ${props => props.theme.accentColor};
  display: flex;
  align-items: center; /* align vertical */

  p {
    display: inline;
    font-weight: bold;
    font-size: 26px;
    margin: 16px 0px 0px 20px;
  }
`

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center; /* align vertical */

  p {
    color: ${props => props.theme.primaryColorDark};
    font-size: 12px;
    margin: 0;
    margin-left: 20px;
  }
`

class CoreLayout extends Component {
  render() {
    return (
      <ContentWrapper>
        <Header>
          <p>CO2-Viz</p>
        </Header>
        <Content>{this.props.children}</Content>
        <Footer>
          <p>Made by Linda Levänen, 2019</p>
        </Footer>
      </ContentWrapper>
    )
  }
}

export default CoreLayout
