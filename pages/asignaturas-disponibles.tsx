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

interface AvailableSubject {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  subject_credits: number;
  subject_level: number;
  has_prerequisites: boolean;
}

interface Props {
  user: UserData;
  subjects: AvailableSubject[];
  plannedSubjectIds: number[];
  currentPeriodId: number;
  currentPeriodCode: string;
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

  // Obtener el período académico actual
  const { data: currentPeriod, error: periodError } = await supabase
    .from('registration_periods')
    .select('period_id, code')
    .order('start_date', { ascending: false })
    .limit(1)
    .single();

  if (periodError || !currentPeriod) {
    console.error('Error al obtener período actual:', periodError);
    return { 
      props: { 
        user,
        subjects: [],
        plannedSubjectIds: [],
        currentPeriodId: 0,
        currentPeriodCode: ''
      } 
    };
  }

  // Obtener asignaturas disponibles
  const { data: subjects, error: subjectsError } = await supabase
    .rpc('get_available_subjects_for_user', { p_user_id: user.id });

  if (subjectsError) {
    console.error('Error al obtener asignaturas disponibles:', subjectsError);
  }

  // Obtener asignaturas ya planificadas para el usuario y período actual
  const { data: plannedSubjects, error: plannedError } = await supabase
    .from('planned_subjects')
    .select('subject_id')
    .eq('student_id', user.id)
    .eq('period_id', currentPeriod.period_id);

  if (plannedError) {
    console.error('Error al obtener asignaturas planificadas:', plannedError);
  }

  return {
    props: {
      user,
      subjects: subjects || [],
      plannedSubjectIds: plannedSubjects ? plannedSubjects.map(s => s.subject_id) : [],
      currentPeriodId: currentPeriod.period_id,
      currentPeriodCode: currentPeriod.code
    }
  };
};

const AsignaturasDisponiblesPage: NextPage<Props> = ({ 
  user, 
  subjects, 
  plannedSubjectIds: initialPlannedSubjectIds, 
  currentPeriodId, 
  currentPeriodCode 
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>(initialPlannedSubjectIds);
  const [plannedSubjectIds, setPlannedSubjectIds] = useState<number[]>(initialPlannedSubjectIds);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const handleSelect = (subjectId: number) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
    setRegistrationStatus(null);
  };

  const registerSubjects = async () => {
    setIsRegistering(true);
    setRegistrationStatus(null);

    try {
      // Asignaturas nuevas seleccionadas ahora
      const newSelected = selectedSubjects;
      // Asignaturas previamente planificadas
      const previouslyPlanned = plannedSubjectIds;

      // Nuevas asignaturas a insertar
      const toInsert = newSelected.filter(id => !previouslyPlanned.includes(id));
      // Asignaturas a eliminar
      const toDelete = previouslyPlanned.filter(id => !newSelected.includes(id));

      // Insertar nuevas
      if (toInsert.length > 0) {
        const registrations = toInsert.map(subjectId => ({
          registration_date: new Date().toISOString().split('T')[0],
          student_id: user.id,
          subject_id: subjectId,
          period_id: currentPeriodId
        }));

        const { error: insertError } = await supabase
          .from('planned_subjects')
          .insert(registrations);

        if (insertError) {
          throw insertError;
        }
      }

      // Eliminar desmarcadas
      if (toDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('planned_subjects')
          .delete()
          .match({ student_id: user.id, period_id: currentPeriodId })
          .in('subject_id', toDelete);

        if (deleteError) {
          throw deleteError;
        }
      }

      setRegistrationStatus({
        success: true,
        message: `Asignaturas actualizadas exitosamente para el período ${currentPeriodCode}`
      });

      // Actualizar estados para mantener sincronía
      setPlannedSubjectIds([...newSelected]);
      setSelectedSubjects([...newSelected]);

    } catch (error) {
      console.error('Error al actualizar asignaturas:', error);
      setRegistrationStatus({
        success: false,
        message: 'Error al actualizar las asignaturas. Intente nuevamente.'
      });
    } finally {
      setIsRegistering(false);
      //redireccionar a la pagina de asignaturas planificadas sin window.location.href
        window.location.assign('/asignaturas-planificadas');
      
    }
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
            <NavItem>
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
          <Link href="/asignaturas-disponibles" passHref>
            <NavItem active>
              <FiBook /> Mis Asignaturas Disponibles
            </NavItem>
          </Link>
          <Link href="/asignaturas-planificadas" passHref>
                <NavItem><FiBook /> Asignaturas Planificadas</NavItem>
            </Link>
                    
        </NavMenu>
      </Sidebar>

      <MainContent>
        <Title>Asignaturas Disponibles para Registro</Title>
        
        {currentPeriodCode && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <strong>Período académico actual:</strong> {currentPeriodCode}
          </div>
        )}

        <Table>
          <thead>
            <tr>
              <th>Seleccionar</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Créditos</th>
              <th>Nivel</th>
              <th>Prerrequisitos</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <tr key={subject.subject_id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handleSelect(subject.subject_id)}
                      checked={selectedSubjects.includes(subject.subject_id)}
                    />
                  </td>
                  <td>{subject.subject_code}</td>
                  <td>{subject.subject_name}</td>
                  <td>{subject.subject_credits}</td>
                  <td>{subject.subject_level}</td>
                  <td>{subject.has_prerequisites ? 'Sí' : 'No'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>
                  No tienes asignaturas disponibles para registrar.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {selectedSubjects.length > 0 && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              onClick={registerSubjects}
              disabled={isRegistering}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                opacity: isRegistering ? 0.7 : 1
              }}
            >
              {isRegistering ? 'Registrando...' : `Registrar ${selectedSubjects.length} asignatura(s)`}
            </button>
          </div>
        )}

        {registrationStatus && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: registrationStatus.success 
              ? 'rgba(40, 167, 69, 0.1)' 
              : 'rgba(220, 53, 69, 0.1)',
            borderLeft: `4px solid ${registrationStatus.success 
              ? colors.success 
              : colors.danger}`,
            borderRadius: '4px',
            color: registrationStatus.success 
              ? colors.success 
              : colors.danger,
            textAlign: 'center'
          }}>
            {registrationStatus.message}
          </div>
        )}
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

export default AsignaturasDisponiblesPage;