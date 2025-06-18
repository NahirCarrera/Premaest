import { GetServerSideProps, NextPage } from 'next';
import { parse } from 'cookie';
import { createClient } from '@supabase/supabase-js';
import styled, { keyframes } from 'styled-components';
import { UserData } from '@/types/auth';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiHome, FiBook, FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';

// Configuración de Supabase
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

interface PlannedSubject {
  name: string;
  code: string;
  credits: number;
  period: string;
}

interface Props {
  user: UserData;
  subjects: PlannedSubject[];
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.mi_token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    };
  }

  const user: UserData = JSON.parse(token);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('planned_subjects')
    .select(`
      subjects (
        name,
        code,
        credits
      ),
      registration_periods (
        code
      )
    `)
    .eq('student_id', user.id);

  if (error) {
    console.error(error);
    return { props: { user, subjects: [] } };
  }

  const subjects = data.map((entry: any) => ({
    name: entry.subjects.name,
    code: entry.subjects.code,
    credits: entry.subjects.credits,
    period: entry.registration_periods.code
  }));

  return {
    props: {
      user,
      subjects
    }
  };
};

const AsignaturasPlanificadasPage: NextPage<Props> = ({ user, subjects }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <PageContainer>
      <Header>
        <Logo>
          <Image 
            src="/images/logo-banner.webp" 
            alt="Logo PREMAEST" 
            width={120} 
            height={40}
          />
          
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
            <NavItem><FiHome /> Inicio</NavItem>
          </Link>
          <Link href="/registro-asignaturas" passHref>
            <NavItem><FiBook /> Registro de Asignaturas</NavItem>
          </Link>
          <Link href="/asignaturas-aprobadas" passHref>
            <NavItem><FiBook /> Mis Asignaturas</NavItem>
          </Link>
          <Link href="/asignaturas-disponibles" passHref>
            <NavItem><FiBook /> Asignaturas Disponibles</NavItem>
          </Link>
          <Link href="/asignaturas-planificadas" passHref>
            <NavItem active><FiBook /> Asignaturas Planificadas</NavItem>
          </Link>
        </NavMenu>
      </Sidebar>

      <MainContent>
        <Title>Mis Asignaturas Planificadas</Title>
        <Table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Créditos</th>
              <th>Periodo</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0 ? (
              subjects.map((subject, i) => (
                <tr key={i}>
                  <td>{subject.code}</td>
                  <td>{subject.name}</td>
                  <td>{subject.credits}</td>
                  <td>{subject.period}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>
                  No tienes asignaturas planificadas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </MainContent>

      <Footer>
        <FooterLinks>
          <FooterLink href="#">Términos de Servicio</FooterLink>
          <FooterLink href="#">Política de Privacidad</FooterLink>
          <FooterLink href="#">Contacto</FooterLink>
          <FooterLink href="#">Soporte Técnico</FooterLink>
        </FooterLinks>
        <Copyright>
          © 2025 Universidad de las Fuerzas Armadas ESPE. Todos los derechos reservados.
        </Copyright>
      </Footer>
    </PageContainer>
  );
};

export default AsignaturasPlanificadasPage;