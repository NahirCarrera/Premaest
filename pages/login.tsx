import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ApiResponse } from '@/types/auth';
import styled , { keyframes } from 'styled-components';
import Image from 'next/image';
import { FaUser, FaLock } from 'react-icons/fa';

// Paleta de colores mejorada
const colors = {
  primary: '#086e3a',
  primaryLight: 'rgba(8, 110, 58, 0.2)',
  primaryDark: '#054929',
  black: '#1a1a1a',
  gray: '#f8f9fa',
  white: '#ffffff',
  glass: 'rgba(255, 255, 255, 0.25)'
};

// Contenedor principal con fondo elegante
const MainContainer = styled.div`
  min-height: 100vh;
  max-height: 100vh; 
  overflow: hidden; 
  background: 
    linear-gradient(135deg, ${colors.gray} 0%, ${colors.white} 100%),
    url('/images/login-bg.jpg') no-repeat center center;
  background-size: cover;
  background-blend-mode: overlay;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

// Panel flotante dividido
const FloatingPanel = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
`;

// Lado izquierdo (formulario)
const FormSide = styled.div`
  background: ${colors.glass};
  backdrop-filter: blur(16px);
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

// Lado derecho (información)
const InfoSide = styled.div`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  color: ${colors.white};
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    transform: rotate(30deg);
  }
`;

const SystemTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

const SystemDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 2rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin-top: 2rem;

  li {
    position: relative;
    padding-left: 2rem;
    margin-bottom: 1rem;
    font-size: 0.95rem;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: ${colors.white};
      font-weight: bold;
    }
  }
`;

// Componentes del formulario (modificados)
const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${colors.black};
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.black};
`;

const Input = styled.input`
  width: 85%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryLight};
    background: ${colors.white};
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${colors.primary};
  color: ${colors.white};
  font-weight: 600;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(8, 110, 58, 0.2);
  }

  &:disabled {
    background: rgba(8, 110, 58, 0.5);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  text-align: center;
  padding: 0.75rem;
  background: rgba(229, 62, 62, 0.1);
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const StyledInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
`;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Credenciales incorrectas');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Iniciar sesión | PREMAEST</title>
        <meta name="description" content="Sistema de prematrículas para estudiantes" />
      </Head>

      <MainContainer>
        <FloatingPanel>
          <FormSide>
            <FormContainer>
              <Image 
                src="/images/logo_espe.png"
                alt="Logo PREMAEST"
                width={300}
                height={80}
                priority
                style={{ margin: '0 auto 2rem', display: 'block' }}
              />
              
             
              
              {error && <ErrorMessage>{error}</ErrorMessage>}

              <Form onSubmit={handleLogin}>
                <InputGroup>
                  <StyledInputWrapper>
                    <StyledIcon><FaUser /></StyledIcon>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Usuario"
                      disabled={isLoading}
                    />
                  </StyledInputWrapper>
                  
                </InputGroup>

                <InputGroup>
                <StyledInputWrapper>
                  <StyledIcon><FaLock /></StyledIcon>
                  <Input
              
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder= "Contraseña"
                    disabled={isLoading}
                  />
                </StyledInputWrapper>
                  
                </InputGroup>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
                </Button>
              </Form>
            </FormContainer>
          </FormSide>

          <InfoSide>
            <SystemTitle>PREMAEST</SystemTitle>
            <SystemDescription>
              Sistema integral de prematrículas para estudiantes de la ESPE.
              Accede a tu perfil y planifica tu semestre académico.
            </SystemDescription>
            
            <FeatureList>
              <li>Registro de Asignaturas Aprobadas</li>
              <li>Previsualización de Cursos Disponibles</li>
              <li>Planificación de Matrículas</li>
            </FeatureList>
          </InfoSide>
        </FloatingPanel>
      </MainContainer>
    </>
  );
}