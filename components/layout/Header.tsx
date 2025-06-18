import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Header, 
  Logo, 
  UserMenu, 
  UserButton, 
  UserAvatar, 
  UserDropdown, 
  DropdownItem 
} from './styles';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { UserData } from '@/types/auth';

interface HeaderProps {
  user: UserData;
}

export const Header = ({ user }: HeaderProps) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
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
  );
};