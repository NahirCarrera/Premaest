import styled, { keyframes } from 'styled-components';

// Colores y temas
const colors = {
  primary: '#086e3a',
  primaryLight: 'rgba(8, 110, 58, 0.1)',
  primaryDark: '#054929',
  secondary: '#2c3e50',
  white: '#ffffff',
  lightGray: '#f8f9fa',
  mediumGray: '#e9ecef',
  darkGray: '#495057',
  black: '#212529'
};

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Estructura principal
const PageContainer = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 250px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  background-color: ${colors.lightGray};
`;

// Header
const Header = styled.header`
  grid-area: header;
  background: ${colors.primary};
  color: ${colors.white};
  padding: 0.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  img {
    height: 40px;
    width: auto;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: ${colors.white};
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: ${colors.white};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${colors.primaryDark};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-weight: 600;
`;

const UserDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${colors.white};
  min-width: 200px;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  animation: ${fadeIn} 0.2s ease-out;
`;

const DropdownItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: ${colors.darkGray};
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  border-left: 3px solid transparent;
  
  &:hover {
    background: ${colors.lightGray};
    color: ${colors.primary};
    border-left-color: ${colors.primary};
  }
`;

// Sidebar
const Sidebar = styled.aside`
  grid-area: sidebar;
  background: ${colors.white};
  border-right: 1px solid ${colors.mediumGray};
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NavMenu = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
`;

const NavItem = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: ${({ active }) => active ? colors.primary : colors.darkGray};
  background: ${({ active }) => active ? colors.primaryLight : 'transparent'};
  text-decoration: none;
  font-weight: ${({ active }) => active ? '600' : '500'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.primaryLight};
    color: ${colors.primary};
  }
`;

// Contenido principal
const MainContent = styled.main`
  grid-area: main;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  max-width: 1400px;
  margin: 0 auto;
  width: auto;
`;

const Title = styled.h1`
  text-align: center;
  color: ${colors.primary};
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${colors.white};
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);

  th, td {
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    text-align: left;
  }

  th {
    background-color: ${colors.primary};
    color: white;
  }
`;

// Footer
const Footer = styled.footer`
  grid-area: footer;
  background: ${colors.primary};
  color: ${colors.white};
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
`;

const FooterLink = styled.a`
  color: ${colors.white};
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    text-decoration: underline;
    opacity: 0.9;
  }
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.8;
`;