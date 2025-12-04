import React from "react";

export function Contact() {
return (
<div
className="Contato"
style={{
padding: "60px 20px",
textAlign: "center",
backgroundColor: "#fdfdfd",
borderRadius: "20px",
boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
margin: "40px auto",
maxWidth: "900px",
transition: "transform 0.3s ease-in-out",
}}
>
<h2
style={{
fontFamily: "'Baloo 2', cursive",
color: "#5B191B",
fontSize: "3em",
marginBottom: "40px",
}}
>
Fale Conosco  </h2>

```
  <p
    style={{
      fontSize: "1.2em",
      marginBottom: "50px",
      color: "var(--neutral-dark)",
      maxWidth: "600px",
      margin: "0 auto 50px",
      lineHeight: "1.6",
      fontFamily: "'Baloo 2', cursive"
    }}
  >
    Tem alguma dúvida, sugestão ou quer fazer um pedido especial? Entre em
    contato com a gente! Nosso time está sempre pronto para te atender com
    aquele atendimento Prime!
  </p>

  <div
    className="footer-content"
    style={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "40px",
    }}
  >
    {/* Bloco de contato com efeito de hover */}
    <div
      className="footer-section"
      style={{
        backgroundColor: "#fff",
        borderRadius: "15px",
        boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
        padding: "30px 40px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
      }}
    >
      <h2
        style={{
          color: "#5B191B",
          fontFamily: "'Baloo 2', cursive",
          fontSize: "2em",
          marginBottom: "20px",
        }}
      >
        Contato Direto
      </h2>
      <ul className="contact-list" style={{ listStyle: "none", padding: 0 }}>
        <li
          style={{
            marginBottom: "15px",
            fontSize: "1.1em",
            transition: "color 0.3s ease",
          }}
        >
          <span className="contact-icon">📞</span> (16) 99196-5919
        </li>
        <li
          style={{
            marginBottom: "15px",
            fontSize: "1.1em",
          }}
        >
          <span className="contact-icon">📍</span> Av. Dr. Gildeney das Neves, 587 - São Carlos
        </li>
        <li
          style={{
            marginBottom: "15px",
            fontSize: "1.1em",
          }}
        >
          <span className="contact-icon">✉️</span> primeburguer@gmail.com
        </li>
      </ul>
    </div>
  </div>

  {/* Pequena animação no final */}
  <p
    style={{
      marginTop: "60px",
      fontSize: "1em",
      color: "var(--secondary)",
      fontFamily: "'Baloo 2', cursive",
      animation: "pulse 2s infinite",
    }}
  >
    Estamos prontos para te atender com sabor e carinho 💛
  </p>

  <style>
    {`
      @keyframes pulse {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.03); }
        100% { opacity: 1; transform: scale(1); }
      }
    `}
  </style>
</div>

);
}
