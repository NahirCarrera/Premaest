import { 
  Footer, 
  FooterLinks, 
  FooterLink, 
  Copyright 
} from './styles';

export const Footer = () => {
  return (
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
  );
};