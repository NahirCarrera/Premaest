import { DashboardContainer } from './styles';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { UserData } from '@/types/auth';

interface LayoutProps {
  user: UserData;
  children: React.ReactNode;
  currentPeriod?: {
    code: string;
    start_date: string;
    end_date: string;
  };
  activePage?: string;
}

export const Layout = ({ 
  user, 
  children, 
  currentPeriod, 
  activePage 
}: LayoutProps) => {
  return (
    <DashboardContainer>
      <Header user={user} />
      <Sidebar user={user} activePage={activePage} />
      {children}
      <Footer />
    </DashboardContainer>
  );
};