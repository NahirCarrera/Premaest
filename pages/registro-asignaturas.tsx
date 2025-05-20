import { GetServerSideProps, NextPage } from 'next';
import { parse } from 'cookie';
import { UserData } from '@/types/auth';
import styled, { keyframes } from 'styled-components';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiBook, FiUser, FiCalendar, FiSettings, FiLogOut, FiChevronDown, FiUploadCloud } from 'react-icons/fi';
import { createClient } from '@supabase/supabase-js';

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

// Contenido principal
const MainContent = styled.main`
  grid-area: main;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const UploadCard = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: ${colors.primary};
  margin-bottom: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const Instructions = styled.div`
  background: ${colors.lightGray};
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  
  h2 {
    color: ${colors.primary};
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  ol {
    padding-left: 1.5rem;
    line-height: 1.6;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: ${colors.primary};
  color: ${colors.white};
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;
  font-weight: 600;
  
  &:hover {
    background: ${colors.primaryDark};
  }

  input {
    display: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.primaryDark};
  }

  &:disabled {
    background: ${colors.primaryLight};
    cursor: not-allowed;
  }
`;

const FileInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${colors.lightGray};
  border-radius: 8px;
  text-align: center;
`;

const StatusMessage = styled.div<{ error?: boolean }>`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.error ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)'};
  border-left: 4px solid ${props => props.error ? colors.danger : colors.success};
  border-radius: 4px;
  color: ${props => props.error ? colors.danger : colors.success};
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

interface SubjectRegistrationProps {
  user: UserData;
}

export const getServerSideProps: GetServerSideProps<SubjectRegistrationProps> = async ({ req }) => {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.mi_token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
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
    }
  }

  return {
    props: {
      user: userRecord
    }
  };
};

const SubjectRegistrationPage: NextPage<SubjectRegistrationProps> = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('record', selectedFile);

      const response = await fetch('/api/upload-record', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al procesar el archivo');
      }

      setMessage({
        text: result.message || 'Record académico procesado correctamente',
        error: false
      });

      setSelectedFile(null);
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Ocurrió un error al procesar el archivo',
        error: true
      });
    } finally {
      setIsUploading(false);
    }
  };

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
            <NavItem>
              <FiHome /> Inicio
            </NavItem>
          </Link>
          <Link href="/registro-asignaturas" passHref>
            <NavItem active>
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
        <UploadCard>
          <Title>
            <FiUploadCloud />
            Registro de Asignaturas Aprobadas
          </Title>
          
          <Instructions>
            <h2>Instrucciones para subir tu record académico:</h2>
            <ol>
              <li>Descarga tu record académico oficial del sistema de la universidad</li>
              <li>Asegúrate que el documento esté en formato PDF</li>
              <li>Verifica que toda la información sea legible y esté completa</li>
              <li>El archivo no debe superar los 5MB de tamaño</li>
            </ol>
          </Instructions>
          
          <UploadButton>
            <FiUploadCloud /> Seleccionar Record Académico (PDF)
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </UploadButton>
          
          {selectedFile && (
            <FileInfo>
              <p>Archivo seleccionado: <strong>{selectedFile.name}</strong></p>
              <p>Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </FileInfo>
          )}
          
          <SubmitButton 
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Subiendo...' : 'Subir Record Académico'}
          </SubmitButton>

          {message && (
            <StatusMessage error={message.error}>
              {message.text}
            </StatusMessage>
          )}
        </UploadCard>
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

export default SubjectRegistrationPage;