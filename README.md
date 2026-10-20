# Saldo Finance — Web App (v0.1)

Primeira versão web do Saldo Finance, com interface minimalista em verde-claro e layout responsivo para computador, tablet e celular.

## O que já funciona
- Alternância entre espaço pessoal e empresarial.
- Painel com entradas, saídas, saldo do período, histórico recente e gráfico por categoria.
- Cadastro de lançamentos de entrada e saída com descrição, valor, categoria, conta e data.
- Pesquisa no histórico e filtro por entradas/saídas.
- Exportação do histórico filtrado para CSV compatível com Excel.
- Visões demonstrativas de orçamento, metas, vencimentos e relatórios.
- Persistência no navegador via `localStorage`.
- Interface construída sem bibliotecas de execução; os arquivos funcionam em hospedagem estática.

## Como abrir
A forma mais simples é abrir `index.html` em um navegador moderno. Para rodar por servidor local, com Python 3 instalado:

```bash
python3 -m http.server 5173
```

Acesse `http://localhost:5173`.

## Organização
- `index.html`: entrada da aplicação.
- `src/app.js`: navegação, cálculos, formulários, persistência e exportação CSV.
- `src/styles.css`: identidade visual e responsividade.

## Limites desta primeira versão
Os dados são armazenados apenas no navegador atual. Não existe login, sincronização entre dispositivos, backend, integração bancária ou criptografia de dados em repouso. Os vencimentos, limites de orçamento e metas são demonstrativos. Não use informações financeiras reais ou sensíveis até conectar um backend seguro e implementar autenticação/autorização.
