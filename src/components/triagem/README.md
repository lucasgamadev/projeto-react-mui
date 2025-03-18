# Sistema de Triagem

## Visão Geral

O sistema de triagem foi desenvolvido para classificar pacientes de acordo com a urgência do atendimento, seguindo o Protocolo de Manchester, que é um método de triagem amplamente utilizado em serviços de emergência médica.

## Componentes Principais

### 1. Modelo de Dados (TriagemModel.js)

O modelo de dados inclui:

- Estrutura para classificação de risco (vermelho, laranja, amarelo, verde, azul)
- Definição de tempos máximos de espera para cada classificação
- Dados de sinais vitais e histórico relevante do paciente
- Funções para classificação automática de risco e cálculo de tempo estimado

### 2. Formulário de Triagem (FormularioTriagem.jsx)

Permite registrar:

- Dados do paciente
- Sinais vitais (pressão arterial, frequência cardíaca, etc.)
- Sintomas e queixas principais
- Histórico relevante (alergias, medicações, etc.)
- Observações da enfermagem

O formulário inclui lógica para:

- Adicionar e remover sintomas dinamicamente
- Calcular classificação de risco com base nos critérios do Protocolo de Manchester
- Validar dados inseridos

### 3. Dashboard de Triagem (Triagem.jsx)

Apresenta:

- Lista de pacientes aguardando triagem
- Pacientes já classificados por risco
- Estatísticas de atendimento
- Indicadores visuais para tempo de espera excedido
- Alertas para casos prioritários

## Fluxo de Utilização

1. Paciente chega ao serviço de saúde e é registrado
2. Profissional de enfermagem acessa a tela de triagem
3. Seleciona o paciente da lista de espera
4. Preenche o formulário com dados vitais e queixas
5. Sistema calcula automaticamente a classificação de risco
6. Paciente é adicionado à fila de atendimento de acordo com sua prioridade

## Classificação de Risco

- **Vermelho (Emergência)**: Atendimento imediato (0 min)
- **Laranja (Muito Urgente)**: Atendimento em até 10 min
- **Amarelo (Urgente)**: Atendimento em até 60 min
- **Verde (Pouco Urgente)**: Atendimento em até 120 min
- **Azul (Não Urgente)**: Atendimento em até 240 min

## Futuras Implementações

- Integração com prontuário eletrônico
- Sistema de notificação para equipe médica
- Estatísticas avançadas de tempo de atendimento
- Personalização dos critérios de classificação 
