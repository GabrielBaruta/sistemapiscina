# 🌊 LimpaPiscina - Sistema de Gestão para Piscineiros

Este projeto é uma aplicação web completa para gestão de serviços de manutenção de piscinas. O sistema conecta prestadores de serviço (piscineiros) aos seus clientes, permitindo agendamentos, vendas de produtos e gestão de contratos recorrentes.

> **Status:** 🚀 Concluído (Front-end com simulação de Banco de Dados via LocalStorage)

## 📋 Sobre o Projeto

O **LimpaPiscina** resolve o problema da informalidade na contratação de serviços de limpeza.
* **Para o Cliente:** Facilidade para solicitar orçamentos, comprar produtos químicos e formalizar o pagamento da mensalidade.
* **Para o Piscineiro:** Painel administrativo para gerir a agenda, cadastrar contratos personalizados e definir o valor/descrição do serviço para cada cliente.

## 🛠️ Tecnologias Utilizadas

* **HTML5 Semântico:** Estrutura organizada e acessível.
* **CSS3 Moderno:** Uso de Flexbox, CSS Grid e Variáveis (:root) para um layout responsivo e fácil manutenção.
* **JavaScript (Vanilla):** Lógica de autenticação, manipulação do DOM e persistência de dados.
* **LocalStorage:** Simulação de banco de dados para manter usuários, agendamentos e contratos salvos no navegador.

## ✨ Funcionalidades

### 👤 Área do Cliente
* **Loja Virtual:** Visualização de produtos de limpeza em layout de cards.
* **Orçamento:** Formulário inteligente para solicitar visita técnica (diagnóstico da piscina).
* **Pagamentos:** Visualização do contrato (valor e descrição definidos pelo piscineiro) e simulação de assinatura recorrente.

### 👮 Área do Administrador (Piscineiro)
* **Dashboard:** Acesso restrito via login.
* **Gestão de Agenda:** Visualizar e criar novos agendamentos de visita/limpeza.
* **Gestão de Contratos:** Cadastrar novos clientes, definindo **Valor Mensal** e **Descrição do Serviço** (ex: "Limpeza 2x na semana com cloro incluso").

---

## 🚀 Como Rodar o Projeto

1. Clone este repositório:
   ```bash
   git clone [https://github.com/SEU-USUARIO/LimpaPiscina.git](https://github.com/SEU-USUARIO/LimpaPiscina.git)
