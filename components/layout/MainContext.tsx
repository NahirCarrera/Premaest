import styled from 'styled-components';
import { colors } from './styles';

export const MainContent = styled.main`
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

export const Panel = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  height: fit-content;
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${colors.mediumGray};
`;

export const PanelTitle = styled.h2`
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