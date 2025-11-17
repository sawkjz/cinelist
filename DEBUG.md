# Debug - Filmes não aparecem

## ✅ Backend está funcionando
- Spring Boot rodando na porta 8081
- API respondendo corretamente
- Exemplo de resposta: `{"page":1,"results":[...]}`

## Para verificar no navegador:

1. Abra http://localhost:5173 
2. Abra o DevTools (F12 ou Cmd+Option+I)
3. Vá na aba Console
4. Cole este código:

```javascript
fetch('http://localhost:8081/api/filmes/popular?page=1')
  .then(r => r.json())
  .then(data => {
    console.log('Filmes recebidos:', data.results.length);
    console.log('Primeiro filme:', data.results[0]);
  })
  .catch(err => console.error('Erro:', err));
```

## Possíveis problemas:

### 1. CORS bloqueado
Se ver erro de CORS, o Spring Boot precisa permitir a origem do frontend.

### 2. Frontend não está rodando
Verificar se `npm run dev` está ativo no terminal.

### 3. Cache do navegador
Fazer hard refresh: Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows)

### 4. Estado vazio no componente
Os filmes estão vindo, mas o estado não está sendo atualizado.

## Como resolver:

### Verificar se o frontend está rodando:
```bash
curl http://localhost:5173
```

### Verificar logs do frontend:
Olhe no terminal onde rodou `npm run dev` para ver se há erros.

### Testar a Edge Function do Supabase:
```bash
curl -L -X POST 'https://lwzsokvghmzfntzcxwqv.supabase.co/functions/v1/updateMovies' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3enNva3ZnaG16Zm50emN4d3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQzNTUsImV4cCI6MjA3ODk2MDM1NX0.jaVzSOdF2kR9YxSRLkxScf_ICivgNPPAYAktN4sUvhA' \
  --data '{}'
```
