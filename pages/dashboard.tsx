import { GetServerSideProps, NextPage } from 'next';
import { parse } from 'cookie';
import { UserData } from '@/types/auth';
import styled, { keyframes } from 'styled-components';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { FiHome, FiBook, FiUser, FiCalendar, FiSettings, FiLogOut, FiChevronDown, FiInfo } from 'react-icons/fi';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// Colores y temas
const colors = {
  primary: '#086e3a',
  primaryLight: 'rgba(8, 110, 58, 0.1)',
  primaryDark: '#054929',
  secondary: '#2c3e50',
  accent: '#e74c3c',
  white: '#ffffff',
  lightGray: '#f8f9fa',
  mediumGray: '#e9ecef',
  darkGray: '#495057',
  black: '#212529',
  success: '#28a745',
  info: '#17a2b8',
  warning: '#ffc107',
  danger: '#dc3545'
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Estructura principal
const DashboardContainer = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 250px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  background-color: ${colors.lightGray};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "footer";
  }
`;

// Header mejorado
const Header = styled.header`
  grid-area: header;
  background: ${colors.primary};
  color: ${colors.white};
  padding: 0.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
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
  z-index: 1000;
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

  svg {
    font-size: 1.1rem;
  }
`;

// Sidebar mejorado
const Sidebar = styled.aside`
  grid-area: sidebar;
  background: ${colors.white};
  border-right: 1px solid ${colors.mediumGray};
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    display: none;
  }
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

  svg {
    font-size: 1.1rem;
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  font-size: 0.8rem;
  color: ${colors.darkGray};
  text-align: center;
  border-top: 1px solid ${colors.mediumGray};
  margin-top: auto;
`;

// Contenido principal con paneles
const MainContent = styled.main`
  grid-area: main;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Panel = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  height: fit-content;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${colors.mediumGray};
`;

const PanelTitle = styled.h2`
  font-size: 1.25rem;
  color: ${colors.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${colors.primaryDark};
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: ${colors.darkGray};
`;

const InfoValue = styled.span`
  color: ${colors.black};
`;

const SystemStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatusCard = styled.div`
  background: ${colors.lightGray};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatusTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  color: ${colors.primary};
`;

const StatusText = styled.p`
  margin: 0;
  color: ${colors.darkGray};
  font-size: 0.9rem;
`;

const StatusBadge = styled.span<{ variant: 'success' | 'warning' | 'danger' | 'info' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ variant }) => colors[variant] + '20'};
  color: ${({ variant }) => colors[variant]};
`;

// Footer profesional
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

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
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
interface DashboardProps {
  user: UserData;
  currentPeriod: {
    code: string;
    start_date: string;
    end_date: string;
  };
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async ({ req }) => {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.mi_token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  const userData: UserData = JSON.parse(token);

  // Consultar usuario
  const { data: userRecord, error: userError } = await supabase
    .from('users')
    .select('user_id, username, first_name, last_name, role')
    .eq('user_id', userData.id)
    .single();

  if (userError || !userRecord) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  // Consultar último período
  const { data: lastPeriod, error: periodError } = await supabase
    .from('registration_periods')
    .select('code, start_date, end_date')
    .order('start_date', { ascending: false })
    .limit(1)
    .single();

  if (periodError || !lastPeriod) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return {
    props: {
      user: userRecord,
      currentPeriod: lastPeriod
    }
  };
};

const Dashboard: NextPage<DashboardProps> = ({ user, currentPeriod }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const systemStatus = [
    {
      title: "Período Actual",
      text: currentPeriod.code,
      status: "success",
      statusText: "Activo"
    },
    {
      title: "Pre-matrículas",
      text: `Del ${new Date(currentPeriod.start_date).toLocaleDateString()} al ${new Date(currentPeriod.end_date).toLocaleDateString()}`,
      status: "info",
      statusText: "En curso"
    },
    {
      title: "Sistema",
      text: "Todos los servicios operativos",
      status: "success",
      statusText: "Estable"
    }
  ];

  return (
    <DashboardContainer>
      <Header>
        <Logo>
          <Image 
            src="/images/logo_espe.png" 
            alt="Logo PREMAEST" 
            width={120} 
            height={40}
          />
          <h1>PREMAEST</h1>
        </Logo>
        
        <UserMenu>
          <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
            <UserAvatar>
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </UserAvatar>
            <span>{user.first_name}</span>
            <FiChevronDown />
          </UserButton>
          
          <UserDropdown isOpen={isUserMenuOpen}>
            <Link href="/perfil" passHref>
              <DropdownItem onClick={() => setIsUserMenuOpen(false)}>
                <FiUser /> Mi Perfil
              </DropdownItem>
            </Link>
            <Link href="/configuracion" passHref>
              <DropdownItem onClick={() => setIsUserMenuOpen(false)}>
                <FiSettings /> Configuración
              </DropdownItem>
            </Link>
            <DropdownItem as="button" onClick={handleLogout}>
              <FiLogOut /> Cerrar sesión
            </DropdownItem>
          </UserDropdown>
        </UserMenu>
      </Header>

      <Sidebar>
        <NavMenu>
          <Link href="/dashboard" passHref>
            <NavItem active>
              <FiHome /> Inicio
            </NavItem>
          </Link>
          <Link href="/registro-asignaturas" passHref>
            <NavItem>
              <FiBook /> Registro de Asignaturas
            </NavItem>
          </Link>
          <Link href="/asignaturas-aprobadas" passHref>
            <NavItem>
              <FiBook /> Mis Asignaturas
            </NavItem>
          </Link>
        </NavMenu>

      </Sidebar>

      <MainContent>
        <Panel>
          <PanelHeader>
            <PanelTitle>
              <FiUser /> Información del Usuario
            </PanelTitle>
          </PanelHeader>
          
          <UserInfo>
            <InfoRow>
              <InfoLabel>Nombre:</InfoLabel>
              <InfoValue>{user.first_name} {user.last_name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Rol:</InfoLabel>
              <InfoValue>{user.role}</InfoValue>
            </InfoRow>
          </UserInfo>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>
              <FiInfo /> Estado del Sistema
            </PanelTitle>
          </PanelHeader>
          
          <SystemStatus>
            {systemStatus.map((item, index) => (
              <StatusCard key={index}>
                <StatusTitle>{item.title}</StatusTitle>
                <StatusText>{item.text}</StatusText>
                <StatusBadge variant={item.status as any}>{item.statusText}</StatusBadge>
              </StatusCard>
            ))}
          </SystemStatus>
        </Panel>
      </MainContent>

      <Footer>
        <FooterLinks>
          <FooterLink href="#">Términos de Servicio</FooterLink>
          <FooterLink href="#">Política de Privacidad</FooterLink>
          <FooterLink href="#">Contacto</FooterLink>
          <FooterLink href="#">Soporte Técnico</FooterLink>
        </FooterLinks>
        
        <Copyright>
          © {new Date().getFullYear()} Universidad de las Fuerzas Armadas ESPE. Todos los derechos reservados.
        </Copyright>
      </Footer>
    </DashboardContainer>
  
  );
};

export default Dashboard;
