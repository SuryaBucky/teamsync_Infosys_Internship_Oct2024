import React from 'react'
import styled from 'styled-components'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import Benefits from './components/Benifits'
import About from './components/About'

import Faq from './components/Faq'

const Body = styled.div`
    background: #13111C;
    display: flex;
    justify-content: center;
    overflow-x: hidden;
`

const Container = styled.div`
    width: 100%;
    background-Image: linear-gradient(38.73deg, rgba(204, 0, 187, 0.25) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.25) 100%);    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Top = styled.div`
width: 100%;
display: flex;
padding-bottom: 50px;
flex-direction: column;
align-items: center;
background: linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
clip-path: polygon(0 0, 100% 0, 100% 100%,50% 95%, 0 100%);
@media (max-width: 768px) {
    clip-path: polygon(0 0, 100% 0, 100% 100%,50% 98%, 0 100%);
    padding-bottom: 0px;
}
`;
const Content = styled.div`
    width: 100%;
    height: 100%;
    background: #13111C;
    display: flex;
    flex-direction: column;
`

const Home = () => {

    return (
        <Body>
            <Container>
                <Top>
                    <Navbar/>
                    <Hero/>
                </Top>
                <Content>
                    <Features /> 
                    <Benefits />
                    <Testimonials/>
                    <Faq/>
                    <About/>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Footer />
                    </div>
                </Content>
                
            </Container>
        </Body>
    )
}

export default Home