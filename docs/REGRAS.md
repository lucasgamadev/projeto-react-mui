# Regras de Desenvolvimento

## Workflow de Atividades

### Regras Principais (seguir os itens abaixo em ordem sequencial)

- Regra 1: Antes de qualquer implementação, criar um novo arquivo `data-workflow-nome-da-atividade.md` com o nome específico para a atividade solicitada e manter o progresso da atividade atualizado no arquivo, sempre que possível com o nome em PT-BR e criar o arquivo no diretório `workflow` localizado na pasta `docs`. O início do nome do arquivo deve seguir o padrão Ano/Mês/Dia para facilitar a organização cronológica, usar o comando `Get-Date -Format "yyyy-MM-dd"` para capturar data atual no terminal do Windows ou comando `date +%Y-%m-%d` para no terminal do Linux.
- Regra 2: Consultar o arquivo `ESTRUTURA.md` na pasta `docs` para entender a organização do projeto, estrutura de diretórios e localização dos arquivos principais.
- Regra 3: Após a análise inicial, elaborar perguntas relevantes ao usuário para esclarecer os requisitos e detalhes da atividade a ser implementada.
- Regra 4: Sempre manter o arquivo `data-workflow-nome-da-atividade.md` atualizado com o progresso da atividade.

### Passos do Workflow

1. Análise Inicial:
   - Analisar o código existente relacionado à atividade
   - Identificar pontos de integração e implementação
   - Levantar referências e recursos necessários
   - Verificar implementações similares ou reutilizáveis
   - Documentar dependências e requisitos técnicos

2. Para cada nova tarefa:
   - Registrar tudo no arquivo `data-workflow-nome-da-atividade.md` específico
   - Detalhar todos os passos necessários para completar a atividade
   - Dividir a implementação em etapas claras e gerenciáveis
   - Se a tarefa for complexa, dividir em subtarefas menores
   - Marcar com [⏳] as tarefas pendentes
   - Marcar com [✅] as tarefas concluídas
   - Marcar com [❌] as tarefas com problemas
   - Marcar com [🔄] as tarefas em desenvolvimento

3. Processo de Desenvolvimento:
   - Implementar um passo por vez, seguindo a ordem estabelecida
   - Atualizar o `data-workflow-nome-da-atividade.md` conforme cada etapa é concluída
   - Prosseguir para o próximo passo sem solicitar confirmações intermediárias
   - Manter o foco até a conclusão total da atividade
   - Documentar decisões técnicas importantes  

4. Boas Práticas:
   - Documentar claramente cada passo realizado
   - Manter o workflow atualizado com o progresso
   - Adicionar observações relevantes quando necessário
   - Registrar quaisquer desvios ou mudanças do plano original  
   - Manter um glossário de termos técnicos específicos do projeto  
   - Documentar configurações de ambiente necessárias  

5. Finalização:
   - Marcar cada etapa como concluída
   - Revisar o resultado final
   - Documentar lições aprendidas e pontos de melhoria  
   - Elaborar testes de validação  

6. Registro e Correção de Erros:
   - Documentar cada erro encontrado durante cada passo do workflow
   - Descrever detalhadamente o problema identificado
   - Marcar com [⏳] os erros pendentes de correção
   - Ao implementar uma solução, descrever a correção realizada
   - Marcar com [✅] os erros já solucionados
   - Manter o registro atualizado conforme novos erros são encontrados
