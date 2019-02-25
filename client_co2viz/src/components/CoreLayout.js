import React, { Component } from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  height: 100%;
  background-image: linear-gradient(
    0.75turn,
    ${props => props.theme.primaryColorPink},
    ${props => props.theme.primaryColorBlue}
  );
`

const Content = styled.div`
  margin: 20px;
`

const Header = styled.div`
  height: 50px;
  color: white;
  display: flex;
  align-items: center; /* align vertical */

  p {
    display: inline;
    font-size: 26px;
    font-family: 'Times New Roman', Times, serif;
    margin: 16px 0px 0px 20px;
  }
`

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;

  p {
    color: 'white';
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
          <p>CO2 VIZ</p>
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
