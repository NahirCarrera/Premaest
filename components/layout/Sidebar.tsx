import Link from 'next/link';
import { 
  Sidebar, 
  NavMenu, 
  NavItem,
  SidebarFooter 
} from './styles';
import { 
  FiHome, 
  FiBook, 
  FiCalendar,
  FiInfo 
} from 'react-icons/fi';
import { UserData } from '@/types/auth';

interface SidebarProps {
  user: UserData;
  activePage?: string;
}

export const Sidebar = ({ user, activePage }: SidebarProps) => {
  return (
    <Sidebar>
      <NavMenu>
        <Link href="/dashboard" passHref>
          <NavItem active={activePage === 'dashboard'}>
            <FiHome /> Inicio
          </NavItem>
        </Link>
        <Link href="/registro-asignaturas" passHref>
          <NavItem active={activePage === 'registro-asignaturas'}>
            <FiBook /> Registro de Asignaturas
          </NavItem>
        </Link>
        <Link href="/asignaturas-aprobadas" passHref>
          <NavItem active={activePage === 'asignaturas-aprobadas'}>
            <FiBook /> Mis Asignaturas
          </NavItem>
        </Link>
        <Link href="/asignaturas-disponibles" passHref>
          <NavItem active={activePage === 'asignaturas-disponibles'}>
            <FiBook /> Mis Asignaturas Disponibles
          </NavItem>
        </Link>
        <Link href="/asignaturas-planificadas" passHref>
          <NavItem active={activePage === 'asignaturas-planificadas'}>
            <FiBook /> Asignaturas Planificadas
          </NavItem>
        </Link>
      </NavMenu>

      <SidebarFooter>
        v1.0.0
      </SidebarFooter>
    </Sidebar>
  );
};